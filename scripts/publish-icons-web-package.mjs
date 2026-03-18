#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT_DIR = process.cwd();
const PACKAGE_DIST_DIR = path.join(ROOT_DIR, "dist", "npm", "design-icons-web");
const PACKAGE_NAME = "@101/design-icons-web";
const RELEASE_TAG_PATTERN =
  /^design-icons-web-v(?<version>\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)$/;

const resolveReleaseVersion = () => {
  const releaseTag = process.env.CI_COMMIT_TAG?.trim();
  if (!releaseTag) {
    throw new Error("CI_COMMIT_TAG is required to publish the web icons package.");
  }

  const releaseMatch = releaseTag.match(RELEASE_TAG_PATTERN);
  if (!releaseMatch?.groups?.version) {
    throw new Error(
      `Invalid tag format: ${releaseTag}. Expected design-icons-web-vX.Y.Z[-prerelease][+build].`,
    );
  }

  return releaseMatch.groups.version;
};

const buildPackage = async (packageVersion) => {
  const nodeExecutable = process.execPath;
  const buildScript = path.join(ROOT_DIR, "scripts", "build-icons-web-package.mjs");

  await execFileAsync(nodeExecutable, [buildScript], {
    cwd: ROOT_DIR,
    env: {
      ...process.env,
      DESIGN_ICONS_WEB_PACKAGE_VERSION: packageVersion,
    },
  });
};

const getRegistryUrl = () => {
  const explicitRegistry = process.env.DESIGN_ICONS_WEB_PACKAGE_REGISTRY?.trim();
  if (explicitRegistry) {
    return explicitRegistry.replace(/\/$/, "");
  }

  const apiUrl = process.env.CI_API_V4_URL?.trim();
  const projectId = process.env.CI_PROJECT_ID?.trim();
  if (!apiUrl || !projectId) {
    throw new Error(
      "GitLab registry location is missing. Set DESIGN_ICONS_WEB_PACKAGE_REGISTRY or CI_API_V4_URL + CI_PROJECT_ID.",
    );
  }

  return `${apiUrl}/projects/${projectId}/packages/npm`;
};

const getAuthToken = () => {
  const token =
    process.env.NODE_AUTH_TOKEN?.trim() ||
    process.env.NPM_TOKEN?.trim() ||
    process.env.CI_JOB_TOKEN?.trim();

  if (!token) {
    throw new Error("Missing npm auth token. Set NODE_AUTH_TOKEN, NPM_TOKEN, or use CI_JOB_TOKEN.");
  }

  return token;
};

const writeNpmConfig = async (registryUrl, authToken) => {
  const registryHostPath = registryUrl.replace(/^https?:\/\//, "");
  const npmConfigPath = path.join(PACKAGE_DIST_DIR, ".npmrc");
  const npmConfig = [
    `@101:registry=${registryUrl}/`,
    `//${registryHostPath}/:_authToken=${authToken}`,
  ].join("\n");

  await writeFile(npmConfigPath, `${npmConfig}\n`, "utf8");
};

const publishPackage = async (registryUrl) => {
  await execFileAsync(
    "npm",
    [
      "publish",
      "--registry",
      `${registryUrl}/`,
      "--userconfig",
      path.join(PACKAGE_DIST_DIR, ".npmrc"),
    ],
    {
      cwd: PACKAGE_DIST_DIR,
      env: process.env,
    },
  );
};

const run = async () => {
  try {
    const packageVersion = resolveReleaseVersion();
    const registryUrl = getRegistryUrl();
    const authToken = getAuthToken();

    await buildPackage(packageVersion);
    await writeNpmConfig(registryUrl, authToken);
    await publishPackage(registryUrl);

    console.log(`[publish:icons:web-package] package: ${PACKAGE_NAME}@${packageVersion}`);
    console.log(`[publish:icons:web-package] registry: ${registryUrl}/`);
    console.log("[publish:icons:web-package] complete");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[publish:icons:web-package] failed: ${message}`);
    process.exit(1);
  }
};

await run();

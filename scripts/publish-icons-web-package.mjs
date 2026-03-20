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
const DEFAULT_INITIAL_VERSION = "1.0.0";

const parseSemver = (version) => {
  const match = version.match(
    /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/,
  );

  if (!match?.groups) {
    throw new Error(`Invalid semver version: ${version}`);
  }

  return {
    major: Number(match.groups.major),
    minor: Number(match.groups.minor),
    patch: Number(match.groups.patch),
  };
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

const readPublishedField = async (registryUrl, packageVersion, fieldName) => {
  try {
    const { stdout } = await execFileAsync(
      "npm",
      ["view", `${PACKAGE_NAME}@${packageVersion}`, fieldName, "--registry", `${registryUrl}/`],
      {
        cwd: ROOT_DIR,
        env: process.env,
      },
    );

    const value = stdout.trim();
    return value || null;
  } catch (error) {
    const stderr =
      error && typeof error === "object" && "stderr" in error ? String(error.stderr || "") : "";
    const stdout =
      error && typeof error === "object" && "stdout" in error ? String(error.stdout || "") : "";
    const output = `${stdout}\n${stderr}`.trim();

    if (/E404|404|not found/i.test(output)) {
      return null;
    }

    throw new Error(`Failed to read ${fieldName} from registry: ${output || "unknown error"}`);
  }
};

const ensureCommitIsAvailable = async (commitSha) => {
  try {
    await execFileAsync("git", ["cat-file", "-e", `${commitSha}^{commit}`], {
      cwd: ROOT_DIR,
      env: process.env,
    });
  } catch {
    try {
      await execFileAsync("git", ["fetch", "--unshallow", "origin"], {
        cwd: ROOT_DIR,
        env: process.env,
      });
    } catch {
      await execFileAsync("git", ["fetch", "origin"], {
        cwd: ROOT_DIR,
        env: process.env,
      });
    }

    await execFileAsync("git", ["cat-file", "-e", `${commitSha}^{commit}`], {
      cwd: ROOT_DIR,
      env: process.env,
    });
  }
};

const ensureIconsChangedSinceLastRelease = async (lastReleasedSourceCommit) => {
  if (!lastReleasedSourceCommit) {
    return;
  }

  await ensureCommitIsAvailable(lastReleasedSourceCommit);

  const { stdout } = await execFileAsync(
    "git",
    ["diff", "--name-only", `${lastReleasedSourceCommit}..HEAD`, "--", "icons"],
    {
      cwd: ROOT_DIR,
      env: process.env,
    },
  );

  if (!stdout.trim()) {
    throw new Error("No changes detected in icons/ since the last published version.");
  }
};

const readLatestPublishedVersion = async (registryUrl) => {
  const explicitVersion = process.env.DESIGN_ICONS_WEB_PACKAGE_VERSION?.trim();
  if (explicitVersion) {
    return explicitVersion;
  }

  try {
    const { stdout } = await execFileAsync(
      "npm",
      ["view", PACKAGE_NAME, "version", "--registry", `${registryUrl}/`],
      {
        cwd: ROOT_DIR,
        env: process.env,
      },
    );

    return stdout.trim() || null;
  } catch (error) {
    const stderr =
      error && typeof error === "object" && "stderr" in error ? String(error.stderr || "") : "";
    const stdout =
      error && typeof error === "object" && "stdout" in error ? String(error.stdout || "") : "";
    const output = `${stdout}\n${stderr}`.trim();

    if (/E404|404|not found/i.test(output)) {
      return null;
    }

    throw new Error(
      `Failed to read latest published version from registry: ${output || "unknown error"}`,
    );
  }
};

const resolveNextPatchVersion = async (latestPublishedVersion) => {
  const explicitVersion = process.env.DESIGN_ICONS_WEB_PACKAGE_VERSION?.trim();
  if (explicitVersion) {
    return explicitVersion;
  }
  if (!latestPublishedVersion) {
    return DEFAULT_INITIAL_VERSION;
  }

  const { major, minor, patch } = parseSemver(latestPublishedVersion);
  return `${major}.${minor}.${patch + 1}`;
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
    const registryUrl = getRegistryUrl();
    const authToken = getAuthToken();
    const latestPublishedVersion = await readLatestPublishedVersion(registryUrl);
    const lastReleasedSourceCommit = latestPublishedVersion
      ? await readPublishedField(registryUrl, latestPublishedVersion, "designTokensSourceCommit")
      : null;
    await ensureIconsChangedSinceLastRelease(lastReleasedSourceCommit);
    const packageVersion = await resolveNextPatchVersion(latestPublishedVersion);

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

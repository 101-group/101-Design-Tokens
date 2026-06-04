#!/usr/bin/env node
import { copyFile, mkdir, mkdtemp, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT_DIR = process.cwd();
const PACKAGE_NAME = "@101app/design-tokens-web";
const PACKAGE_SCOPE = "@101app";
const DEFAULT_DEVELOPMENT_VERSION = "0.0.0-development";
const DEFAULT_REGISTRY_URL = "https://registry.npmjs.org";

const RELEASE_PATHS = [
  "web/tokens.css",
  "web/icons",
];

const isDryRun = process.argv.includes("--dry-run");

const parseSemver = (version) => {
  const match = String(version || "").match(
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

const isSemver = (version) => {
  try {
    parseSemver(version);
    return true;
  } catch {
    return false;
  }
};

const getPackageVersion = () => {
  const explicitVersion = process.env.DESIGN_TOKENS_PACKAGE_VERSION?.trim();
  if (explicitVersion) {
    if (!isSemver(explicitVersion)) {
      throw new Error(`DESIGN_TOKENS_PACKAGE_VERSION must be semver: ${explicitVersion}`);
    }
    return explicitVersion;
  }

  const githubRefName = process.env.GITHUB_REF_NAME?.trim();
  if (githubRefName && isSemver(githubRefName)) {
    return githubRefName;
  }

  const gitlabTag = process.env.CI_COMMIT_TAG?.trim();
  if (gitlabTag) {
    if (!isSemver(gitlabTag)) {
      throw new Error(`CI_COMMIT_TAG must be semver: ${gitlabTag}`);
    }
    return gitlabTag;
  }

  if (isDryRun) {
    return DEFAULT_DEVELOPMENT_VERSION;
  }

  throw new Error("Missing package version. Set DESIGN_TOKENS_PACKAGE_VERSION or run from a semver GitHub tag.");
};

const getRegistryUrl = () => {
  return (process.env.DESIGN_TOKENS_PACKAGE_REGISTRY?.trim() || DEFAULT_REGISTRY_URL).replace(/\/$/, "");
};

const getAuthToken = () => {
  const token = process.env.NODE_AUTH_TOKEN?.trim() || process.env.NPM_TOKEN?.trim();
  if (!token) {
    throw new Error("Missing npm auth token. Set NODE_AUTH_TOKEN or NPM_TOKEN.");
  }
  return token;
};

const resolveSourceCommit = async () => {
  const githubSha = process.env.GITHUB_SHA?.trim();
  if (githubSha) {
    return githubSha;
  }

  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], {
      cwd: ROOT_DIR,
      env: process.env,
    });
    return stdout.trim() || null;
  } catch {
    return null;
  }
};

const ensureRequiredPathExists = async (relativePath) => {
  try {
    await stat(path.join(ROOT_DIR, relativePath));
  } catch {
    throw new Error(`Required release path is missing: ${relativePath}`);
  }
};

const validateReleasePaths = async () => {
  await Promise.all(RELEASE_PATHS.map((relativePath) => ensureRequiredPathExists(relativePath)));
};

const createTempPackageDir = async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "design-tokens-package-"));
  const packageDir = path.join(tempRoot, "package");
  await mkdir(packageDir, { recursive: true });
  return { tempRoot, packageDir };
};

const shouldSkipCopyEntry = (entryName) => {
  return entryName === ".DS_Store" || entryName === ".git" || entryName === "node_modules";
};

const copyPath = async (sourcePath, destinationPath) => {
  const sourceStat = await stat(sourcePath);
  if (sourceStat.isDirectory()) {
    await mkdir(destinationPath, { recursive: true });
    const entries = await readdir(sourcePath, { withFileTypes: true });
    await Promise.all(
      entries
        .filter((entry) => !shouldSkipCopyEntry(entry.name))
        .map((entry) => copyPath(path.join(sourcePath, entry.name), path.join(destinationPath, entry.name))),
    );
    return;
  }

  await mkdir(path.dirname(destinationPath), { recursive: true });
  await copyFile(sourcePath, destinationPath);
};

const copyReleasePaths = async (packageDir) => {
  await copyFile(path.join(ROOT_DIR, "web", "tokens.css"), path.join(packageDir, "tokens.css"));
  await copyPath(path.join(ROOT_DIR, "web", "icons"), path.join(packageDir, "icons"));
};

const createPackageMetadata = (version, sourceCommit) => {
  return {
    name: PACKAGE_NAME,
    version,
    private: false,
    description: "101 web design tokens and generated SVG icons.",
    type: "module",
    style: "tokens.css",
    exports: {
      "./tokens.css": "./tokens.css",
      "./icons/*": "./icons/*",
      "./package.json": "./package.json",
    },
    files: ["tokens.css", "icons"],
    sideEffects: ["*.css", "**/*.css"],
    publishConfig: {
      access: "public",
    },
    ...(sourceCommit ? { designTokensSourceCommit: sourceCommit } : {}),
  };
};

const writePackageFiles = async (packageDir, packageVersion, sourceCommit) => {
  await writeFile(
    path.join(packageDir, "package.json"),
    `${JSON.stringify(createPackageMetadata(packageVersion, sourceCommit), null, 2)}\n`,
    "utf8",
  );
};

const writeNpmConfig = async (packageDir, registryUrl, authToken) => {
  const registryHostPath = registryUrl.replace(/^https?:\/\//, "");
  const npmConfigPath = path.join(packageDir, ".npmrc");
  const npmConfig = [
    `${PACKAGE_SCOPE}:registry=${registryUrl}/`,
    `//${registryHostPath}/:_authToken=${authToken}`,
  ].join("\n");
  await writeFile(npmConfigPath, `${npmConfig}\n`, "utf8");
};

const npmEnvFor = (tempRoot) => ({
  ...process.env,
  NPM_CONFIG_CACHE: path.join(tempRoot, "npm-cache"),
});

const runNpmPackDryRun = async (packageDir, npmEnv) => {
  const { stdout } = await execFileAsync("npm", ["pack", "--dry-run", "--json"], {
    cwd: packageDir,
    env: npmEnv,
  });
  process.stdout.write(stdout);
};

const publishPackage = async (packageDir, registryUrl, npmEnv) => {
  await execFileAsync(
    "npm",
    ["publish", "--access", "public", "--registry", `${registryUrl}/`, "--userconfig", path.join(packageDir, ".npmrc")],
    {
      cwd: packageDir,
      env: npmEnv,
    },
  );
};

const run = async () => {
  let tempRoot = null;

  try {
    const packageVersion = getPackageVersion();
    const sourceCommit = await resolveSourceCommit();
    await validateReleasePaths();

    const tempPaths = await createTempPackageDir();
    tempRoot = tempPaths.tempRoot;
    const packageDir = tempPaths.packageDir;

    await copyReleasePaths(packageDir);
    await writePackageFiles(packageDir, packageVersion, sourceCommit);

    const npmEnv = npmEnvFor(tempRoot);
    await runNpmPackDryRun(packageDir, npmEnv);

    console.log(`[publish:design-tokens-web] package: ${PACKAGE_NAME}@${packageVersion}`);
    console.log(`[publish:design-tokens-web] staging: ${packageDir}`);

    if (isDryRun) {
      console.log("[publish:design-tokens-web] dry-run complete");
      return;
    }

    const registryUrl = getRegistryUrl();
    await writeNpmConfig(packageDir, registryUrl, getAuthToken());
    await publishPackage(packageDir, registryUrl, npmEnv);
    console.log(`[publish:design-tokens-web] registry: ${registryUrl}/`);
    console.log("[publish:design-tokens-web] complete");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[publish:design-tokens-web] failed: ${message}`);
    process.exit(1);
  } finally {
    if (tempRoot) {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
};

await run();

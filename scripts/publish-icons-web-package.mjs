#!/usr/bin/env node
import { copyFile, mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT_DIR = process.cwd();
const ICONS_SOURCE_DIR = path.join(ROOT_DIR, "icons", "web");
const PACKAGE_NAME = "@101/design-icons-web";
const DEFAULT_INITIAL_VERSION = "1.0.0";
const DEFAULT_DEVELOPMENT_VERSION = "0.0.0-development";
const ICON_CATEGORIES = ["monochrome", "multicolor"];

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

const isSvgFileName = (fileName) => path.extname(fileName).toLowerCase() === ".svg";

const createTempPackageDir = async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "design-icons-web-"));
  const packageDir = path.join(tempRoot, "package");
  await mkdir(packageDir, { recursive: true });
  return { tempRoot, packageDir };
};

const writeNpmConfig = async (packageDir, registryUrl, authToken) => {
  const registryHostPath = registryUrl.replace(/^https?:\/\//, "");
  const npmConfigPath = path.join(packageDir, ".npmrc");
  const npmConfig = [
    `@101:registry=${registryUrl}/`,
    `//${registryHostPath}/:_authToken=${authToken}`,
  ].join("\n");

  await writeFile(npmConfigPath, `${npmConfig}\n`, "utf8");
};

const validateDirectoryEntries = (directoryName, entries) => {
  const invalidEntry = entries.find((entry) => !entry.isFile() || !isSvgFileName(entry.name));
  if (!invalidEntry) {
    return;
  }

  const entryType = invalidEntry.isDirectory() ? "directory" : "non-SVG file";
  throw new Error(
    `Invalid ${entryType} in ${directoryName}: ${invalidEntry.name}. Only top-level .svg files are allowed.`,
  );
};

const copyCategoryIcons = async (packageDir, categoryName) => {
  const sourceDir = path.join(ICONS_SOURCE_DIR, categoryName);
  const destinationDir = path.join(packageDir, categoryName);
  const entries = await readdir(sourceDir, { withFileTypes: true });

  validateDirectoryEntries(path.join("icons", "web", categoryName), entries);
  await mkdir(destinationDir, { recursive: true });

  const svgEntries = entries.filter((entry) => entry.isFile() && isSvgFileName(entry.name));
  await Promise.all(
    svgEntries.map((entry) =>
      copyFile(path.join(sourceDir, entry.name), path.join(destinationDir, entry.name)),
    ),
  );

  return svgEntries.length;
};

const resolveSourceCommit = async () => {
  const ciCommitSha = process.env.CI_COMMIT_SHA?.trim();
  if (ciCommitSha) {
    return ciCommitSha;
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

const readPublishedField = async (registryUrl, packageVersion, fieldName, npmEnv) => {
  try {
    const { stdout } = await execFileAsync(
      "npm",
      ["view", `${PACKAGE_NAME}@${packageVersion}`, fieldName, "--registry", `${registryUrl}/`],
      {
        cwd: ROOT_DIR,
        env: npmEnv,
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

const readLatestPublishedVersion = async (registryUrl, npmEnv) => {
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
        env: npmEnv,
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

const createPackageMetadata = (version, sourceCommit) => {
  return {
    name: PACKAGE_NAME,
    version,
    private: false,
    type: "module",
    files: ["monochrome", "multicolor", "README.md"],
    sideEffects: false,
    publishConfig: {
      access: "restricted",
    },
    ...(sourceCommit ? { designTokensSourceCommit: sourceCommit } : {}),
  };
};

const createReadme = (version) => {
  return `# ${PACKAGE_NAME}

Version: ${version}

Raw SVG icons for web consumers. Import files directly and let the app bundler transform them.

Example:

\`\`\`ts
import ProjectIcon from "${PACKAGE_NAME}/monochrome/project.svg?component";
\`\`\`
`;
};

const buildPackage = async (packageDir, packageVersion, sourceCommit) => {
  let totalFiles = 0;

  for (const categoryName of ICON_CATEGORIES) {
    totalFiles += await copyCategoryIcons(packageDir, categoryName);
  }

  await writeFile(
    path.join(packageDir, "package.json"),
    `${JSON.stringify(createPackageMetadata(packageVersion, sourceCommit), null, 2)}\n`,
    "utf8",
  );
  await writeFile(path.join(packageDir, "README.md"), createReadme(packageVersion), "utf8");

  console.log(`[publish:icons:web-package] source: ${path.relative(ROOT_DIR, ICONS_SOURCE_DIR)}`);
  console.log(`[publish:icons:web-package] staging: ${packageDir}`);
  console.log(`[publish:icons:web-package] package: ${PACKAGE_NAME}@${packageVersion}`);
  console.log(`[publish:icons:web-package] files: ${totalFiles}`);
};

const checkPackage = async (packageDir, npmEnv) => {
  await execFileAsync("npm", ["pack", "--dry-run"], {
    cwd: packageDir,
    env: npmEnv,
  });
};

const publishPackage = async (packageDir, registryUrl, npmEnv) => {
  await execFileAsync(
    "npm",
    [
      "publish",
      "--registry",
      `${registryUrl}/`,
      "--userconfig",
      path.join(packageDir, ".npmrc"),
    ],
    {
      cwd: packageDir,
      env: npmEnv,
    },
  );
};

const isDryRun = process.argv.includes("--dry-run");

const run = async () => {
  let tempRoot = null;

  try {
    const sourceCommit = await resolveSourceCommit();
    const tempPaths = await createTempPackageDir();
    tempRoot = tempPaths.tempRoot;
    const packageDir = tempPaths.packageDir;
    const npmEnv = {
      ...process.env,
      NPM_CONFIG_CACHE: path.join(tempRoot, "npm-cache"),
    };

    if (isDryRun) {
      const packageVersion =
        process.env.DESIGN_ICONS_WEB_PACKAGE_VERSION?.trim() || DEFAULT_DEVELOPMENT_VERSION;
      await buildPackage(packageDir, packageVersion, sourceCommit);
      await checkPackage(packageDir, npmEnv);
      console.log("[publish:icons:web-package] dry-run complete");
      return;
    }

    const registryUrl = getRegistryUrl();
    const authToken = getAuthToken();
    const latestPublishedVersion = await readLatestPublishedVersion(registryUrl, npmEnv);
    const lastReleasedSourceCommit = latestPublishedVersion
      ? await readPublishedField(
          registryUrl,
          latestPublishedVersion,
          "designTokensSourceCommit",
          npmEnv,
        )
      : null;
    await ensureIconsChangedSinceLastRelease(lastReleasedSourceCommit);
    const packageVersion = await resolveNextPatchVersion(latestPublishedVersion);

    await buildPackage(packageDir, packageVersion, sourceCommit);
    await writeNpmConfig(packageDir, registryUrl, authToken);
    await publishPackage(packageDir, registryUrl, npmEnv);

    console.log(`[publish:icons:web-package] registry: ${registryUrl}/`);
    console.log("[publish:icons:web-package] complete");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[publish:icons:web-package] failed: ${message}`);
    process.exit(1);
  } finally {
    if (tempRoot) {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
};

await run();

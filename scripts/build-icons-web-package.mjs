#!/usr/bin/env node
import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT_DIR = process.cwd();
const ICONS_DIST_DIR = path.join(ROOT_DIR, "dist", "icons", "web");
const PACKAGE_DIST_DIR = path.join(ROOT_DIR, "dist", "npm", "design-icons-web");
const ICON_CATEGORIES = ["monochrome", "multicolor"];
const PACKAGE_NAME = "@101/design-icons-web";
const DEFAULT_PACKAGE_VERSION = "0.0.0-development";
const RELEASE_TAG_PATTERN =
  /^design-icons-web-v(?<version>\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)$/;

const isSvgFileName = (fileName) => path.extname(fileName).toLowerCase() === ".svg";

const resolvePackageVersion = () => {
  const explicitVersion = process.env.DESIGN_ICONS_WEB_PACKAGE_VERSION?.trim();
  if (explicitVersion) {
    return explicitVersion;
  }

  const releaseTag = process.env.CI_COMMIT_TAG?.trim();
  if (!releaseTag) {
    return DEFAULT_PACKAGE_VERSION;
  }

  const releaseMatch = releaseTag.match(RELEASE_TAG_PATTERN);
  if (!releaseMatch?.groups?.version) {
    return DEFAULT_PACKAGE_VERSION;
  }

  return releaseMatch.groups.version;
};

const runBuildIcons = async () => {
  const nodeExecutable = process.execPath;
  const buildScript = path.join(ROOT_DIR, "scripts", "build-icons.mjs");

  await execFileAsync(nodeExecutable, [buildScript], {
    cwd: ROOT_DIR,
    env: process.env,
  });
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

const copyCategoryIcons = async (categoryName) => {
  const sourceDir = path.join(ICONS_DIST_DIR, categoryName);
  const destinationDir = path.join(PACKAGE_DIST_DIR, categoryName);

  const entries = await readdir(sourceDir, { withFileTypes: true });
  validateDirectoryEntries(path.join("dist", "icons", "web", categoryName), entries);

  await mkdir(destinationDir, { recursive: true });

  const svgEntries = entries.filter((entry) => entry.isFile() && isSvgFileName(entry.name));
  await Promise.all(
    svgEntries.map((entry) =>
      copyFile(path.join(sourceDir, entry.name), path.join(destinationDir, entry.name)),
    ),
  );

  return svgEntries.length;
};

const createPackageMetadata = (version) => {
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

const rebuildIconsOutput = async () => {
  await runBuildIcons();
};

const buildWebIconsPackage = async () => {
  const packageVersion = resolvePackageVersion();

  await rebuildIconsOutput();
  await rm(PACKAGE_DIST_DIR, { recursive: true, force: true });
  await mkdir(PACKAGE_DIST_DIR, { recursive: true });

  let totalFiles = 0;
  for (const categoryName of ICON_CATEGORIES) {
    totalFiles += await copyCategoryIcons(categoryName);
  }

  const packageJsonPath = path.join(PACKAGE_DIST_DIR, "package.json");
  const readmePath = path.join(PACKAGE_DIST_DIR, "README.md");

  await writeFile(
    packageJsonPath,
    `${JSON.stringify(createPackageMetadata(packageVersion), null, 2)}\n`,
    "utf8",
  );
  await writeFile(readmePath, createReadme(packageVersion), "utf8");

  console.log(`[build:icons:web-package] source: ${path.relative(ROOT_DIR, ICONS_DIST_DIR)}`);
  console.log(`[build:icons:web-package] output: ${path.relative(ROOT_DIR, PACKAGE_DIST_DIR)}`);
  console.log(`[build:icons:web-package] package: ${PACKAGE_NAME}@${packageVersion}`);
  console.log(`[build:icons:web-package] files: ${totalFiles}`);
};

const run = async () => {
  try {
    await buildWebIconsPackage();
    console.log("[build:icons:web-package] complete");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[build:icons:web-package] failed: ${message}`);
    process.exit(1);
  }
};

await run();

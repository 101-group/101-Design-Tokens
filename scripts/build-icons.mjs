#!/usr/bin/env node
import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();
const ICONS_SOURCE_DIR = path.join(ROOT_DIR, "icons");
const ICONS_DIST_DIR = path.join(ROOT_DIR, "dist", "icons", "web");
const ICON_CATEGORIES = ["monochrome", "multicolor"];

const isSvgFileName = (fileName) => path.extname(fileName).toLowerCase() === ".svg";

const getDirectoryEntries = async (directoryPath) => {
  try {
    return await readdir(directoryPath, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      throw new Error(`Icons source directory is missing: ${path.relative(ROOT_DIR, directoryPath)}`);
    }
    throw error;
  }
};

const validateCategoryEntries = (categoryName, entries) => {
  const invalidEntry = entries.find((entry) => !entry.isFile() || !isSvgFileName(entry.name));
  if (!invalidEntry) {
    return;
  }

  const entryType = invalidEntry.isDirectory() ? "directory" : "non-SVG file";
  throw new Error(
    `Invalid ${entryType} in icons/${categoryName}: ${invalidEntry.name}. Only top-level .svg files are allowed.`,
  );
};

const copyCategoryIcons = async (categoryName) => {
  const sourceDir = path.join(ICONS_SOURCE_DIR, categoryName);
  const destinationDir = path.join(ICONS_DIST_DIR, categoryName);
  const entries = await getDirectoryEntries(sourceDir);

  validateCategoryEntries(categoryName, entries);

  await mkdir(destinationDir, { recursive: true });

  const svgEntries = entries.filter((entry) => entry.isFile() && isSvgFileName(entry.name));
  await Promise.all(
    svgEntries.map((entry) =>
      copyFile(path.join(sourceDir, entry.name), path.join(destinationDir, entry.name)),
    ),
  );

  return svgEntries.length;
};

const buildIcons = async () => {
  await rm(ICONS_DIST_DIR, { recursive: true, force: true });

  let totalFiles = 0;
  for (const categoryName of ICON_CATEGORIES) {
    totalFiles += await copyCategoryIcons(categoryName);
  }

  console.log(`[build:icons] source: ${path.relative(ROOT_DIR, ICONS_SOURCE_DIR)}`);
  console.log(`[build:icons] output: ${path.relative(ROOT_DIR, ICONS_DIST_DIR)}`);
  console.log(`[build:icons] files: ${totalFiles}`);
};

const run = async () => {
  try {
    await buildIcons();
    console.log("[build:icons] complete");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[build:icons] failed: ${message}`);
    process.exit(1);
  }
};

await run();

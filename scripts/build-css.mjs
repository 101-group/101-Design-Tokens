import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const SOURCE_FILE = path.resolve(process.cwd(), "tokens.json");
const OUTPUT_FILE = path.resolve(process.cwd(), "dist", "tokens.css");
const REF_PATTERN = /\{([^}]+)\}/g;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toKebabCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function collectTokens(node, prefix, out) {
  if (!isPlainObject(node)) {
    return;
  }

  if (Object.prototype.hasOwnProperty.call(node, "$value")) {
    out.set(prefix.join("."), {
      type: node.$type ?? "unknown",
      value: node.$value
    });
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) {
      continue;
    }
    if (!isPlainObject(value)) {
      continue;
    }
    collectTokens(value, [...prefix, key], out);
  }
}

function appendVariable(entries, parts, value) {
  if (isPlainObject(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      appendVariable(entries, [...parts, key], nestedValue);
    }
    return;
  }

  if (Array.isArray(value)) {
    entries.push([`--${parts.map(toKebabCase).join("-")}`, value.join(", ")]);
    return;
  }

  entries.push([`--${parts.map(toKebabCase).join("-")}`, String(value)]);
}

function dedupeAndSort(entries) {
  const map = new Map();
  for (const [name, value] of entries) {
    map.set(name, value);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function renderBlock(selector, entries) {
  const lines = entries.map(([name, value]) => `  ${name}: ${value};`);
  return `${selector} {\n${lines.join("\n")}\n}`;
}

const sourceRaw = await readFile(SOURCE_FILE, "utf8");
const source = JSON.parse(sourceRaw);

const setContainer = isPlainObject(source.global) ? source.global : {};
const globalSet = isPlainObject(setContainer.global) ? setContainer.global : {};
const componentsSet = isPlainObject(setContainer.components)
  ? setContainer.components
  : {};
const lightSetPrimary = isPlainObject(setContainer.light) ? setContainer.light : {};
const darkSetPrimary = isPlainObject(setContainer.dark) ? setContainer.dark : {};
const lightSetSecondary = isPlainObject(source.light) ? source.light : {};
const darkSetSecondary = isPlainObject(source.dark) ? source.dark : {};

const globalTokens = new Map();
const componentTokens = new Map();
const lightPrimaryTokens = new Map();
const darkPrimaryTokens = new Map();
const lightSecondaryTokens = new Map();
const darkSecondaryTokens = new Map();

collectTokens(globalSet, ["global"], globalTokens);
collectTokens(componentsSet, ["components"], componentTokens);
collectTokens(lightSetPrimary, ["light"], lightPrimaryTokens);
collectTokens(darkSetPrimary, ["dark"], darkPrimaryTokens);
collectTokens(lightSetSecondary, ["light"], lightSecondaryTokens);
collectTokens(darkSetSecondary, ["dark"], darkSecondaryTokens);

const allTokens = new Map([
  ...globalTokens.entries(),
  ...componentTokens.entries(),
  ...lightPrimaryTokens.entries(),
  ...darkPrimaryTokens.entries(),
  ...lightSecondaryTokens.entries(),
  ...darkSecondaryTokens.entries()
]);

if (allTokens.size === 0) {
  throw new Error("No tokens with $value were found in tokens.json");
}

const resolvedCache = new Map();

function resolveToken(tokenName, stack = []) {
  if (resolvedCache.has(tokenName)) {
    return resolvedCache.get(tokenName);
  }

  if (stack.includes(tokenName)) {
    throw new Error(`Circular token reference: ${[...stack, tokenName].join(" -> ")}`);
  }

  const token = allTokens.get(tokenName);
  if (!token) {
    throw new Error(`Unknown token reference: ${tokenName}`);
  }

  const resolvedValue = resolveValue(token.value, [...stack, tokenName]);
  resolvedCache.set(tokenName, resolvedValue);
  return resolvedValue;
}

function resolveValue(value, stack) {
  if (typeof value === "string") {
    return value.replace(REF_PATTERN, (_, rawRef) => {
      const refName = rawRef.trim();
      const refValue = resolveToken(refName, stack);
      if (isPlainObject(refValue) || Array.isArray(refValue)) {
        throw new Error(`Reference "${refName}" resolved to a non-scalar value`);
      }
      return String(refValue);
    });
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveValue(item, stack));
  }

  if (isPlainObject(value)) {
    const output = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      output[key] = resolveValue(nestedValue, stack);
    }
    return output;
  }

  return value;
}

function buildEntries(tokensMap, stripPrefix) {
  const entries = [];
  for (const tokenName of tokensMap.keys()) {
    const resolved = resolveToken(tokenName);
    const parts = tokenName.split(".");
    const variableParts =
      stripPrefix && parts[0] === stripPrefix ? parts.slice(1) : parts;
    appendVariable(entries, variableParts, resolved);
  }
  return dedupeAndSort(entries);
}

const rootEntries = dedupeAndSort([
  ...buildEntries(globalTokens),
  ...buildEntries(componentTokens),
  ...buildEntries(lightPrimaryTokens, "light"),
  ...buildEntries(lightSecondaryTokens, "light")
]);

const lightEntries = dedupeAndSort([
  ...buildEntries(lightPrimaryTokens, "light"),
  ...buildEntries(lightSecondaryTokens, "light")
]);

const darkEntries = dedupeAndSort([
  ...buildEntries(darkPrimaryTokens, "dark"),
  ...buildEntries(darkSecondaryTokens, "dark")
]);

const cssOutput = [
  "/* Auto-generated from tokens.json. Do not edit manually. */",
  "",
  renderBlock(":root", rootEntries),
  "",
  renderBlock('[data-theme="light"]', lightEntries),
  "",
  renderBlock('[data-theme="dark"]', darkEntries),
  ""
].join("\n");

await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
await writeFile(OUTPUT_FILE, cssOutput, "utf8");

console.log(`Generated ${OUTPUT_FILE}`);
console.log(`:root variables: ${rootEntries.length}`);
console.log(`[data-theme=\"light\"] variables: ${lightEntries.length}`);
console.log(`[data-theme=\"dark\"] variables: ${darkEntries.length}`);

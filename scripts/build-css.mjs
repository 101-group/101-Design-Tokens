function buildCss(context) {
  var tokens = Array.isArray(context.tokens) ? context.tokens : [];
  var helpers = context.helpers || {};
  var source = context && typeof context === "object" && context.source && typeof context.source === "object"
    ? context.source
    : null;
  var RESERVED_THEME_MODES = { light: true, dark: true, default: true };
  var EXACT_REF_PATTERN = /^\{([^{}]+)\}$/;
  var toKebabCase = helpers.toKebabCase || function (value) {
    return String(value)
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
  };
  function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }
  function toCssValue(value) {
    if (value === null || value === undefined) {
      throw new Error("Token resolved to null or undefined.");
    }
    if (Array.isArray(value)) {
      return value.map(function (item) {
        if (isPlainObject(item) || Array.isArray(item) || item === null || item === undefined) {
          throw new Error("Token resolved to a non-scalar array item.");
        }
        return String(item);
      }).join(", ");
    }
    if (isPlainObject(value)) {
      throw new Error("Token resolved to a non-scalar object.");
    }
    return String(value);
  }
  function isPxUnitVariable(varName) {
    var normalized = String(varName || "").toLowerCase().replace(/^--/, "");
    return (
      /(^|-)size-/.test(normalized) ||
      /(^|-)spacing-/.test(normalized) ||
      /(^|-)border-width-/.test(normalized) ||
      /(^|-)border-radius-/.test(normalized) ||
      /(^|-)icon-size-/.test(normalized)
    );
  }
  function includesMotionKeyword(value) {
    var normalized = toKebabCase(value);
    if (!normalized) {
      return false;
    }
    return normalized.split("-").indexOf("motion") !== -1;
  }
  function includesKeyword(value, keyword) {
    var normalized = toKebabCase(value);
    if (!normalized) {
      return false;
    }
    return normalized.split("-").indexOf(String(keyword || "")) !== -1;
  }
  function includesAllKeywords(value, keywords) {
    var normalized = toKebabCase(value);
    if (!normalized) {
      return false;
    }
    var segments = normalized.split("-");
    for (var index = 0; index < keywords.length; index += 1) {
      if (segments.indexOf(String(keywords[index] || "")) === -1) {
        return false;
      }
    }
    return true;
  }
  function isMotionEasingRecord(record) {
    if (!record) {
      return false;
    }
    var token = record.token || {};
    var pathParts = Array.isArray(token.pathParts) ? token.pathParts : [];

    var hasMotion =
      includesMotionKeyword(record.pathKey) ||
      includesMotionKeyword(token.path) ||
      includesMotionKeyword(token.collection);
    var hasEasing =
      includesKeyword(record.pathKey, "easing") ||
      includesKeyword(token.path, "easing");

    for (var index = 0; index < pathParts.length; index += 1) {
      if (!hasMotion && includesMotionKeyword(pathParts[index])) {
        hasMotion = true;
      }
      if (!hasEasing && includesKeyword(pathParts[index], "easing")) {
        hasEasing = true;
      }
    }
    return hasMotion && hasEasing;
  }
  function isMsUnitRecord(record) {
    if (!record) {
      return false;
    }
    if (includesMotionKeyword(record.pathKey)) {
      return true;
    }
    var token = record.token || {};
    if (includesMotionKeyword(token.path)) {
      return true;
    }
    if (includesMotionKeyword(token.collection)) {
      return true;
    }
    var pathParts = Array.isArray(token.pathParts) ? token.pathParts : [];
    for (var index = 0; index < pathParts.length; index += 1) {
      if (includesMotionKeyword(pathParts[index])) {
        return true;
      }
    }
    return false;
  }
  function withPxUnitIfNumeric(value) {
    if (typeof value === "number" && isFinite(value)) {
      return String(value) + "px";
    }
    if (typeof value === "string") {
      var trimmed = value.trim();
      if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
        return trimmed + "px";
      }
    }
    return value;
  }
  function withMsUnitIfNumeric(value) {
    if (typeof value === "number" && isFinite(value)) {
      return String(value) + "ms";
    }
    if (typeof value === "string") {
      var trimmed = value.trim();
      if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
        return trimmed + "ms";
      }
    }
    return value;
  }
  function isVarExpression(value) {
    return /^var\(\s*--[a-z0-9_-]+(?:\s*,[\s\S]+)?\)$/i.test(String(value || "").trim());
  }
  function isCubicBezierValue(value) {
    return /^cubic-bezier\(\s*[-+]?(?:\d+|\d*\.\d+)\s*,\s*[-+]?(?:\d+|\d*\.\d+)\s*,\s*[-+]?(?:\d+|\d*\.\d+)\s*,\s*[-+]?(?:\d+|\d*\.\d+)\s*\)$/i.test(String(value || "").trim());
  }
  function isEasingTupleValue(value) {
    return /^[-+]?(?:\d+|\d*\.\d+)\s*,\s*[-+]?(?:\d+|\d*\.\d+)\s*,\s*[-+]?(?:\d+|\d*\.\d+)\s*,\s*[-+]?(?:\d+|\d*\.\d+)$/i.test(String(value || "").trim());
  }
  function formatMotionEasingValue(value) {
    var normalized = String(value || "").trim();
    if (!normalized) {
      return normalized;
    }
    if (isVarExpression(normalized) || isCubicBezierValue(normalized)) {
      return normalized;
    }
    if (isEasingTupleValue(normalized)) {
      return "cubic-bezier(" + normalized + ")";
    }
    return normalized;
  }
  function formatValueForVariable(record, value) {
    var cssValue = toCssValue(value);
    if (isMotionEasingRecord(record)) {
      return formatMotionEasingValue(cssValue);
    }
    if (isMsUnitRecord(record)) {
      return withMsUnitIfNumeric(cssValue);
    }
    if (isPxUnitVariable(record.varName)) {
      return withPxUnitIfNumeric(cssValue);
    }
    return cssValue;
  }
  function dedupeAndSort(entries) {
    var map = new Map();
    entries.forEach(function (entry) { map.set(entry[0], entry[1]); });
    return Array.from(map.entries()).sort(function (a, b) {
      return a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: "base" });
    });
  }
  function renderBlock(selector, entries) {
    var lines = entries.map(function (entry) {
      var property = entry[0];
      var value = String(entry[1]);
      if (value.indexOf("\n") !== -1) {
        return "  " + property + ":" + value + ";";
      }
      return "  " + property + ": " + value + ";";
    });
    return selector + " {\n" + lines.join("\n") + "\n}";
  }
  function getModeMap(token) {
    if (token && token.modes && typeof token.modes === "object") {
      return token.modes;
    }
    return {};
  }
  function getModeValue(modes, preferredKeys) {
    var keys = Object.keys(modes || {});
    for (var i = 0; i < preferredKeys.length; i += 1) {
      var preferred = String(preferredKeys[i]).toLowerCase();
      for (var j = 0; j < keys.length; j += 1) {
        if (String(keys[j]).toLowerCase() === preferred) {
          return modes[keys[j]];
        }
      }
    }
    return null;
  }
  function buildVariableName(token, parts) {
    var normalizedParts = parts
      .map(function (part) { return toKebabCase(part); })
      .filter(function (part) { return part.length > 0; });
    if (!normalizedParts.length) {
      return "";
    }

    var collectionPrefix = toKebabCase(token && token.collection ? token.collection : "");
    if (collectionPrefix) {
      var firstPart = normalizedParts[0];
      var hasCollectionPrefix =
        firstPart === collectionPrefix;
      if (!hasCollectionPrefix) {
        normalizedParts.unshift(collectionPrefix);
      }
    }

    return "--" + normalizedParts.join("-");
  }
  function getTokenPathKey(token, parts) {
    var rawPath = token && typeof token.path === "string" && token.path.trim().length > 0
      ? token.path
      : parts.join(".");
    return String(rawPath).trim().toLowerCase();
  }
  function getReferencePath(value) {
    if (typeof value !== "string") {
      return null;
    }
    var match = value.trim().match(EXACT_REF_PATTERN);
    if (!match) {
      return null;
    }
    return match[1].trim().toLowerCase();
  }
  function selectRootRawValue(modes, modeKeys) {
    var rootValue = getModeValue(modes, ["value", "base", "global"]);
    if (rootValue === null && modeKeys.length === 1) {
      var onlyMode = String(modeKeys[0]).toLowerCase();
      if (!RESERVED_THEME_MODES[onlyMode]) {
        rootValue = modes[modeKeys[0]];
      }
    }
    return rootValue;
  }
  function selectLightRawValue(modes, modeKeys, rootValue) {
    var lightValue = getModeValue(modes, ["light", "default"]);
    if (lightValue === null && rootValue === null) {
      for (var lightIndex = 0; lightIndex < modeKeys.length; lightIndex += 1) {
        var modeName = String(modeKeys[lightIndex]).toLowerCase();
        if (modeName !== "dark") {
          lightValue = modes[modeKeys[lightIndex]];
          break;
        }
      }
    }
    return lightValue;
  }
  function selectSectionRawValue(record, section) {
    var modes = record.modes;
    var modeKeys = Object.keys(modes);
    if (!modeKeys.length) {
      return null;
    }
    var rootValue = selectRootRawValue(modes, modeKeys);
    if (section === "root") {
      return rootValue;
    }
    if (section === "light") {
      return selectLightRawValue(modes, modeKeys, rootValue);
    }
    if (section === "dark") {
      return getModeValue(modes, ["dark"]);
    }
    return null;
  }
  var tokenRecords = [];
  var tokenByPath = new Map();
  for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
    var token = tokens[tokenIndex];
    var parts = Array.isArray(token.pathParts) ? token.pathParts : String(token.path || "").split(".");
    if (!parts.length || !parts[0]) {
      continue;
    }
    var varName = buildVariableName(token, parts);
    if (!varName) {
      continue;
    }
    var modes = getModeMap(token);
    if (!Object.keys(modes).length) {
      continue;
    }
    var pathKey = getTokenPathKey(token, parts);
    var record = {
      token: token,
      varName: varName,
      modes: modes,
      pathKey: pathKey,
    };
    tokenRecords.push(record);
    if (pathKey) {
      tokenByPath.set(pathKey, record);
    }
  }
  function resolveSectionValue(record, section, visited, allowRootFallback) {
    var currentKey = record.pathKey || record.varName;
    if (visited.indexOf(currentKey) !== -1) {
      throw new Error("Circular token reference: " + visited.concat([currentKey]).join(" -> "));
    }
    var rawValue = selectSectionRawValue(record, section);
    if (rawValue === null) {
      if (allowRootFallback && section !== "root") {
        return resolveSectionValue(record, "root", visited, false);
      }
      return null;
    }
    var referencePath = getReferencePath(rawValue);
    if (!referencePath) {
      return rawValue;
    }
    var targetRecord = tokenByPath.get(referencePath);
    if (!targetRecord) {
      throw new Error("Unknown token reference: " + referencePath);
    }
    var resolvedForValidation = resolveSectionValue(targetRecord, section, visited.concat([currentKey]), true);
    if (resolvedForValidation === null) {
      throw new Error('Reference "' + referencePath + '" has no value for section "' + section + '".');
    }
    if (isPlainObject(resolvedForValidation) || Array.isArray(resolvedForValidation)) {
      throw new Error('Reference "' + referencePath + '" resolved to a non-scalar value.');
    }
    return "var(" + targetRecord.varName + ")";
  }
  function getRecordByPathCandidates(pathCandidates) {
    for (var candidateIndex = 0; candidateIndex < pathCandidates.length; candidateIndex += 1) {
      var candidate = String(pathCandidates[candidateIndex] || "").trim().toLowerCase();
      if (!candidate) {
        continue;
      }
      var hit = tokenByPath.get(candidate);
      if (hit) {
        return hit;
      }
    }
    return null;
  }
  function collectRecordsByPathPrefix(prefix) {
    var normalizedPrefix = String(prefix || "").trim().toLowerCase();
    if (!normalizedPrefix) {
      return [];
    }
    var result = [];
    for (var index = 0; index < tokenRecords.length; index += 1) {
      var record = tokenRecords[index];
      if (record.pathKey.indexOf(normalizedPrefix) === 0) {
        result.push(record);
      }
    }
    return result;
  }
  function getLastPathPart(pathKey) {
    var parts = String(pathKey || "").split(".");
    if (!parts.length) {
      return "";
    }
    return parts[parts.length - 1];
  }
  function toNumericString(value) {
    if (typeof value === "number" && isFinite(value)) {
      return String(value);
    }
    if (typeof value === "string") {
      var trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      var parsed = Number(trimmed);
      if (isFinite(parsed)) {
        return String(parsed);
      }
    }
    return null;
  }
  function toFontSizeCssValue(value) {
    if (typeof value === "string") {
      var trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      if (/^-?\d+(?:\.\d+)?px$/i.test(trimmed)) {
        return trimmed;
      }
    }
    var numeric = toNumericString(value);
    if (numeric === null) {
      return null;
    }
    return numeric + "px";
  }
  function toTitleCaseWords(value) {
    return String(value)
      .split(/[\s_-]+/)
      .filter(function (part) { return part.length > 0; })
      .map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); })
      .join(" ");
  }
  function toFontFamilyCssValue(value) {
    if (typeof value !== "string") {
      return null;
    }
    var trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    if (trimmed.indexOf(",") !== -1) {
      return trimmed;
    }
    var normalized = trimmed;
    if (!/^["'].*["']$/.test(normalized)) {
      if (normalized === normalized.toLowerCase()) {
        normalized = toTitleCaseWords(normalized);
      }
      normalized = '"' + normalized + '"';
    }
    return normalized + ", sans-serif";
  }
  function appendFontShorthandEntries(entries, section) {
    var familyRecord = getRecordByPathCandidates([
      "font.family.base",
      "font.family.default",
      "font.family",
    ]);
    if (!familyRecord) {
      return;
    }

    var familyRawValue = resolveSectionValue(familyRecord, section, [], true);
    if (familyRawValue === null) {
      return;
    }
    var familyCssValue = toFontFamilyCssValue(familyRawValue);
    if (!familyCssValue) {
      return;
    }

    var sizeRecords = collectRecordsByPathPrefix("font.size.");
    var weightRecords = collectRecordsByPathPrefix("font.weight.");
    if (!sizeRecords.length || !weightRecords.length) {
      return;
    }

    for (var sizeIndex = 0; sizeIndex < sizeRecords.length; sizeIndex += 1) {
      var sizeRecord = sizeRecords[sizeIndex];
      var sizeRawValue = resolveSectionValue(sizeRecord, section, [], true);
      if (sizeRawValue === null) {
        continue;
      }
      var fontSizeCss = toFontSizeCssValue(sizeRawValue);
      if (!fontSizeCss) {
        continue;
      }

      var sizeName = toKebabCase(getLastPathPart(sizeRecord.pathKey));
      if (!sizeName) {
        continue;
      }

      for (var weightIndex = 0; weightIndex < weightRecords.length; weightIndex += 1) {
        var weightRecord = weightRecords[weightIndex];
        var weightRawValue = resolveSectionValue(weightRecord, section, [], true);
        if (weightRawValue === null) {
          continue;
        }
        var fontWeightCss = toNumericString(weightRawValue);
        if (!fontWeightCss) {
          continue;
        }

        var weightName = toKebabCase(getLastPathPart(weightRecord.pathKey));
        if (!weightName) {
          continue;
        }

        entries.push([
          "--font-" + sizeName + "-" + weightName,
          fontWeightCss + " " + fontSizeCss + " " + familyCssValue,
        ]);
      }
    }
  }
  function resolveReferenceToCssVar(value) {
    var referencePath = getReferencePath(value);
    if (!referencePath) {
      return null;
    }
    var targetRecord = tokenByPath.get(referencePath);
    if (!targetRecord) {
      throw new Error("Unknown token reference: " + referencePath);
    }
    return "var(" + targetRecord.varName + ")";
  }
  function toCssNumberOrReference(value) {
    if (typeof value === "number" && isFinite(value)) {
      return String(value);
    }
    if (typeof value === "string") {
      var referenceValue = resolveReferenceToCssVar(value);
      if (referenceValue) {
        return referenceValue;
      }
      var trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      return trimmed;
    }
    return null;
  }
  function toCssLengthOrReference(value, unit) {
    if (typeof value === "number" && isFinite(value)) {
      return String(value) + unit;
    }
    if (typeof value === "string") {
      var referenceValue = resolveReferenceToCssVar(value);
      if (referenceValue) {
        return referenceValue;
      }
      var trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
        return trimmed + unit;
      }
      return trimmed;
    }
    return null;
  }
  function formatFontFamilyValue(value) {
    if (typeof value === "string") {
      var referenceValue = resolveReferenceToCssVar(value);
      if (referenceValue) {
        return referenceValue;
      }
    }
    return toFontFamilyCssValue(value);
  }
  function formatFontSizeValue(value) {
    return toCssLengthOrReference(value, "px");
  }
  function formatFontWeightValue(value) {
    return toCssNumberOrReference(value);
  }
  function formatLineHeightValue(value) {
    if (isPlainObject(value)) {
      if (value.unit === "AUTO") {
        return "normal";
      }
      if (value.unit === "PIXELS") {
        return toCssLengthOrReference(value.value, "px");
      }
      if (value.unit === "PERCENT") {
        return toCssLengthOrReference(value.value, "%");
      }
      return null;
    }
    return toCssNumberOrReference(value);
  }
  function formatLetterSpacingValue(value) {
    if (isPlainObject(value)) {
      if (value.unit === "PIXELS") {
        return toCssLengthOrReference(value.value, "px");
      }
      if (value.unit === "PERCENT") {
        var percentValue = toCssNumberOrReference(value.value);
        if (percentValue === null) {
          return null;
        }
        return "calc(1em * " + percentValue + " / 100)";
      }
      return null;
    }
    return toCssLengthOrReference(value, "px");
  }
  function formatTextTransformValue(value) {
    var normalized = String(value || "").trim().toUpperCase();
    if (normalized === "UPPER") return "uppercase";
    if (normalized === "LOWER") return "lowercase";
    if (normalized === "TITLE") return "capitalize";
    return null;
  }
  function formatFontVariantCapsValue(value) {
    var normalized = String(value || "").trim().toUpperCase();
    if (normalized === "SMALL_CAPS") return "small-caps";
    if (normalized === "SMALL_CAPS_FORCED") return "all-small-caps";
    return null;
  }
  function formatTextDecorationLineValue(value) {
    var normalized = String(value || "").trim().toUpperCase();
    if (normalized === "NONE") return "none";
    if (normalized === "UNDERLINE") return "underline";
    if (normalized === "STRIKETHROUGH") return "line-through";
    return null;
  }
  function formatTextDecorationColorValue(value) {
    if (!isPlainObject(value)) {
      return null;
    }
    if (value.value === "AUTO") {
      return null;
    }
    if (typeof value.value === "string") {
      var referenceValue = resolveReferenceToCssVar(value.value);
      if (referenceValue) {
        return referenceValue;
      }
      return value.value.trim();
    }
    return null;
  }
  function formatFontFeatureSettings(value) {
    if (!isPlainObject(value)) {
      return null;
    }
    var keys = Object.keys(value).sort();
    if (!keys.length) {
      return null;
    }
    var parts = [];
    for (var index = 0; index < keys.length; index += 1) {
      var featureKey = String(keys[index] || "").trim();
      if (!featureKey) {
        continue;
      }
      parts.push('"' + featureKey.toLowerCase() + '" ' + (value[featureKey] ? "1" : "0"));
    }
    return parts.length ? parts.join(", ") : null;
  }
  function formatFontStyleValue(value) {
    if (typeof value !== "string") {
      return null;
    }
    var referenceValue = resolveReferenceToCssVar(value);
    if (referenceValue) {
      return referenceValue;
    }
    var normalized = value.trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    if (normalized.indexOf("italic") !== -1) {
      return "italic";
    }
    if (normalized.indexOf("oblique") !== -1) {
      return "oblique";
    }
    return null;
  }
  function buildTextStyleClassName(pathParts) {
    var sourceParts = Array.isArray(pathParts) ? pathParts.slice() : [];
    if (sourceParts.length > 1) {
      sourceParts = sourceParts.slice(1);
    }
    var normalizedParts = [];
    for (var index = 0; index < sourceParts.length; index += 1) {
      var part = toKebabCase(sourceParts[index]);
      if (part) {
        normalizedParts.push(part);
      }
    }
    if (!normalizedParts.length) {
      return "";
    }
    return ".text-" + normalizedParts.join("-");
  }
  function buildEffectStyleClassName(pathParts) {
    var normalizedParts = [];
    for (var index = 0; index < pathParts.length; index += 1) {
      var part = toKebabCase(pathParts[index]);
      if (part) {
        normalizedParts.push(part);
      }
    }
    if (!normalizedParts.length) {
      return "";
    }
    return "." + normalizedParts.join("-");
  }
  function collectStyleRecords(sectionKey) {
    if (!source || !isPlainObject(source.styles)) {
      return [];
    }
    var sectionRoot = source.styles[sectionKey];
    if (!isPlainObject(sectionRoot)) {
      return [];
    }

    var records = [];
    function walk(node, pathParts) {
      if (!isPlainObject(node)) {
        return;
      }
      if (
        Object.prototype.hasOwnProperty.call(node, "$type") &&
        Object.prototype.hasOwnProperty.call(node, "value") &&
        isPlainObject(node.value)
      ) {
        records.push({
          pathParts: pathParts.slice(),
          pathKey: pathParts.join(".").toLowerCase(),
          type: String(node.$type || ""),
          value: node.value,
        });
        return;
      }

      var keys = Object.keys(node);
      for (var index = 0; index < keys.length; index += 1) {
        var key = keys[index];
        if (String(key).indexOf("$") === 0) {
          continue;
        }
        walk(node[key], pathParts.concat([key]));
      }
    }

    walk(sectionRoot, []);
    records.sort(function (a, b) {
      return a.pathKey.localeCompare(b.pathKey, undefined, { numeric: true, sensitivity: "base" });
    });
    return records;
  }
  function pushDeclaration(entries, property, value) {
    if (value === null || value === undefined) {
      return;
    }
    var normalized = String(value).trim();
    if (!normalized) {
      return;
    }
    entries.push([property, normalized]);
  }
  function escapeCommentText(value) {
    return String(value || "").replace(/\*\//g, "* /");
  }
  function formatShadowColor(value) {
    if (typeof value !== "string") {
      return null;
    }
    var referenceValue = resolveReferenceToCssVar(value);
    if (referenceValue) {
      return referenceValue;
    }
    var trimmed = value.trim();
    return trimmed || null;
  }
  function buildBoxShadowSegment(effect) {
    if (!isPlainObject(effect)) {
      return null;
    }
    var type = String(effect.type || "").trim().toUpperCase();
    if (type !== "DROP_SHADOW" && type !== "INNER_SHADOW") {
      return null;
    }
    if (effect.visible === false) {
      return null;
    }

    var offset = isPlainObject(effect.offset) ? effect.offset : {};
    var offsetX = toCssLengthOrReference(offset.x, "px") || "0";
    var offsetY = toCssLengthOrReference(offset.y, "px") || "0";
    var blur = toCssLengthOrReference(effect.radius, "px") || "0";
    var spread = toCssLengthOrReference(effect.spread, "px");
    var color = formatShadowColor(effect.color);
    if (!color) {
      return null;
    }

    var parts = [];
    if (type === "INNER_SHADOW") {
      parts.push("inset");
    }
    parts.push(offsetX);
    parts.push(offsetY);
    parts.push(blur);
    if (spread !== null) {
      parts.push(spread);
    }
    parts.push(color);
    return parts.join(" ");
  }
  function formatBoxShadowValue(segments) {
    if (!Array.isArray(segments) || !segments.length) {
      return null;
    }
    if (segments.length === 1) {
      return segments[0];
    }
    return "\n    " + segments.join(",\n    ");
  }
  function buildTextStyleEntries(record) {
    var value = isPlainObject(record.value) ? record.value : {};
    var entries = [];
    pushDeclaration(entries, "font-family", formatFontFamilyValue(value.fontFamily));
    pushDeclaration(entries, "font-size", formatFontSizeValue(value.fontSize));
    pushDeclaration(entries, "font-style", formatFontStyleValue(value.fontStyle));
    pushDeclaration(entries, "font-weight", formatFontWeightValue(value.fontWeight));
    pushDeclaration(entries, "line-height", formatLineHeightValue(value.lineHeight));
    pushDeclaration(entries, "letter-spacing", formatLetterSpacingValue(value.letterSpacing));
    pushDeclaration(entries, "text-transform", formatTextTransformValue(value.textCase));
    pushDeclaration(entries, "font-variant-caps", formatFontVariantCapsValue(value.textCase));
    pushDeclaration(entries, "text-decoration-line", formatTextDecorationLineValue(value.textDecoration));
    pushDeclaration(entries, "text-decoration-style", value.textDecorationStyle);
    pushDeclaration(entries, "text-decoration-color", formatTextDecorationColorValue(value.textDecorationColor));
    pushDeclaration(entries, "text-decoration-thickness", formatLineHeightValue(value.textDecorationThickness));
    pushDeclaration(entries, "text-underline-offset", formatLineHeightValue(value.textDecorationOffset));
    pushDeclaration(entries, "font-feature-settings", formatFontFeatureSettings(value.openTypeFeatures));
    return entries;
  }
  function buildEffectStyleEntries(record, warnings) {
    var value = isPlainObject(record.value) ? record.value : {};
    var effects = Array.isArray(value.effects) ? value.effects : [];
    var boxShadowParts = [];

    for (var index = 0; index < effects.length; index += 1) {
      var effect = effects[index];
      var segment = buildBoxShadowSegment(effect);
      if (segment) {
        boxShadowParts.push(segment);
        continue;
      }
      if (isPlainObject(effect) && effect.visible !== false) {
        warnings.push(
          'Effect style "' + record.pathParts.join("/") + '" skipped unsupported effect type "' +
          String(effect.type || "UNKNOWN") + '" in CSS generation.'
        );
      }
    }

    if (!boxShadowParts.length) {
      return [];
    }

    var boxShadowValue = formatBoxShadowValue(boxShadowParts);
    if (!boxShadowValue) {
      return [];
    }

    return [["box-shadow", boxShadowValue]];
  }
  function buildStyleBlocks(styleWarnings) {
    var textRecords = collectStyleRecords("text");
    var effectRecords = collectStyleRecords("effect");
    var blocks = [];

    for (var textIndex = 0; textIndex < textRecords.length; textIndex += 1) {
      var textRecord = textRecords[textIndex];
      var textSelector = buildTextStyleClassName(textRecord.pathParts);
      var textEntries = buildTextStyleEntries(textRecord);
      if (textSelector && textEntries.length) {
        blocks.push(renderBlock(textSelector, textEntries));
      }
    }

    for (var effectIndex = 0; effectIndex < effectRecords.length; effectIndex += 1) {
      var effectRecord = effectRecords[effectIndex];
      var effectSelector = buildEffectStyleClassName(effectRecord.pathParts);
      var effectEntries = buildEffectStyleEntries(effectRecord, styleWarnings);
      if (effectSelector && effectEntries.length) {
        blocks.push(renderBlock(effectSelector, effectEntries));
      }
    }

    return blocks;
  }
  function shouldSkipRawTokenRecord(record) {
    var pathKey = String(record && record.pathKey ? record.pathKey : "");
    return (
      pathKey.indexOf("font.family.") === 0 ||
      pathKey.indexOf("font.size.") === 0 ||
      pathKey.indexOf("font.weight.") === 0
    );
  }
  var rootEntries = [];
  var lightEntries = [];
  var darkEntries = [];
  for (var recordIndex = 0; recordIndex < tokenRecords.length; recordIndex += 1) {
    var record = tokenRecords[recordIndex];
    if (!shouldSkipRawTokenRecord(record)) {
    var rootValue = resolveSectionValue(record, "root", [], false);
    if (rootValue !== null) {
      rootEntries.push([record.varName, formatValueForVariable(record, rootValue)]);
    }

    var lightValue = resolveSectionValue(record, "light", [], false);
    if (lightValue !== null) {
      lightEntries.push([record.varName, formatValueForVariable(record, lightValue)]);
    }

    var darkValue = resolveSectionValue(record, "dark", [], false);
    if (darkValue !== null) {
      darkEntries.push([record.varName, formatValueForVariable(record, darkValue)]);
    }
  }
  }
  appendFontShorthandEntries(rootEntries, "root");
  var styleWarnings = [];
  var styleBlocks = buildStyleBlocks(styleWarnings);
  if (!tokenRecords.length && !styleBlocks.length) {
    throw new Error('No exportable token records or style classes were found in tokens JSON.');
  }
  var css = [];
  css.push("/* Generated from 101 Design System */");
  css.push("");
  if (styleWarnings.length) {
    css.push("/* CSS generation warnings:");
    for (var warningIndex = 0; warningIndex < styleWarnings.length; warningIndex += 1) {
      css.push(" * " + escapeCommentText(styleWarnings[warningIndex]));
    }
    css.push(" */");
    css.push("");
  }
  if (tokenRecords.length) {
    css.push(renderBlock(":root", dedupeAndSort(rootEntries)));
    css.push("");
    css.push(renderBlock(':root,\n:root[data-theme="light"]', dedupeAndSort(lightEntries)));
    css.push("");
    css.push(renderBlock(':root[data-theme="dark"]', dedupeAndSort(darkEntries)));
    css.push("");
  }
  for (var blockIndex = 0; blockIndex < styleBlocks.length; blockIndex += 1) {
    css.push(styleBlocks[blockIndex]);
    css.push("");
  }
  return css.join("\n");
}

#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const slash = value => value.split(path.sep).join('/');
function filesIn(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)
    .flatMap(entry => entry.isDirectory() ? filesIn(path.join(root, entry.name)) : [path.join(root, entry.name)]);
}
function blank(value) { return value.replace(/[^\n\r]/g, ' '); }
function htmlComments(text) { return text.replace(/<!--[\s\S]*?-->/g, blank); }
function cssComments(text, scss) {
  let result = '', quote, index = 0;
  while (index < text.length) {
    const char = text[index];
    if (quote) {
      result += char;
      if (char === '\\' && index + 1 < text.length) { result += text[++index]; }
      else if (char === quote) quote = undefined;
      index++;
    } else if (char === '"' || char === "'") { quote = char; result += char; index++; }
    else if (text.slice(index, index + 2) === '/*') {
      const end = text.indexOf('*/', index + 2);
      const length = end < 0 ? text.length : end + 2;
      result += blank(text.slice(index, length)); index = length;
    } else if (scss && text.slice(index, index + 2) === '//' && text[index - 1] !== ':') {
      const end = text.indexOf('\n', index + 2);
      const length = end < 0 ? text.length : end;
      result += blank(text.slice(index, length)); index = length;
    } else { result += char; index++; }
  }
  return result;
}
function literalName(node) {
  return node && (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) ? node.text : undefined;
}
function enclosingClass(node) {
  for (let parent = node.parent; parent; parent = parent.parent) if (ts.isClassDeclaration(parent)) return parent;
}
function mapValues(node) {
  if (!node || !ts.isObjectLiteralExpression(node)) return undefined;
  const result = [];
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property) || !ts.isStringLiteral(property.initializer)) return undefined;
    result.push({ key: literalName(property.name), value: property.initializer.text, node: property.initializer });
  }
  return result;
}

function auditAssets({ root = path.resolve(__dirname, '..') } = {}) {
  root = path.resolve(root);
  const src = path.join(root, 'src');
  const aliasFile = path.join(root, 'scripts/ui-asset-aliases.json');
  const aliases = fs.existsSync(aliasFile) ? JSON.parse(fs.readFileSync(aliasFile, 'utf8')).aliases : {};
  for (const [alias, target] of Object.entries(aliases)) {
    if (!/^assets\/[a-z0-9/-]+\.(?:png|webp)$/.test(alias) || !/^assets\/[a-z0-9/-]+\.(?:webp|svg)$/.test(target)) {
      throw new Error(`Unsupported UI asset alias: ${alias}`);
    }
  }
  const inventory = filesIn(path.join(src, 'assets')).filter(file => {
    const name = slash(path.relative(src, file));
    return path.basename(file) !== '.gitkeep' && !name.startsWith('assets/simulator/');
  });
  if (fs.existsSync(path.join(src, 'favicon.ico'))) inventory.push(path.join(src, 'favicon.ico'));
  const assets = new Map(inventory.map(file => [slash(path.relative(src, file)), {
    path: slash(path.relative(src, file)), bytes: fs.statSync(file).size, evidence: []
  }]));
  const missing = new Map(), unresolved = [], parsedAssets = new Set(), queue = [];
  const sourceFiles = filesIn(src).filter(file => {
    const name = slash(path.relative(src, file));
    return !name.startsWith('assets/') && /\.(ts|html|scss|css)$/.test(name)
      && !/(?:^|\/)(?:__tests__|tests?|e2e)(?:\/|\.)/.test(name)
      && !/\.(?:spec|test|d)\.ts$/.test(name) && !/(?:^|\/)test\.ts$/.test(name);
  });
  function evidence(file, text, position, kind, extra = {}) {
    return { file: slash(path.relative(root, file)), line: text.slice(0, position).split('\n').length, kind, ...extra };
  }
  function reference(name, proof) {
    name = name.split(/[?#]/)[0].replace(/^~src\//, '').replace(/^\/+/, '').replace(/^\.\//, '');
    if (name.startsWith('../')) {
      if (!missing.has(name)) missing.set(name, { path: name,
        reason: 'Parent-relative asset URL is unsupported because it escapes the pinned release base', evidence: [] });
      missing.get(name).evidence.push(proof);
      return;
    }
    try { name = decodeURIComponent(name); } catch { /* Missing paths remain visible in the report. */ }
    name = path.posix.normalize(name);
    if (Object.hasOwn(aliases, name)) {
      proof = { ...proof, legacyAlias: name };
      name = aliases[name];
    }
    if (name.startsWith('assets/simulator/')) return;
    if (!name.startsWith('assets/') && name !== 'favicon.ico') return;
    const found = assets.get(name);
    if (found) {
      const key = JSON.stringify(proof);
      if (!found.evidence.some(item => JSON.stringify(item) === key)) found.evidence.push(proof);
      if (!parsedAssets.has(name)) { parsedAssets.add(name); queue.push(name); }
    } else {
      if (!missing.has(name)) missing.set(name, { path: name, evidence: [] });
      missing.get(name).evidence.push(proof);
    }
  }
  function literals(value, proof) {
    const text = htmlComments(value);
    const pattern = /(?:^|[\s="'(,])((?:~src\/|\/|(?:\.\.?\/)*)?assets\/[^\s"'`<>)}]+|favicon\.ico)(?=$|[\s"'`<>)}])/g;
    for (const match of text.matchAll(pattern)) {
      if (/\$\{|#\{/.test(match[1])) continue;
      reference(match[1], proof);
    }
  }
  const environmentFile = path.join(src, 'environments/environment.prod.ts');
  const languages = [];
  if (fs.existsSync(environmentFile)) {
    const text = fs.readFileSync(environmentFile, 'utf8');
    const parsed = ts.createSourceFile(environmentFile, text, ts.ScriptTarget.Latest, true);
    function visit(node) {
      if (ts.isVariableDeclaration(node) && literalName(node.name) === 'environment'
        && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
        const item = node.initializer.properties.find(p => ts.isPropertyAssignment(p) && literalName(p.name) === 'languages');
        if (item && ts.isObjectLiteralExpression(item.initializer)) {
          for (const property of item.initializer.properties) {
            const key = literalName(property.name);
            if (ts.isPropertyAssignment(property) && key && /^[a-z]{2}(?:-[A-Za-z0-9]+)?$/.test(key)) {
              languages.push({ value: key, proof: evidence(environmentFile, text, property.getStart(parsed), 'language-definition') });
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(parsed);
  }
  function typescript(file, text) {
    const parsed = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    const components = new Set(['Component']), namespaces = new Set();
    for (const statement of parsed.statements) {
      if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.text !== '@angular/core') continue;
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const item of bindings.elements) if ((item.propertyName || item.name).text === 'Component') components.add(item.name.text);
      } else if (bindings && ts.isNamespaceImport(bindings)) namespaces.add(bindings.name.text);
    }
    function componentStringKind(node) {
      const value = ts.isArrayLiteralExpression(node.parent) ? node.parent : node;
      const property = value.parent;
      if (!ts.isPropertyAssignment(property) || !['styles', 'template'].includes(literalName(property.name))) return;
      const object = property.parent, call = object.parent;
      if (!ts.isObjectLiteralExpression(object) || !ts.isCallExpression(call) || !call.arguments.includes(object)) return;
      const component = (ts.isIdentifier(call.expression) && components.has(call.expression.text))
        || (ts.isPropertyAccessExpression(call.expression) && call.expression.name.text === 'Component'
          && ts.isIdentifier(call.expression.expression) && namespaces.has(call.expression.expression.text));
      if (component) return literalName(property.name);
    }
    function visit(node) {
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const kind = componentStringKind(node);
        if (kind === 'styles') styles(file, node.text, node.getStart(parsed) + 1, text);
        else if (kind === 'template') html(file, node.text, node.getStart(parsed) + 1, text);
        else literals(node.text, evidence(file, text, node.getStart(parsed), 'literal'));
      } else if (ts.isTemplateExpression(node) && /(?:^|\/)assets\//.test(node.head.text)) {
        const prefix = node.head.text.replace(/^\//, '');
        if (prefix.startsWith('assets/simulator/')) return;
        const only = node.templateSpans.length === 1 && node.templateSpans[0];
        const proof = evidence(file, text, node.getStart(parsed), 'dynamic-template');
        let expanded = false;
        if (prefix === 'assets/energy-icons/' && only && /^(?:\.webp|\.svg)$/.test(only.literal.text)
          && ts.isElementAccessExpression(only.expression)
          && ts.isPropertyAccessExpression(only.expression.expression)
          && only.expression.expression.expression.kind === ts.SyntaxKind.ThisKeyword
          && only.expression.expression.name.text === 'energyImageMap') {
          const owner = enclosingClass(node);
          const property = owner?.members.find(item => ts.isPropertyDeclaration(item) && literalName(item.name) === 'energyImageMap');
          const values = mapValues(property?.initializer);
          if (values?.length && values.every(item => /^[a-z-]+$/.test(item.value))) {
            for (const item of values) reference(`${prefix}${item.value}${only.literal.text}`, { ...proof, kind: 'dynamic-energy-map',
              definition: evidence(file, text, item.node.getStart(parsed), 'map-value', { map: 'energyImageMap', key: item.key, value: item.value }) });
            expanded = true;
          }
        } else if (prefix === 'assets/i18n/' && only && only.literal.text === '.json'
          && ts.isIdentifier(only.expression) && only.expression.text === 'language' && languages.length) {
          for (const item of languages) reference(`${prefix}${item.value}.json`, { ...proof, kind: 'dynamic-language-map', definition: item.proof });
          expanded = true;
        }
        if (!expanded) unresolved.push({ ...proof, expression: node.getText(parsed), reason: 'Asset template has no finite, supported source definition' });
      }
      ts.forEachChild(node, visit);
    }
    visit(parsed);
  }
  function sassValues(text, variable, at) {
    // Deliberately support literal Sass maps, rather than evaluating Sass or
    // treating every file in a dynamic directory as used.
    const loops = /@each\s+\$([\w-]+)\s*,\s*\$([\w-]+)\s+in\s+\$([\w-]+)\s*\{/g;
    let selected;
    for (const match of text.matchAll(loops)) {
      let depth = 1, quote, end = match.index + match[0].length;
      for (; end < text.length && depth; end++) {
        const char = text[end];
        if (quote) { if (char === '\\') end++; else if (char === quote) quote = undefined; }
        else if (char === '"' || char === "'") quote = char;
        else if (char === '{') depth++;
        else if (char === '}') depth--;
      }
      if (match.index < at && at < end && match[2] === variable) selected = match[3];
    }
    if (!selected) return undefined;
    const declaration = new RegExp('\\$' + selected + '\\s*:\\s*\\(([^;]*?)\\)\\s*;', 'g');
    const map = [...text.matchAll(declaration)].filter(item => item.index < at).pop();
    if (!map) return undefined;
    const pair = /(?:'([^']+)'|"([^"]+)"|([\w-]+))\s*:\s*(?:'([^']+)'|"([^"]+)"|([\w-]+))\s*(?:,|$)/g;
    const entries = [...map[1].matchAll(pair)];
    if (!entries.length || map[1].replace(pair, '').trim()) return undefined;
    return entries.map(item => ({ value: item[4] || item[5] || item[6], position: map.index + map[0].indexOf(map[1]) + item.index }));
  }
  function styles(file, original, basePosition = 0, wholeText = original) {
    const text = cssComments(original, file.endsWith('.scss'));
    for (const match of text.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g)) {
      const value = (match[1] || match[2] || match[3] || '').trim();
      if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)) continue;
      const proof = evidence(file, wholeText, basePosition + match.index, 'css-url');
      const dynamic = /#\{\$([\w-]+)\}/.exec(value);
      if (dynamic) {
        const values = sassValues(text, dynamic[1], match.index);
        if (!values) unresolved.push({ ...proof, expression: value, reason: 'Sass asset interpolation has no supported literal map' });
        else for (const item of values) reference(value.replace(dynamic[0], item.value), { ...proof, kind: 'dynamic-sass-map',
          definition: evidence(file, wholeText, basePosition + item.position, 'sass-map-value', { value: item.value }) });
      } else if (/^(?:~src\/|\/?assets\/)/.test(value)) reference(value, proof);
      else {
        const absolute = path.resolve(path.dirname(file), value.split(/[?#]/)[0]);
        reference(slash(path.relative(src, absolute)), proof);
      }
    }
  }
  function srcsetUrls(value) {
    // Follow the srcset URL-token boundary: commas inside a URL (notably a
    // data URL) are legal; trailing commas separate URL-only candidates.
    const urls = [];
    let index = 0;
    while (index < value.length) {
      while (/[\s,]/.test(value[index] || '') && index < value.length) index++;
      const start = index;
      while (index < value.length && !/\s/.test(value[index])) index++;
      let url = value.slice(start, index);
      if (!url) break;
      const trailingComma = /,$/.test(url);
      url = url.replace(/,+$/, '');
      if (url) urls.push(url);
      if (!trailingComma) {
        let parentheses = 0;
        while (index < value.length) {
          const char = value[index++];
          if (char === '(') parentheses++;
          else if (char === ')') parentheses--;
          else if (char === ',' && !parentheses) break;
        }
      }
    }
    return urls;
  }
  function html(file, original, basePosition = 0, wholeText = original) {
    const text = htmlComments(original);
    for (const match of text.matchAll(/(?:^|[\s<])(\[?(?:src|href|poster|srcset|style)\]?)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      const value = match[2] || match[3] || '';
      const attribute = match[1].replace(/[\[\]]/g, '');
      const proof = evidence(file, wholeText, basePosition + match.index, 'html-attribute');
      if (attribute === 'style') styles(file, value, basePosition + match.index, wholeText);
      else if (attribute === 'srcset') for (const url of srcsetUrls(value)) literals(url, { ...proof, kind: 'html-srcset' });
      else literals(value, proof);
    }
  }
  function scan(file) {
    const text = fs.readFileSync(file, 'utf8');
    if (file.endsWith('.ts')) typescript(file, text);
    else if (file.endsWith('.html')) html(file, text);
    else styles(file, text);
  }
  for (const file of sourceFiles) scan(file);
  while (queue.length) {
    const name = queue.shift();
    if (/\.(?:css|scss|html)$/.test(name)) scan(path.join(src, name));
  }
  const all = [...assets.values()].sort((a, b) => a.path < b.path ? -1 : 1);
  const unused = all.filter(item => !item.evidence.length).map(({ path, bytes }) => ({ path, bytes }));
  return { schemaVersion: 1, passed: !unused.length && !missing.size && !unresolved.length,
    method: { scope: 'Source asset closure from production TS/HTML/SCSS/CSS and index; referenced asset CSS is traversed',
      exclusions: 'Specs, tests, declarations, compiled JavaScript, comments, .gitkeep, and generated assets/simulator',
      dynamicReferences: 'Finite source energyImageMap values, production environment language keys, and literal Sass @each maps; no source evaluation or directory wildcards' },
    summary: { sourceFiles: sourceFiles.length, assets: all.length, bytes: all.reduce((sum, item) => sum + item.bytes, 0),
      referenced: all.length - unused.length, unused: unused.length, missing: missing.size, unresolvedDynamic: unresolved.length },
    assets: all, unused, missing: [...missing.values()], unresolvedDynamic: unresolved };
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2), options = {};
    for (let i = 0; i < args.length; i += 2) {
      if (!['--root', '--report'].includes(args[i]) || !args[i + 1]) throw new Error(`Unknown or incomplete option: ${args[i]}`);
      options[args[i].slice(2)] = args[i + 1];
    }
    const report = auditAssets(options);
    if (options.report) fs.writeFileSync(options.report, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ passed: report.passed, ...report.summary,
      ...(report.passed ? {} : { unused: report.unused, missing: report.missing, unresolvedDynamic: report.unresolvedDynamic }) }, null, 2));
    if (!report.passed) process.exitCode = 1;
  } catch (failure) { console.error(failure.message); process.exitCode = 1; }
}

module.exports = { auditAssets };

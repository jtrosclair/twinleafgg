const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Script } = require('vm');
const ts = require('typescript');
const { filesIn, collectResources, presentationResources, bootstrap } = require('./static-resources.cjs');
const { SNAPSHOT_FORMATS_META } = require('./package-client-build.cjs');

function prepareImageValues(source, resources, identifiers) {
  // Resource names also occur as dictionary/property keys. Only expression
  // values may become URLs; changing a key makes a second, invalid URL lookup.
  const parsed = ts.createSourceFile('bundle.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const edits = [];
  const keyMethods = new Set(['get', 'has', 'set', 'delete', 'hasOwnProperty']);
  function isKey(node) {
    const parent = node.parent;
    if (ts.isElementAccessExpression(parent) && parent.argumentExpression === node) { return true; }
    if (ts.isPropertyAssignment(parent) && parent.name === node) { return true; }
    if (ts.isCallExpression(parent)) {
      const callee = parent.expression;
      if (ts.isPropertyAccessExpression(callee)) {
        if (keyMethods.has(callee.name.text) && parent.arguments[0] === node) { return true; }
        if (callee.name.text === 'call' && ts.isPropertyAccessExpression(callee.expression)
          && callee.expression.name.text === 'hasOwnProperty' && parent.arguments[1] === node) { return true; }
      }
    }
    if (ts.isArrayLiteralExpression(parent)) {
      const collection = parent.parent;
      if (ts.isNewExpression(collection) && ts.isIdentifier(collection.expression)
        && collection.expression.text === 'Set') { return true; }
      if (parent.elements[0] === node && ts.isArrayLiteralExpression(collection)) {
        const initializer = collection.parent;
        if (ts.isNewExpression(initializer) && ts.isIdentifier(initializer.expression)
          && initializer.expression.text === 'Map') { return true; }
      }
    }
    return false;
  }
  function visit(node) {
    if (ts.isIdentifier(node)) { identifiers.add(node.text); }
    if (ts.isStringLiteral(node) && /^\/?assets\/.+\.(png|jpe?g|webp|gif|svg|ico)$/.test(node.text)
      && !isKey(node)) {
      const name = node.text.replace(/^\//, '');
      if (Object.prototype.hasOwnProperty.call(resources.urls, name)) {
        edits.push({ start: node.getStart(parsed), end: node.end, name });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(parsed);
  let prologueEnd = 0;
  for (const statement of parsed.statements) {
    if (!ts.isExpressionStatement(statement) || !ts.isStringLiteral(statement.expression)) { break; }
    prologueEnd = statement.end;
  }
  // Prepare every script before assigning names, including scripts without
  // image literals. Aliases cannot shadow any binding in this release, and
  // separate scripts cannot accidentally reuse one another's global aliases.
  return function renderImageValues() {
    const expression = name => `globalThis.__SIMULATOR_STATIC__.urls[${JSON.stringify(name)}]`;
    const counts = new Map(), aliases = new Map();
    for (const { name } of edits) { counts.set(name, (counts.get(name) || 0) + 1); }
    let serial = 0;
    for (const [name, count] of counts) {
      let alias;
      do { alias = `__simImage${serial++}`; } while (identifiers.has(alias));
      if (count * (expression(name).length - alias.length) <= alias.length + expression(name).length + 8) { continue; }
      identifiers.add(alias);
      aliases.set(name, alias);
    }
    const replacements = edits.map(edit => ({ ...edit, text: aliases.get(edit.name) || expression(edit.name) }));
    if (aliases.size) {
      // The static bootstrap is loaded first and immutable for this release.
      // Reuse its URL strings instead of emitting thousands of full lookups.
      const declarations = [...aliases].map(([name, alias]) => `${alias}=${expression(name)}`).join(',');
      replacements.push({ start: prologueEnd, end: prologueEnd, text: `\nvar ${declarations};\n` });
    }
    const chunks = [];
    let offset = 0;
    for (const edit of replacements.sort((a, b) => a.start - b.start || a.end - b.end)) {
      chunks.push(source.slice(offset, edit.start), edit.text);
      offset = edit.end;
    }
    chunks.push(source.slice(offset));
    return chunks.join('');
  };
}

function finalizeClientBuild(root = path.resolve(__dirname, '../dist/ptcg-play')) {
  const resources = collectResources(root);
  const payload = bootstrap(resources);
  const hash = crypto.createHash('sha256').update(payload).digest('hex').slice(0, 20);
  const filename = `simulator-static.${hash}.js`;
  fs.writeFileSync(path.join(root, filename), payload);

  function localResource(url, fromFile) {
    const cleaned = url.replace(/[\\"']/g, '').replace(/^\//, '');
    if (Object.prototype.hasOwnProperty.call(resources.urls, cleaned)) { return cleaned; }
    if (fromFile) {
      const relative = path.relative(root, path.dirname(fromFile)).split(path.sep).join('/');
      const resolved = path.posix.normalize(path.posix.join(relative, cleaned));
      if (Object.prototype.hasOwnProperty.call(resources.urls, resolved)) { return resolved; }
    }
    return undefined;
  }
  // Prompts load some component styles only when shown. Bind their images to
  // the initial payload, including CSS embedded in compiled Angular components.
  const identifiers = new Set(), prepared = [];
  for (const file of filesIn(root).filter(file => /\.(js|css)$/.test(file) && !path.basename(file).startsWith('simulator-'))) {
    const isCss = file.endsWith('.css');
    let source = fs.readFileSync(file, 'utf8');
    source = source.replace(/url\(([^)]+)\)/g, (match, url) => {
      const name = localResource(url, file);
      if (!name) { return match; }
      if (/\.(woff2?|ttf|otf|eot)$/.test(name)) {
        // Custom properties are unavailable inside @font-face descriptors.
        return `url(${resources.urls[name]})`;
      }
      return `var(${resources.css[name]})`;
    });
    prepared.push({ file, render: isCss ? () => source : prepareImageValues(source, resources, identifiers), isCss });
  }
  for (const { file, render, isCss } of prepared) {
    const source = render();
    if (!isCss) {
      new Script(source, { filename: file });
    }
    fs.writeFileSync(file, source);
  }
  const indexFile = path.join(root, 'index.html');
  let index = fs.readFileSync(indexFile, 'utf8').replace('src="simulator-static.js"', `src="${filename}"`);
  const capabilityTag = /<meta\b[^>]*\bname=["']prizemap-supported-snapshot-formats["'][^>]*>/gi;
  if (capabilityTag.test(index)) {
    index = index.replace(capabilityTag, SNAPSHOT_FORMATS_META);
  } else if (/<\/head\s*>/i.test(index)) {
    index = index.replace(/<\/head\s*>/i, `${SNAPSHOT_FORMATS_META}</head>`);
  } else { index = SNAPSHOT_FORMATS_META + index; }
  fs.writeFileSync(indexFile, index);
  fs.rmSync(path.join(root, 'simulator-static.js'), { force: true });
  console.log(`Offline simulator UI: ${Object.keys(presentationResources(resources).urls).length} embedded images (${(Buffer.byteLength(payload) / 1048576).toFixed(1)} MB)`);
  return filename;
}

if (require.main === module) {
  finalizeClientBuild();
  const manifest = require('./package-client-build.cjs').packageClientBuild();
  const { createReport } = require('./report-client-bundle.cjs');
  const report = createReport();
  for (const check of report.budgets) {
    if (!check.passed) { throw new Error(`${check.name} exceeds the mobile package budget (${check.actual} > ${check.maximum}).`); }
  }
  console.log(`Mobile package budget passed: ${(report.runtime.gzipBytes / 1048576).toFixed(2)} MiB gzip runtime.`);
  require('./build-attestation.cjs').recordVerifiedPackage(manifest.packageHash);
}
module.exports = { finalizeClientBuild };

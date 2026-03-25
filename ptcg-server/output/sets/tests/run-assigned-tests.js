"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const test_catalog_1 = require("./test-catalog");
function parseArgs(argv) {
    const parsed = { listCards: false, dryRun: false };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--card') {
            parsed.card = argv[i + 1];
            i++;
        }
        else if (arg === '--search') {
            parsed.search = argv[i + 1];
            i++;
        }
        else if (arg === '--tag') {
            parsed.tag = argv[i + 1];
            i++;
        }
        else if (arg === '--list-cards') {
            parsed.listCards = true;
        }
        else if (arg === '--dry-run') {
            parsed.dryRun = true;
        }
    }
    return parsed;
}
function printUsage() {
    console.log('Usage: ts-node src/sets/tests/run-assigned-tests.ts [--card "Card FullName"] [--search "text"] [--tag "tag"] [--list-cards] [--dry-run]');
}
function main() {
    var _a;
    const args = parseArgs(process.argv.slice(2));
    const validation = (0, test_catalog_1.validateTestCatalog)();
    if (validation.missingTestIds.length > 0) {
        throw new Error(`[test-catalog] Invalid catalog. Missing test IDs: ${validation.missingTestIds.join(', ')}`);
    }
    if (args.listCards) {
        console.log((0, test_catalog_1.getAssignableCards)().join('\n'));
        return;
    }
    if (args.search || args.tag) {
        const tags = args.tag ? [args.tag] : [];
        const matches = (0, test_catalog_1.searchReusableCardTests)({
            text: args.search,
            tags
        });
        console.log(JSON.stringify(matches, null, 2));
        return;
    }
    if (!args.card) {
        printUsage();
        return;
    }
    const assignedTests = (0, test_catalog_1.getAssignedTests)(args.card);
    if (assignedTests.length === 0) {
        throw new Error(`[test-catalog] No tests assigned to card "${args.card}"`);
    }
    const specPaths = (0, test_catalog_1.getAssignedSpecPaths)(args.card);
    console.log(`[test-catalog] ${args.card}: ${assignedTests.length} tests across ${specPaths.length} spec files.`);
    specPaths.forEach(path => console.log(` - ${path}`));
    if (args.dryRun) {
        return;
    }
    const result = (0, child_process_1.spawnSync)('npx', ['jasmine-ts', ...specPaths], {
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: false
    });
    if (result.error) {
        throw result.error;
    }
    process.exit((_a = result.status) !== null && _a !== void 0 ? _a : 1);
}
main();

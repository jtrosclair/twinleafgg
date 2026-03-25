"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTestCatalog = exports.getAssignableCards = exports.getAssignedSpecPaths = exports.getAssignedTests = exports.getAssignedTestIds = exports.searchReusableCardTests = exports.CARD_TEST_ASSIGNMENTS = exports.REUSABLE_CARD_TESTS = void 0;
exports.REUSABLE_CARD_TESTS = [
    {
        id: 'manaphy.wave-veil.prevent-bench-damage',
        title: 'Wave Veil prevents bench damage',
        description: 'Bench-targeted damage is blocked while Manaphy is in play.',
        specPath: 'src/sets/tests/manaphy.spec.ts',
        tags: ['ability', 'bench-protection', 'damage-prevention', 'passive'],
        promptTypes: []
    },
    {
        id: 'manaphy.wave-veil.does-not-protect-active',
        title: 'Wave Veil does not prevent active damage',
        description: 'Damage to the active Pokemon is not blocked by Wave Veil.',
        specPath: 'src/sets/tests/manaphy.spec.ts',
        tags: ['ability', 'bench-protection', 'active-damage-control', 'passive'],
        promptTypes: []
    },
    {
        id: 'manaphy.wave-veil.control-no-manaphy',
        title: 'Bench damage without Manaphy is not blocked',
        description: 'Control scenario for bench damage behavior when source ability is absent.',
        specPath: 'src/sets/tests/manaphy.spec.ts',
        tags: ['ability', 'bench-protection', 'control'],
        promptTypes: []
    },
    {
        id: 'eelektrik.dynamotor.attach-from-discard',
        title: 'Dynamotor attaches Lightning energy from discard',
        description: 'Activated ability attaches one Lightning energy from discard to benched Pokemon.',
        specPath: 'src/sets/tests/eelektrik.spec.ts',
        tags: ['ability', 'activated-ability', 'energy-attachment', 'discard'],
        promptTypes: ['Attach energy']
    },
    {
        id: 'eelektrik.dynamotor.once-per-turn',
        title: 'Dynamotor once-per-turn lock',
        description: 'Second use in the same turn throws and is rejected.',
        specPath: 'src/sets/tests/eelektrik.spec.ts',
        tags: ['ability', 'activated-ability', 'once-per-turn', 'restriction'],
        promptTypes: ['Attach energy']
    },
    {
        id: 'electric-generator.attach-lightning-from-top-five',
        title: 'Electric Generator attaches from top deck cards',
        description: 'Trainer attaches Lightning energy from top deck cards to benched Lightning Pokemon.',
        specPath: 'src/sets/tests/electric-generator.spec.ts',
        tags: ['trainer', 'item', 'energy-attachment', 'deck-top'],
        promptTypes: ['Attach energy']
    },
    {
        id: 'electric-generator.requires-lightning-bench-target',
        title: 'Electric Generator requires Lightning bench target',
        description: 'Trainer play is rejected if no legal Lightning bench target exists.',
        specPath: 'src/sets/tests/electric-generator.spec.ts',
        tags: ['trainer', 'item', 'target-validation', 'restriction'],
        promptTypes: ['Attach energy']
    },
    {
        id: 'raichu.ambushing-spark.base-damage',
        title: 'Ambushing Spark base damage',
        description: 'Attack deals base 40 damage if opponent has not used VSTAR power.',
        specPath: 'src/sets/tests/raichu.spec.ts',
        tags: ['attack', 'damage', 'conditional-damage'],
        promptTypes: []
    },
    {
        id: 'raichu.ambushing-spark.vstar-bonus',
        title: 'Ambushing Spark VSTAR bonus damage',
        description: 'Attack gains +100 damage after opponent uses VSTAR power.',
        specPath: 'src/sets/tests/raichu.spec.ts',
        tags: ['attack', 'damage', 'conditional-damage', 'vstar'],
        promptTypes: []
    }
];
exports.CARD_TEST_ASSIGNMENTS = {
    'Manaphy BRS': {
        tests: [
            'manaphy.wave-veil.prevent-bench-damage',
            'manaphy.wave-veil.does-not-protect-active',
            'manaphy.wave-veil.control-no-manaphy'
        ],
        notes: 'Bench damage prevention baseline suite.'
    },
    'Eelektrik NVI': {
        tests: [
            'eelektrik.dynamotor.attach-from-discard',
            'eelektrik.dynamotor.once-per-turn'
        ],
        notes: 'Activated discard-to-bench energy acceleration and once-per-turn lock.'
    },
    'Electric Generator PAF': {
        tests: [
            'electric-generator.attach-lightning-from-top-five',
            'electric-generator.requires-lightning-bench-target'
        ],
        notes: 'Top-deck attachment and legal-target gating.'
    },
    'Raichu SIT': {
        tests: [
            'raichu.ambushing-spark.base-damage',
            'raichu.ambushing-spark.vstar-bonus'
        ],
        notes: 'Conditional damage baseline for VSTAR-state interactions.'
    }
};
function normalize(text) {
    return text.toLowerCase().trim();
}
function searchReusableCardTests(options = {}) {
    var _a;
    const queryText = options.text ? normalize(options.text) : '';
    const queryTags = ((_a = options.tags) !== null && _a !== void 0 ? _a : []).map(normalize);
    return exports.REUSABLE_CARD_TESTS.filter(test => {
        if (queryText) {
            const haystack = `${test.id} ${test.title} ${test.description} ${test.tags.join(' ')}`.toLowerCase();
            if (!haystack.includes(queryText)) {
                return false;
            }
        }
        if (queryTags.length > 0) {
            const testTags = test.tags.map(normalize);
            if (!queryTags.every(tag => testTags.includes(tag))) {
                return false;
            }
        }
        return true;
    });
}
exports.searchReusableCardTests = searchReusableCardTests;
function getAssignedTestIds(cardFullName) {
    var _a, _b;
    return (_b = (_a = exports.CARD_TEST_ASSIGNMENTS[cardFullName]) === null || _a === void 0 ? void 0 : _a.tests) !== null && _b !== void 0 ? _b : [];
}
exports.getAssignedTestIds = getAssignedTestIds;
function getAssignedTests(cardFullName) {
    const assignedIds = new Set(getAssignedTestIds(cardFullName));
    return exports.REUSABLE_CARD_TESTS.filter(test => assignedIds.has(test.id));
}
exports.getAssignedTests = getAssignedTests;
function getAssignedSpecPaths(cardFullName) {
    const paths = getAssignedTests(cardFullName).map(test => test.specPath);
    return Array.from(new Set(paths));
}
exports.getAssignedSpecPaths = getAssignedSpecPaths;
function getAssignableCards() {
    return Object.keys(exports.CARD_TEST_ASSIGNMENTS).sort();
}
exports.getAssignableCards = getAssignableCards;
function validateTestCatalog() {
    const testIds = new Set(exports.REUSABLE_CARD_TESTS.map(test => test.id));
    const missing = new Set();
    for (const assignment of Object.values(exports.CARD_TEST_ASSIGNMENTS)) {
        for (const testId of assignment.tests) {
            if (!testIds.has(testId)) {
                missing.add(testId);
            }
        }
    }
    return {
        missingTestIds: Array.from(missing).sort()
    };
}
exports.validateTestCatalog = validateTestCatalog;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_catalog_1 = require("./test-catalog");
describe('Card Test Catalog', () => {
    it('should not contain missing test IDs in assignments', () => {
        const validation = (0, test_catalog_1.validateTestCatalog)();
        expect(validation.missingTestIds).toEqual([]);
    });
    it('should return assigned tests for known cards', () => {
        const assigned = (0, test_catalog_1.getAssignedTests)('Manaphy BRS');
        expect(assigned.length).toBeGreaterThan(0);
    });
});

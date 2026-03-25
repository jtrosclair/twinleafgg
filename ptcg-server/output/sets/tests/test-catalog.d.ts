export interface ReusableCardTestDefinition {
    id: string;
    title: string;
    description: string;
    specPath: string;
    tags: string[];
    promptTypes: string[];
}
export interface CardTestAssignmentRecord {
    tests: string[];
    notes?: string;
}
export interface SearchCardTestsOptions {
    text?: string;
    tags?: string[];
}
export declare const REUSABLE_CARD_TESTS: ReusableCardTestDefinition[];
export declare const CARD_TEST_ASSIGNMENTS: Record<string, CardTestAssignmentRecord>;
export declare function searchReusableCardTests(options?: SearchCardTestsOptions): ReusableCardTestDefinition[];
export declare function getAssignedTestIds(cardFullName: string): string[];
export declare function getAssignedTests(cardFullName: string): ReusableCardTestDefinition[];
export declare function getAssignedSpecPaths(cardFullName: string): string[];
export declare function getAssignableCards(): string[];
export declare function validateTestCatalog(): {
    missingTestIds: string[];
};

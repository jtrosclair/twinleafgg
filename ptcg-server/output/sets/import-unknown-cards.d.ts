/**
 * Script to fetch and generate card definitions for unknown cards from TCGdex API.
 *
 * Usage:
 *   npx ts-node ptcg-server/src/sets/import-unknown-cards.ts [--fetch-only] [--generate-only]
 *
 * This script:
 * 1. Reads the unknown-cards.json file
 * 2. Fetches card data from TCGdex API for each unknown card
 * 3. Generates TypeScript card class definitions
 * 4. Outputs a summary of what was generated and what failed
 *
 * Options:
 *   --fetch-only     Only fetch and display card data, don't generate files
 *   --generate-only  Only generate files for cards already fetched (uses cache)
 */
declare const writeFileSync: any, readFileSync: any, existsSync: any, mkdirSync: any;
declare const join: any, resolve: any;
declare const setCodeToTcgDexId: {
    [key: string]: string;
};
declare const tcgDexIdToSetCode: {
    [key: string]: string;
};
interface UnknownCard {
    name: string;
    setCode: string;
    setNumber: string;
    fullName: string;
    importLine: string;
    addedAt: string;
}
interface UnknownCardsFile {
    lastUpdated: string;
    cards: UnknownCard[];
}
interface FetchResult {
    card: UnknownCard;
    tcgdexData: any | null;
    error: string | null;
}
interface GenerationResult {
    card: UnknownCard;
    success: boolean;
    filePath: string | null;
    error: string | null;
}
declare const UNKNOWN_CARDS_FILE: any;
declare const FETCH_CACHE_FILE: any;
declare function sanitizeForCache(obj: any): any;
declare function stripSdkMetadata(data: any): any;
declare function fetchCardFromTcgDex(card: UnknownCard): Promise<FetchResult>;
declare function generateCardClass(card: UnknownCard, tcgdexData: any): {
    content: string;
    fileName: string;
    folder: string;
};

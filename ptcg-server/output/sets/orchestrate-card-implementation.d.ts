/**
 * Orchestration script for generating Claude Code agent prompts to implement card effects.
 *
 * Usage:
 *   npx ts-node ptcg-server/src/sets/orchestrate-card-implementation.ts [options]
 *
 * Options:
 *   --output <file>    Output file for prompts (default: card-implementation-prompts.md)
 *   --limit <n>        Limit number of cards to process
 *   --set <code>       Only process cards from a specific set
 *
 * This script:
 * 1. Reads the unknown-cards.json file and tcgdex-cache.json
 * 2. Generates detailed prompts for Claude Code agents to implement each card
 * 3. Outputs a markdown file with all prompts that can be fed to agents
 */
declare const readFileSync: any, writeFileSync: any, existsSync: any, readdirSync: any;
declare const join: any;
declare const UNKNOWN_CARDS_FILE: any;
declare const FETCH_CACHE_FILE: any;
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
declare function getExistingCardExamples(setCode: string, category: string): string[];
declare function generatePromptForCard(card: UnknownCard, tcgdexData: any): string;

// @ts-nocheck
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

const { readFileSync, writeFileSync, existsSync, readdirSync } = require('fs');
const { join } = require('path');

const UNKNOWN_CARDS_FILE = join(__dirname, '../../data/unknown-cards.json');
const FETCH_CACHE_FILE = join(__dirname, '../../data/tcgdex-cache.json');

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

function getExistingCardExamples(setCode: string, category: string): string[] {
  // Find similar cards in the codebase to use as examples
  const setFolderMap: { [key: string]: string } = {
    CES: 'set-celestial-storm',
    UPR: 'set-ultra-prism',
    GRI: 'set-guardians-rising',
    BUS: 'set-burning-shadows',
    SLG: 'set-shining-legends',
    CIN: 'set-crimson-invasion',
    SUM: 'set-sun-and-moon',
    SSH: 'set-sword-and-shield',
    BRS: 'set-brilliant-stars',
    SVI: 'set-scarlet-and-violet',
  };

  const folder = setFolderMap[setCode] || `set-${setCode.toLowerCase()}`;
  const folderPath = join(__dirname, folder);

  if (!existsSync(folderPath)) {
    return [];
  }

  const files = readdirSync(folderPath).filter((f: string) =>
    f.endsWith('.ts') && f !== 'index.ts' && f !== 'other-prints.ts'
  );

  return files.slice(0, 3).map((f: string) => join(folder, f));
}

function generatePromptForCard(card: UnknownCard, tcgdexData: any): string {
  const category = tcgdexData?.category || 'Pokemon';
  const isPokemon = category === 'Pokemon' || category === 'Pokémon';
  const isTrainer = category === 'Trainer';
  const isEnergy = category === 'Energy';

  const examples = getExistingCardExamples(card.setCode, category);

  let prompt = `## ${card.name} (${card.setCode} ${card.setNumber})\n\n`;

  prompt += `### Card Information\n`;
  prompt += `- **Name:** ${tcgdexData?.name || card.name}\n`;
  prompt += `- **Set:** ${card.setCode}\n`;
  prompt += `- **Number:** ${card.setNumber}\n`;
  prompt += `- **Category:** ${category}\n`;

  if (isPokemon) {
    prompt += `- **HP:** ${tcgdexData?.hp || 'Unknown'}\n`;
    prompt += `- **Type:** ${tcgdexData?.types?.join(', ') || 'Unknown'}\n`;
    prompt += `- **Stage:** ${tcgdexData?.stage || 'Basic'}\n`;

    if (tcgdexData?.evolveFrom) {
      prompt += `- **Evolves From:** ${tcgdexData.evolveFrom}\n`;
    }

    if (tcgdexData?.abilities?.length) {
      prompt += `\n### Abilities\n`;
      for (const ability of tcgdexData.abilities) {
        prompt += `- **${ability.name}** (${ability.type || 'Ability'}): ${ability.effect || 'No effect text'}\n`;
      }
    }

    if (tcgdexData?.attacks?.length) {
      prompt += `\n### Attacks\n`;
      for (const attack of tcgdexData.attacks) {
        const cost = attack.cost?.join('') || 'Free';
        const damage = attack.damage || '0';
        prompt += `- **${attack.name}** [${cost}] - ${damage} damage\n`;
        if (attack.effect) {
          prompt += `  - Effect: ${attack.effect}\n`;
        }
      }
    }
  } else if (isTrainer) {
    prompt += `- **Trainer Type:** ${tcgdexData?.trainerType || 'Item'}\n`;
    if (tcgdexData?.effect) {
      prompt += `\n### Effect\n${tcgdexData.effect}\n`;
    }
  } else if (isEnergy) {
    prompt += `- **Energy Type:** ${tcgdexData?.energyType || 'Special'}\n`;
    if (tcgdexData?.effect) {
      prompt += `\n### Effect\n${tcgdexData.effect}\n`;
    }
  }

  prompt += `\n### Implementation Task\n`;
  prompt += `Implement the card "${card.name}" for the Pokémon TCG simulator.\n\n`;

  prompt += `**Steps:**\n`;
  prompt += `1. Check if a file already exists for this card in \`ptcg-server/src/sets/\`\n`;
  prompt += `2. If it exists, review and update the implementation\n`;
  prompt += `3. If not, create a new card file based on the TCGdex data\n`;
  prompt += `4. Implement all attacks and abilities with proper game logic\n`;
  prompt += `5. Add the card export to the set's index.ts file\n`;

  if (examples.length > 0) {
    prompt += `**Reference Examples:**\n`;
    for (const example of examples) {
      prompt += `- \`ptcg-server/src/sets/${example}\`\n`;
    }
    prompt += `\n`;
  }

  prompt += `**Important Notes:**\n`;
  prompt += `- Follow existing code patterns in the codebase\n`;
  prompt += `- Use the appropriate state reducers for effects\n`;
  prompt += `- Handle edge cases (e.g., empty bench, no energy attached)\n`;
  prompt += `- Add proper card tags if applicable (EX, GX, V, VMAX, etc.)\n`;

  return prompt;
}

async function main() {
  const args = process.argv.slice(2);
  let outputFile = 'card-implementation-prompts.md';
  let limit: number | undefined;
  let filterSet: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) {
      outputFile = args[++i];
    } else if (args[i] === '--limit' && args[i + 1]) {
      limit = parseInt(args[++i], 10);
    } else if (args[i] === '--set' && args[i + 1]) {
      filterSet = args[++i].toUpperCase();
    }
  }

  // Read files
  if (!existsSync(UNKNOWN_CARDS_FILE)) {
    console.error('Unknown cards file not found:', UNKNOWN_CARDS_FILE);
    console.error('Run the deck-import API endpoint first.');
    process.exit(1);
  }

  const unknownCardsData: UnknownCardsFile = JSON.parse(readFileSync(UNKNOWN_CARDS_FILE, 'utf-8'));
  let cache: { [key: string]: any } = {};

  if (existsSync(FETCH_CACHE_FILE)) {
    cache = JSON.parse(readFileSync(FETCH_CACHE_FILE, 'utf-8'));
  }

  let cards = unknownCardsData.cards;

  if (filterSet) {
    cards = cards.filter(c => c.setCode.toUpperCase() === filterSet);
  }

  if (limit) {
    cards = cards.slice(0, limit);
  }

  console.log(`Processing ${cards.length} cards...\n`);

  let output = `# Card Implementation Prompts\n\n`;
  output += `Generated: ${new Date().toISOString()}\n\n`;
  output += `Total cards: ${cards.length}\n\n`;
  output += `---\n\n`;

  for (const card of cards) {
    const cacheKey = `${card.setCode}-${card.setNumber}`;
    const tcgdexData = cache[cacheKey];

    const prompt = generatePromptForCard(card, tcgdexData);
    output += prompt + '\n---\n\n';
  }

  // Write output file
  const outputPath = join(process.cwd(), outputFile);
  writeFileSync(outputPath, output, 'utf-8');

  console.log(`Prompts written to: ${outputPath}`);
  console.log(`\nTo use with Claude Code agents:`);
  console.log(`1. Open the prompts file`);
  console.log(`2. Copy each card section to a Claude Code agent`);
  console.log(`3. Let the agent implement the card`);
  console.log(`4. Review and test the implementation`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

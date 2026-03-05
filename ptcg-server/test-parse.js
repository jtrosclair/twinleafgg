/**
 * Test deck import parsing with the real card database.
 * Run from ptcg-server/: node test-parse.js
 */
require('./config');

const { CardManager } = require('./output/game/cards/card-manager');
const sets = require('./output/sets');
const { DeckImport } = require('./output/backend/controllers/deck-import');

// Load all cards (same as start.js)
const cardManager = CardManager.getInstance();
for (const key of Object.keys(sets)) {
  try {
    cardManager.defineSet(sets[key]);
  } catch (e) {
    // skip duplicate set errors
  }
}

console.log('Loaded', cardManager.getAllCards().length, 'cards\n');

// The exact JSON from the user
const deckList = "Pok\u00e9mon: 13\n3 N\u2019s Darumaka ASC 32\n2 N\u2019s Darmanitan ASC 33\n4 N\u2019s Zorua ASC 136\n4 N\u2019s Zoroark ex JTG 98\n2 N\u2019s Vanilluxe ASC 51\n2 N\u2019s Vanillish ASC 50\n2 N\u2019s Vanillite ASC 49\n2 N\u2019s Zekrom ASC 155\n2 N\u2019s Klink JTG 103\n1 N\u2019s Klang JTG 104\n2 N\u2019s Klinklang JTG 105\n2 N\u2019s Reshiram ASC 154\n\nTrainer: 9\n4 Pok\u00e9 Pad ASC 198\n2 Counter Catcher PAR 160\n3 Anthea & Concordia ASC 182\n2 Boss\u2019s Orders MEG 114\n2 Crispin PRE 105\n2 Hilda WHT 84\n2 Dawn PFL 87\n3 Rare Candy SVI 191\n1 Prime Catcher TEF 157\n\nEnergy: 4\n4 Basic {D} Energy SVE 15\n2 Basic {L} Energy SVE 12\n3 Basic {R} Energy SVE 10\n1 Luminous Energy PAL 191\n1 Reversal Energy PAL 192";

// Call the real parseDeckList via the controller
const controller = new DeckImport();

// parseDeckList is private, so call it via the public endpoint mock
const mockReq = { body: { deckList } };
const mockRes = {
  _result: null,
  _status: 200,
  status(code) { this._status = code; return this; },
  json(data) { this._result = data; return this; }
};

controller.onParse(mockReq, mockRes).then(() => {
  const result = mockRes._result;

  console.log('=== KNOWN CARDS ===');
  for (const c of result.knownCards) {
    console.log(`  [OK] ${c.quantity}x ${c.name} ${c.setCode} ${c.setNumber} -> ${c.fullName}`);
  }

  console.log('\n=== UNKNOWN CARDS ===');
  for (const c of result.unknownCards) {
    console.log(`  [??] ${c.quantity}x ${c.name} ${c.setCode} ${c.setNumber} -> ${c.fullName}`);
  }

  console.log('\n=== PARSE ERRORS ===');
  for (const e of result.parseErrors) {
    console.log(`  [ERR] ${e}`);
  }

  console.log(`\nSummary: ${result.knownCards.length} known, ${result.unknownCards.length} unknown, ${result.parseErrors.length} parse errors, ${result.totalCards} total cards`);
}).catch(err => {
  console.error('Error:', err.message);
  console.error(err.stack);
});

// @ts-nocheck
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
if (typeof fetch === 'undefined') {
    global.fetch = require('node-fetch');
}
const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs');
const { join, resolve } = require('path');
// Import set code mapping from the generate script
const setCodeToTcgDexId = {
    // Sword & Shield
    SSH: 'swsh1',
    RCL: 'swsh2',
    DAA: 'swsh3',
    CPA: 'swsh35',
    VIV: 'swsh4',
    BST: 'swsh5',
    CRE: 'swsh6',
    EVS: 'swsh7',
    CEL: 'swshcel',
    FST: 'swsh8',
    BRS: 'swsh9',
    ASR: 'swsh10',
    LOR: 'swsh11',
    SIT: 'swsh12',
    SHF: 'swsh45',
    CRZ: 'swsh125',
    PGO: 'swshpgo',
    // Scarlet & Violet
    SVI: 'sv1',
    PAL: 'sv2',
    OBF: 'sv3',
    MEW: 'sv35',
    PAR: 'sv4',
    PAF: 'sv45',
    TEF: 'sv5',
    TWM: 'sv6',
    SFA: 'sv65',
    SCR: 'sv7',
    SSP: 'sv8',
    PRE: 'sv85',
    JTG: 'sv9',
    SVP: 'svp',
    // Sun & Moon
    SUM: 'sm1',
    GRI: 'sm2',
    BUS: 'sm3',
    SLG: 'sm35',
    CIN: 'sm4',
    UPR: 'sm5',
    FLI: 'sm6',
    CES: 'sm7',
    DRM: 'sm75',
    LOT: 'sm8',
    TEU: 'sm9',
    UNB: 'sm10',
    UNM: 'sm11',
    HIF: 'sm115',
    CEC: 'sm12',
    DET: 'det1',
    SMP: 'smp',
    // XY
    XY: 'xy1',
    FLF: 'xy2',
    FFI: 'xy3',
    PHF: 'xy4',
    PRC: 'xy5',
    ROS: 'xy6',
    AOR: 'xy7',
    BKT: 'xy8',
    BKP: 'xy9',
    GEN: 'g1',
    FCO: 'xy10',
    STS: 'xy11',
    EVO: 'xy12',
    XYP: 'xyp',
    // Black & White
    BLW: 'bw1',
    EPO: 'bw2',
    NVI: 'bw3',
    NXD: 'bw4',
    DEX: 'bw5',
    DRX: 'bw6',
    DRV: 'bw6v',
    BCR: 'bw7',
    PLS: 'bw8',
    PLF: 'bw9',
    PLB: 'bw10',
    LTR: 'bw11',
    BWP: 'bwp',
    // HGSS
    HS: 'hgss1',
    UL: 'hgss2',
    UD: 'hgss3',
    TM: 'hgss4',
    CL: 'col1',
    // Diamond & Pearl
    DP: 'dp1',
    MT: 'dp2',
    SW: 'dp3',
    GE: 'dp4',
    MD: 'dp5',
    LA: 'dp6',
    SF: 'dp7',
    // Platinum
    PL: 'pl1',
    RR: 'pl2',
    SV: 'pl3',
    AR: 'pl4',
    // WOTC
    BS: 'base1',
    JU: 'base2',
    FO: 'base3',
    TR: 'base5',
    G1: 'gym1',
    G2: 'gym2',
    N1: 'neo1',
    N2: 'neo2',
    N3: 'neo3',
    N4: 'neo4',
    LC: 'lc',
    EX: 'ecard1',
    AQ: 'ecard2',
    SK: 'ecard3',
};
// TCGdex set IDs to internal set codes
const tcgDexIdToSetCode = {};
for (const [code, tcgId] of Object.entries(setCodeToTcgDexId)) {
    tcgDexIdToSetCode[tcgId] = code;
}
const UNKNOWN_CARDS_FILE = join(__dirname, '../../data/unknown-cards.json');
const FETCH_CACHE_FILE = join(__dirname, '../../data/tcgdex-cache.json');
function toPascalCase(str) {
    return str
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/(?:^|\s)([a-z])/g, (_, c) => c.toUpperCase())
        .replace(/\s+/g, '');
}
function toKebabCase(str) {
    return str
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
}
function getSetFolder(setAbbr) {
    // Map common set codes to their folder names
    const setFolderMap = {
        CES: 'set-celestial-storm',
        UPR: 'set-ultra-prism',
        GRI: 'set-guardians-rising',
        BUS: 'set-burning-shadows',
        SLG: 'set-shining-legends',
        CIN: 'set-crimson-invasion',
        SUM: 'set-sun-and-moon',
        FLI: 'set-forbidden-light',
        LOT: 'set-lost-thunder',
        TEU: 'set-team-up',
        UNB: 'set-unbroken-bonds',
        UNM: 'set-unified-minds',
        HIF: 'set-hidden-fates',
        CEC: 'set-cosmic-eclipse',
        SSH: 'set-sword-and-shield',
        RCL: 'set-rebel-clash',
        DAA: 'set-darkness-ablaze',
        VIV: 'set-vivid-voltage',
        BST: 'set-battle-styles',
        CRE: 'set-chilling-reign',
        EVS: 'set-evolving-skies',
        FST: 'set-fusion-strike',
        BRS: 'set-brilliant-stars',
        ASR: 'set-astral-radiance',
        LOR: 'set-lost-origin',
        SIT: 'set-silver-tempest',
        CRZ: 'set-crown-zenith',
        SVI: 'set-scarlet-and-violet',
        PAL: 'set-paldea-evolved',
        OBF: 'set-obsidian-flames',
        PAR: 'set-paradox-rift',
        PAF: 'set-paldean-fates',
        TEF: 'set-temporal-forces',
        TWM: 'set-twilight-masquerade',
        SCR: 'set-stellar-crown',
        SSP: 'set-surging-sparks',
        PRE: 'set-prismatic-evolution',
        JTG: 'set-journey-together',
        SMP: 'set-sun-and-moon-promos',
        BWP: 'set-black-and-white-promos',
        XYP: 'set-xy-promos',
        SVP: 'set-scarlet-and-violet-promos',
    };
    return setFolderMap[setAbbr] || `set-${setAbbr.toLowerCase()}`;
}
function mapCardTypeSymbol(type) {
    if (!type)
        return 'C';
    const t = type.toLowerCase();
    if (t === 'darkness' || t === 'dark')
        return 'D';
    if (t === 'colorless')
        return 'C';
    if (t === 'fighting')
        return 'F';
    if (t === 'grass')
        return 'G';
    if (t === 'lightning' || t === 'electric')
        return 'L';
    if (t === 'metal' || t === 'steel')
        return 'M';
    if (t === 'psychic')
        return 'P';
    if (t === 'fire')
        return 'R';
    if (t === 'water')
        return 'W';
    if (t === 'fairy')
        return 'Y';
    if (t === 'dragon')
        return 'N';
    return 'C';
}
function mapStage(stage) {
    if (!stage)
        return 'Stage.BASIC';
    const s = stage.toLowerCase();
    if (s === 'basic')
        return 'Stage.BASIC';
    if (s === 'stage1' || s === 'stage 1')
        return 'Stage.STAGE_1';
    if (s === 'stage2' || s === 'stage 2')
        return 'Stage.STAGE_2';
    if (s === 'vmax')
        return 'Stage.VMAX';
    if (s === 'vstar')
        return 'Stage.VSTAR';
    if (s === 'v')
        return 'Stage.BASIC';
    if (s === 'ex')
        return 'Stage.BASIC';
    if (s === 'gx')
        return 'Stage.BASIC';
    return 'Stage.BASIC';
}
function escapeSingleQuotes(str) {
    return (str || '').replace(/'/g, "\\'");
}
function formatCost(costArr) {
    if (!costArr || !costArr.length)
        return '[]';
    return `[${costArr.map(c => mapCardTypeSymbol(c)).join(', ')}]`;
}
// Helper to strip circular references from TCGdex response
function sanitizeForCache(obj) {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return undefined;
            }
            seen.add(value);
        }
        return value;
    }));
}
// Helper to strip SDK metadata from TCGdex data for cleaner storage
function stripSdkMetadata(data) {
    const { sdk } = data, cleaned = __rest(data, ["sdk"]);
    return cleaned;
}
async function fetchCardFromTcgDex(card) {
    const TCGdex = require('@tcgdex/sdk').default;
    const tcgdex = new TCGdex('en');
    const tcgdexSetId = setCodeToTcgDexId[card.setCode.toUpperCase()];
    if (!tcgdexSetId) {
        return {
            card,
            tcgdexData: null,
            error: `Unknown set code mapping for: ${card.setCode}`
        };
    }
    const cardId = `${tcgdexSetId}-${card.setNumber}`;
    try {
        const data = await tcgdex.card.get(cardId);
        if (!data) {
            return {
                card,
                tcgdexData: null,
                error: `Card not found in TCGdex: ${cardId}`
            };
        }
        return {
            card,
            tcgdexData: sanitizeForCache(data),
            error: null
        };
    }
    catch (err) {
        return {
            card,
            tcgdexData: null,
            error: `Error fetching card ${cardId}: ${err.message}`
        };
    }
}
function generateCardClass(card, tcgdexData) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const category = tcgdexData.category || 'Pokemon';
    const isPokemon = category === 'Pokemon' || category === 'Pokémon';
    const isTrainer = category === 'Trainer';
    const isEnergy = category === 'Energy';
    let baseClass = 'PokemonCard';
    let importPath = '../../game/store/card/pokemon-card';
    if (isTrainer) {
        baseClass = 'TrainerCard';
        importPath = '../../game/store/card/trainer-card';
    }
    else if (isEnergy) {
        baseClass = 'EnergyCard';
        importPath = '../../game/store/card/energy-card';
    }
    const className = toPascalCase(((_a = tcgdexData.name) === null || _a === void 0 ? void 0 : _a.en) || tcgdexData.name || card.name);
    const fileName = toKebabCase(((_b = tcgdexData.name) === null || _b === void 0 ? void 0 : _b.en) || tcgdexData.name || card.name) + '.ts';
    const folder = getSetFolder(card.setCode);
    let props = '';
    const imports = [`import { ${baseClass} } from '${importPath}';`];
    if (isPokemon) {
        imports.push("import { Stage, CardType, CardTag } from '../../game/store/card/card-types';");
        // Stage
        props += `  public stage: Stage = ${mapStage(tcgdexData.stage)};\n`;
        // Evolves from
        if (tcgdexData.evolveFrom) {
            props += `  public evolvesFrom = '${escapeSingleQuotes(((_c = tcgdexData.evolveFrom) === null || _c === void 0 ? void 0 : _c.en) || tcgdexData.evolveFrom)}';\n`;
        }
        // Card type
        const cardType = ((_d = tcgdexData.types) === null || _d === void 0 ? void 0 : _d[0]) || tcgdexData.type || 'Colorless';
        props += `  public cardType: CardType = ${mapCardTypeSymbol(cardType)};\n`;
        // HP
        props += `  public hp: number = ${tcgdexData.hp || 0};\n`;
        // Weakness
        if ((_e = tcgdexData.weaknesses) === null || _e === void 0 ? void 0 : _e.length) {
            props += `  public weakness = [{ type: ${mapCardTypeSymbol(tcgdexData.weaknesses[0].type)} }];\n`;
        }
        // Resistance
        if ((_f = tcgdexData.resistances) === null || _f === void 0 ? void 0 : _f.length) {
            const res = tcgdexData.resistances[0];
            props += `  public resistance = [{ type: ${mapCardTypeSymbol(res.type)}, value: ${res.value || -30} }];\n`;
        }
        // Retreat
        if (tcgdexData.retreat && tcgdexData.retreat > 0) {
            const retreatArr = Array(tcgdexData.retreat).fill('C');
            props += `  public retreat = [${retreatArr.join(', ')}];\n`;
        }
        // Abilities/Powers
        if ((_g = tcgdexData.abilities) === null || _g === void 0 ? void 0 : _g.length) {
            const powers = tcgdexData.abilities.map((a) => {
                var _a, _b;
                const name = escapeSingleQuotes(((_a = a.name) === null || _a === void 0 ? void 0 : _a.en) || a.name || '');
                const text = escapeSingleQuotes(((_b = a.effect) === null || _b === void 0 ? void 0 : _b.en) || a.effect || '').replace(/\n/g, '\\n');
                const powerType = a.type || 'Ability';
                return `    {\n      name: '${name}',\n      powerType: PowerType.${powerType.toUpperCase()},\n      text: '${text}'\n    }`;
            });
            props += `\n  public powers = [\n${powers.join(',\n')}\n  ];\n`;
            imports.push("import { PowerType } from '../../game/store/card/card-types';");
        }
        // Attacks
        if ((_h = tcgdexData.attacks) === null || _h === void 0 ? void 0 : _h.length) {
            const attacks = tcgdexData.attacks.map((a) => {
                var _a, _b;
                const name = escapeSingleQuotes(((_a = a.name) === null || _a === void 0 ? void 0 : _a.en) || a.name || '');
                const cost = formatCost(a.cost || []);
                const damage = a.damage ? (isNaN(Number(a.damage)) ? 0 : Number(a.damage)) : 0;
                const text = escapeSingleQuotes(((_b = a.effect) === null || _b === void 0 ? void 0 : _b.en) || a.effect || '').replace(/\n/g, '\\n');
                return `    {\n      name: '${name}',\n      cost: ${cost},\n      damage: ${damage},\n      text: '${text}'\n    }`;
            });
            props += `\n  public attacks = [\n${attacks.join(',\n')}\n  ];\n`;
        }
    }
    else if (isTrainer) {
        imports.push("import { TrainerType } from '../../game/store/card/card-types';");
        // Trainer type
        const trainerType = tcgdexData.trainerType || 'Item';
        props += `  public trainerType: TrainerType = TrainerType.${trainerType.toUpperCase()};\n`;
        // Text/effect
        if (tcgdexData.effect) {
            props += `\n  public text: string = '${escapeSingleQuotes(((_j = tcgdexData.effect) === null || _j === void 0 ? void 0 : _j.en) || tcgdexData.effect).replace(/\n/g, '\\n')}';\n`;
        }
    }
    else if (isEnergy) {
        imports.push("import { EnergyType } from '../../game/store/card/card-types';");
        const energyType = tcgdexData.energyType || 'Special';
        props += `  public energyType = EnergyType.${energyType.toUpperCase()};\n`;
        if (tcgdexData.effect) {
            props += `\n  public text: string = '${escapeSingleQuotes(((_k = tcgdexData.effect) === null || _k === void 0 ? void 0 : _k.en) || tcgdexData.effect).replace(/\n/g, '\\n')}';\n`;
        }
    }
    // Regulation mark
    if (tcgdexData.regulationMark) {
        props += `  public regulationMark = '${tcgdexData.regulationMark}';\n`;
    }
    // Common properties
    props += `\n  public set: string = '${card.setCode.toUpperCase()}';\n`;
    props += `  public setNumber: string = '${card.setNumber}';\n`;
    props += `  public cardImage: string = 'assets/cardback.png';\n`;
    props += `  public name: string = '${escapeSingleQuotes(((_l = tcgdexData.name) === null || _l === void 0 ? void 0 : _l.en) || tcgdexData.name || card.name)}';\n`;
    props += `  public fullName: string = '${escapeSingleQuotes(((_m = tcgdexData.name) === null || _m === void 0 ? void 0 : _m.en) || tcgdexData.name || card.name)} ${card.setCode.toUpperCase()}';\n`;
    const content = `${imports.join('\n')}\n\nexport class ${className} extends ${baseClass} {\n${props}}\n`;
    return { content, fileName, folder };
}
async function main() {
    const args = process.argv.slice(2);
    const fetchOnly = args.includes('--fetch-only');
    const generateOnly = args.includes('--generate-only');
    // Read unknown cards file
    if (!existsSync(UNKNOWN_CARDS_FILE)) {
        console.error('Unknown cards file not found:', UNKNOWN_CARDS_FILE);
        console.error('Run the deck-import API endpoint first to generate unknown cards.');
        process.exit(1);
    }
    const unknownCardsData = JSON.parse(readFileSync(UNKNOWN_CARDS_FILE, 'utf-8'));
    console.log(`Found ${unknownCardsData.cards.length} unknown cards to process\n`);
    if (unknownCardsData.cards.length === 0) {
        console.log('No unknown cards to process. All cards are already known!');
        process.exit(0);
    }
    // Fetch data from TCGdex
    const fetchResults = [];
    let cache = {};
    // Load cache if exists
    if (existsSync(FETCH_CACHE_FILE)) {
        try {
            cache = JSON.parse(readFileSync(FETCH_CACHE_FILE, 'utf-8'));
        }
        catch (_a) {
            cache = {};
        }
    }
    console.log('Fetching card data from TCGdex...\n');
    for (const card of unknownCardsData.cards) {
        const cacheKey = `${card.setCode}-${card.setNumber}`;
        if (generateOnly && cache[cacheKey]) {
            fetchResults.push({
                card,
                tcgdexData: cache[cacheKey],
                error: null
            });
            console.log(`✓ [CACHED] ${card.name} ${card.setCode} ${card.setNumber}`);
        }
        else {
            const result = await fetchCardFromTcgDex(card);
            fetchResults.push(result);
            if (result.tcgdexData) {
                cache[cacheKey] = result.tcgdexData;
                console.log(`✓ [FETCHED] ${card.name} ${card.setCode} ${card.setNumber}`);
            }
            else {
                console.log(`✗ [FAILED] ${card.name} ${card.setCode} ${card.setNumber}: ${result.error}`);
            }
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
    // Save cache
    const cacheDir = join(__dirname, '../../data');
    if (!existsSync(cacheDir)) {
        mkdirSync(cacheDir, { recursive: true });
    }
    writeFileSync(FETCH_CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
    // Update unknown-cards.json with TCGdex data
    for (const result of fetchResults) {
        if (result.tcgdexData) {
            const cardIndex = unknownCardsData.cards.findIndex(c => c.name === result.card.name && c.setCode === result.card.setCode && c.setNumber === result.card.setNumber);
            if (cardIndex !== -1) {
                // Add tcgdex data to the card entry (without SDK metadata)
                unknownCardsData.cards[cardIndex].tcgdexData = stripSdkMetadata(result.tcgdexData);
            }
        }
    }
    unknownCardsData.lastUpdated = new Date().toISOString();
    writeFileSync(UNKNOWN_CARDS_FILE, JSON.stringify(unknownCardsData, null, 2), 'utf-8');
    console.log(`Updated ${UNKNOWN_CARDS_FILE} with TCGdex data`);
    if (fetchOnly) {
        console.log('\n--- Fetch Only Mode ---');
        console.log(`Fetched ${fetchResults.filter(r => r.tcgdexData).length} / ${fetchResults.length} cards`);
        console.log('Cache saved to:', FETCH_CACHE_FILE);
        process.exit(0);
    }
    // Generate card classes
    console.log('\n--- Generating Card Classes ---\n');
    const generationResults = [];
    for (const result of fetchResults) {
        if (!result.tcgdexData) {
            generationResults.push({
                card: result.card,
                success: false,
                filePath: null,
                error: result.error || 'No TCGdex data available'
            });
            continue;
        }
        try {
            const { content, fileName, folder } = generateCardClass(result.card, result.tcgdexData);
            const folderPath = join(__dirname, folder);
            const filePath = join(folderPath, fileName);
            // Create folder if it doesn't exist
            if (!existsSync(folderPath)) {
                mkdirSync(folderPath, { recursive: true });
            }
            writeFileSync(filePath, content.trim(), 'utf-8');
            generationResults.push({
                card: result.card,
                success: true,
                filePath,
                error: null
            });
            console.log(`✓ Generated: ${filePath}`);
        }
        catch (err) {
            generationResults.push({
                card: result.card,
                success: false,
                filePath: null,
                error: err.message
            });
            console.log(`✗ Failed to generate ${result.card.name}: ${err.message}`);
        }
    }
    // Summary
    console.log('\n========== SUMMARY ==========\n');
    const successCount = generationResults.filter(r => r.success).length;
    const failCount = generationResults.filter(r => !r.success).length;
    console.log(`Total cards processed: ${generationResults.length}`);
    console.log(`Successfully generated: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    if (failCount > 0) {
        console.log('\n--- Failed Cards ---');
        for (const result of generationResults.filter(r => !r.success)) {
            console.log(`  - ${result.card.name} ${result.card.setCode} ${result.card.setNumber}: ${result.error}`);
        }
    }
    if (successCount > 0) {
        console.log('\n--- Next Steps ---');
        console.log('1. Review the generated card files');
        console.log('2. Add exports to the set index.ts files');
        console.log('3. Implement card effects/abilities (marked with TODO comments)');
        console.log('4. Test the cards in-game');
    }
}
main().catch(e => {
    console.error(e);
    process.exit(1);
});

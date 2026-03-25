"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decks = void 0;
const typeorm_1 = require("typeorm");
const services_1 = require("../services");
const game_1 = require("../../game");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
const storage_1 = require("../../storage");
const card_types_1 = require("../../game/store/card/card-types");
const any_printing_allowed_1 = require("../../game/store/card/any-printing-allowed");
class Decks extends controller_1.Controller {
    async onList(req, res) {
        res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
        return;
    }
    async onSave(req, res) {
        const body = req.body;
        // optional id parameter, without ID new deck will be created
        if (body.id !== undefined && typeof body.id !== 'number') {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM, param: 'id' });
            return;
        }
        // check if all cards exist in our database
        if (!this.validateCards(body.cards)) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM, param: 'cards' });
            return;
        }
        // Resolve legacy names to their new fullNames
        const cardManager = game_1.CardManager.getInstance();
        const resolvedCards = body.cards.map(cardName => {
            const card = cardManager.getCardByName(cardName);
            return card ? card.fullName : cardName; // Fallback to original if not found
        });
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        let deck = body.id !== undefined
            ? await storage_1.Deck.findOne(body.id, { relations: ['user'] })
            : (() => { const d = new storage_1.Deck(); d.user = user; return d; })();
        if (deck === undefined || deck.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.DECK_INVALID });
            return;
        }
        const deckUtils = new game_1.DeckAnalyser(resolvedCards);
        deck.name = body.name.trim();
        deck.cards = JSON.stringify(resolvedCards);
        deck.isValid = deckUtils.isValid();
        deck.cardTypes = JSON.stringify(deckUtils.getDeckType());
        deck.manualArchetype1 = body.manualArchetype1 || '';
        deck.manualArchetype2 = body.manualArchetype2 || '';
        // Save artworks if present
        if ('artworks' in body && body.artworks) {
            deck.artworks = JSON.stringify(body.artworks);
        }
        try {
            deck = await deck.save();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.NAME_DUPLICATE });
            return;
        }
        res.send({
            ok: true, deck: Object.assign({ id: deck.id, name: deck.name, cards: resolvedCards, manualArchetype1: deck.manualArchetype1, manualArchetype2: deck.manualArchetype2 }, (body.artworks ? { artworks: body.artworks } : {}))
        });
    }
    async onDelete(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const deck = await storage_1.Deck.findOne(body.id, { relations: ['user'] });
        if (deck === undefined || deck.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.DECK_INVALID });
            return;
        }
        await deck.remove();
        res.send({ ok: true });
    }
    async onRename(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        let deck = await storage_1.Deck.findOne(body.id, { relations: ['user'] });
        if (deck === undefined || deck.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.DECK_INVALID });
            return;
        }
        try {
            deck.name = body.name.trim();
            deck = await deck.save();
        }
        catch (error) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.NAME_DUPLICATE });
            return;
        }
        res.send({
            ok: true, deck: {
                id: deck.id,
                name: deck.name
            }
        });
    }
    async onDuplicate(req, res) {
        const body = req.body;
        const userId = req.body.userId;
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.PROFILE_INVALID });
            return;
        }
        const deck = await storage_1.Deck.findOne(body.id, { relations: ['user'] });
        if (deck === undefined || deck.user.id !== user.id) {
            res.status(400);
            res.send({ error: errors_1.ApiErrorEnum.DECK_INVALID });
            return;
        }
        delete body.id;
        body.cards = JSON.parse(deck.cards);
        return this.onSave(req, res);
    }
    async onStats(req, res) {
        const userId = req.body.userId;
        const deckId = parseInt(req.params.deckId, 10);
        const statsLogLabel = `[Decks:onStats] deckId=${deckId}`;
        console.time(statsLogLabel);
        // Verify deck belongs to user
        const deck = await storage_1.Deck.findOne(deckId, { relations: ['user'] });
        if (deck === undefined || deck.user.id !== userId) {
            console.timeEnd(statsLogLabel);
            res.send({ error: errors_1.ApiErrorEnum.DECK_INVALID });
            return;
        }
        // Optional limit for number of replays returned (for payload/perf reasons)
        const replayLimitParam = req.query.limit;
        const replayLimit = replayLimitParam ? Math.max(1, Math.min(parseInt(replayLimitParam, 10) || 0, 500)) : 100;
        // Get all matches where this deck was used
        const dbStart = Date.now();
        const matches = await storage_1.Match.find({
            where: [
                { player1DeckId: deckId },
                { player2DeckId: deckId }
            ],
            relations: ['player1', 'player2'],
            order: { created: 'DESC' }
        });
        const dbDuration = Date.now() - dbStart;
        console.log(`${statsLogLabel} DB query took ${dbDuration}ms, matches: ${matches.length}`);
        let totalGames = 0;
        let wins = 0;
        let losses = 0;
        const matchupMap = {};
        const replays = [];
        const processStart = Date.now();
        // Aggregate matchup stats using a simple loop (fast in practice),
        // which is sufficient given the indexed match lookup and replay limits.
        matches.forEach((match, index) => {
            const isPlayer1 = match.player1DeckId === deckId;
            const isPlayer2 = match.player2DeckId === deckId;
            if (!isPlayer1 && !isPlayer2) {
                return; // Skip if deck wasn't used in this match
            }
            totalGames++;
            // Determine win/loss
            let won = false;
            if (isPlayer1 && match.winner === game_1.GameWinner.PLAYER_1) {
                won = true;
                wins++;
            }
            else if (isPlayer2 && match.winner === game_1.GameWinner.PLAYER_2) {
                won = true;
                wins++;
            }
            else {
                losses++;
            }
            // Get opponent archetypes (primary and secondary)
            const opponentArchetype1 = isPlayer1 ? match.player2Archetype : match.player1Archetype;
            const opponentArchetype2 = isPlayer1 ? match.player2Archetype2 : match.player1Archetype2;
            // Combine archetypes: "PRIMARY" or "PRIMARY/SECONDARY"
            let archetypeKey = opponentArchetype1 || 'UNKNOWN';
            if (opponentArchetype2 && opponentArchetype2.trim() !== '') {
                archetypeKey = `${opponentArchetype1}/${opponentArchetype2}`;
            }
            // Update matchup stats
            if (!matchupMap[archetypeKey]) {
                matchupMap[archetypeKey] = { games: 0, wins: 0, losses: 0 };
            }
            matchupMap[archetypeKey].games++;
            if (won) {
                matchupMap[archetypeKey].wins++;
            }
            else {
                matchupMap[archetypeKey].losses++;
            }
            // Add to replays list (limited to most recent N matches)
            if (index < replayLimit) {
                const opponent = isPlayer1 ? match.player2 : match.player1;
                replays.push({
                    matchId: match.id,
                    opponentName: opponent.name,
                    opponentId: opponent.id,
                    winner: match.winner,
                    created: match.created,
                    won
                });
            }
        });
        const processDuration = Date.now() - processStart;
        console.log(`${statsLogLabel} processing took ${processDuration}ms`);
        // Convert matchup map to array with win rates
        const matchups = Object.entries(matchupMap).map(([archetype, stats]) => ({
            archetype,
            games: stats.games,
            wins: stats.wins,
            losses: stats.losses,
            winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0
        })).sort((a, b) => b.games - a.games); // Sort by games played
        const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
        res.send({
            ok: true,
            deckId,
            totalGames,
            wins,
            losses,
            winRate,
            matchups,
            replays,
            replayLimit,
            totalReplays: matches.length
        });
        console.timeEnd(statsLogLabel);
    }
    async onBackfillSecondaryArchetypes(req, res) {
        // Get all matches that have deck IDs but may be missing secondary archetypes
        const matches = await storage_1.Match.find({
            where: [
                { player1DeckId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) },
                { player2DeckId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) }
            ],
            relations: ['player1', 'player2']
        });
        let updatedCount = 0;
        for (const match of matches) {
            let needsUpdate = false;
            // Backfill player1 secondary archetype
            if (match.player1DeckId && !match.player1Archetype2) {
                try {
                    const deck = await storage_1.Deck.findOne(match.player1DeckId);
                    if (deck && deck.manualArchetype2) {
                        match.player1Archetype2 = deck.manualArchetype2;
                        needsUpdate = true;
                    }
                }
                catch (error) {
                    console.error('[Decks] Error loading deck for backfill:', error);
                }
            }
            // Backfill player2 secondary archetype
            if (match.player2DeckId && !match.player2Archetype2) {
                try {
                    const deck = await storage_1.Deck.findOne(match.player2DeckId);
                    if (deck && deck.manualArchetype2) {
                        match.player2Archetype2 = deck.manualArchetype2;
                        needsUpdate = true;
                    }
                }
                catch (error) {
                    console.error('[Decks] Error loading deck for backfill:', error);
                }
            }
            if (needsUpdate) {
                //await match.save();
                updatedCount++;
            }
        }
        res.send({
            ok: true,
            message: `Backfilled ${updatedCount} matches with secondary archetypes`,
            updatedCount,
            totalMatches: matches.length
        });
    }
    async onValidateFormats(req, res) {
        const cardNames = req.body.cardNames;
        if (!Array.isArray(cardNames)) {
            return res.status(400).json({ ok: false, error: 'cardNames must be an array' });
        }
        const formats = getValidFormatsForCardList(cardNames);
        return res.json({ ok: true, formats });
    }
    validateCards(deck) {
        const cardManager = game_1.CardManager.getInstance();
        const validNames = new Set();
        cardManager.getAllCards().forEach(c => {
            validNames.add(c.fullName);
            const p = c;
            if (p.legacyFullName) {
                validNames.add(p.legacyFullName);
            }
        });
        for (const cardName of deck) {
            if (!validNames.has(cardName)) {
                return false;
            }
        }
        return true;
    }
}
__decorate([
    (0, controller_1.Get)('/list'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onList", null);
__decorate([
    (0, controller_1.Post)('/save'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        name: (0, services_1.check)().minLength(3).maxLength(32),
        cards: (0, services_1.check)().required()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onSave", null);
__decorate([
    (0, controller_1.Post)('/delete'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        id: (0, services_1.check)().isNumber()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onDelete", null);
__decorate([
    (0, controller_1.Post)('/rename'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        id: (0, services_1.check)().isNumber(),
        name: (0, services_1.check)().minLength(3).maxLength(32),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onRename", null);
__decorate([
    (0, controller_1.Post)('/duplicate'),
    (0, services_1.AuthToken)(),
    (0, services_1.Validate)({
        id: (0, services_1.check)().isNumber(),
        name: (0, services_1.check)().minLength(3).maxLength(32),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onDuplicate", null);
__decorate([
    (0, controller_1.Get)('/stats/:deckId'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onStats", null);
__decorate([
    (0, controller_1.Post)('/backfill-secondary-archetypes'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onBackfillSecondaryArchetypes", null);
__decorate([
    (0, controller_1.Post)('/validate-formats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Decks.prototype, "onValidateFormats", null);
exports.Decks = Decks;
// --- BanLists and SetReleaseDates (ported from frontend) ---
const BanLists = {
    [card_types_1.Format.GLC]: [
        'Palace Book SMP NAN25',
        'Miracle Diamond BRP 1',
        'Mysterious Pearl BRP 2',
        'Wonder Platinum DPt-P 33',
        'Lysandre\'s Trump Card PHF 99',
        'Lysandre\'s Trump Card PHF 118',
        'Oranguru UPR 114',
        'Forest of Giant Plants AOR 74',
        'Chip-Chip Ice Axe UNB 165',
        'Hiker CES 133',
        'Hiker HIF SV85',
        'Kyogre SHF 021',
        'Pokémon Research Lab UNM 205',
        'Raikou VIV 50',
        'Duskull CEC 83',
        'Marshadow SLG 45',
        'Marshadow SM 85',
        'Double Colorless Energy XY 130',
        'Double Colorless Energy BS 96',
        'Twin Energy RCL 174'
    ],
    [card_types_1.Format.EXPANDED]: [
        'Palace Book SMP NAN25',
        'Miracle Diamond BRP 1',
        'Mysterious Pearl BRP 2',
        'Wonder Platinum DPt-P 33',
        'Archeops NVI 67',
        'Archeops DEX 110',
        'Chip-Chip Ice Axe UNB 165',
        'Delinquent BKP 98',
        'Delinquent BKP 98a',
        'Delinquent BKP 98b',
        'Flabébé FLI 83',
        'Forest of Giant Plants AOR 74',
        'Ghetsis PLF 101',
        'Ghetsis PLF 115',
        'Hex Maniac AOR 75',
        'Hex Maniac AOR 75a',
        'Island Challenge Amulet CEC 194',
        'Jesse & James HIF 58',
        'Jesse & James HIF 68',
        'Lt. Surge\'s Strategy UNB 178',
        'Lt. Surge\'s Strategy HIF 60',
        'Lysandre\'s Trump Card PHF 99',
        'Lysandre\'s Trump Card PHF 118',
        'Marshadow SHL 45',
        'Marshadow PR-SM SM85',
        'Milotic FLF 23',
        'Mismagius UNB 78',
        'Oranguru UPR 114',
        'Puzzle of Time BKP 109',
        'Red Card GEN 71',
        'Reset Stamp UNM 206',
        'Reset Stamp UNM 206a',
        'Reset Stamp UNM 253',
        'Sableye DEX 62',
        'Scoop Up Net RCL 165',
        'Scoop Up Net RCL 207',
        'Shaymin-EX ROS 77',
        'Shaymin-EX ROS 77a',
        'Shaymin-EX ROS 106',
        'Unown LOT 90',
        'Unown LOT 91',
        'Duskull CEC 83',
    ],
    [card_types_1.Format.RETRO]: [],
    [card_types_1.Format.UNLIMITED]: [],
    [card_types_1.Format.ETERNAL]: [
        'Arceus VSTAR BRS 123',
    ],
    [card_types_1.Format.STANDARD]: [],
    [card_types_1.Format.STANDARD_NIGHTLY]: [],
    [card_types_1.Format.BW]: [],
    [card_types_1.Format.XY]: [],
    [card_types_1.Format.SM]: [],
    [card_types_1.Format.SWSH]: [],
};
const SetReleaseDates = {
    'BS': new Date('1999-01-09'),
    'JU': new Date('1999-06-16'),
    'FO': new Date('1999-10-10'),
    'TR': new Date('2000-04-24'),
    'G1': new Date('2000-08-14'),
    'G2': new Date('2000-10-16'),
    'N1': new Date('2000-12-16'),
    'N2': new Date('2001-06-01'),
    'N3': new Date('2001-09-21'),
    'N4': new Date('2002-02-28'),
    'LC': new Date('2002-05-24'),
    'EX': new Date('2002-09-15'),
    'AQ': new Date('2003-01-15'),
    'SK': new Date('2003-05-12'),
    'RS': new Date('2003-07-18'),
    'SS': new Date('2003-09-18'),
    'DR': new Date('2003-11-24'),
    'MA': new Date('2004-03-15'),
    'HL': new Date('2004-06-14'),
    'FL': new Date('2004-08-30'),
    'TRR': new Date('2004-11-08'),
    'DX': new Date('2005-02-14'),
    'EM': new Date('2005-05-09'),
    'UF': new Date('2005-08-22'),
    'DS': new Date('2005-10-31'),
    'LM': new Date('2006-02-13'),
    'HP': new Date('2006-05-03'),
    'CG': new Date('2006-08-30'),
    'DF': new Date('2006-11-08'),
    'PK': new Date('2007-02-14'),
    'DP': new Date('2007-05-23'),
    'MT': new Date('2007-08-22'),
    'SW': new Date('2007-11-07'),
    'GE': new Date('2008-02-13'),
    'MD': new Date('2008-05-21'),
    'LA': new Date('2008-08-20'),
    'SF': new Date('2008-11-05'),
    'PL': new Date('2009-02-11'),
    'RR': new Date('2009-05-16'),
    'SV': new Date('2009-08-19'),
    'AR': new Date('2009-11-04'),
    'HS': new Date('2010-02-10'),
    'UL': new Date('2010-05-12'),
    'UD': new Date('2010-08-18'),
    'TM': new Date('2010-11-03'),
    'CL': new Date('2011-02-09'),
    'BWP': new Date('2011-04-25'),
    'BLW': new Date('2011-04-25'),
    'EPO': new Date('2011-08-31'),
    'NVI': new Date('2011-11-16'),
    'NXD': new Date('2012-02-08'),
    'DEX': new Date('2012-05-09'),
    'DRX': new Date('2012-08-15'),
    'DRV': new Date('2012-10-05'),
    'BCR': new Date('2012-11-07'),
    'PLS': new Date('2013-02-06'),
    'PLF': new Date('2013-05-08'),
    'PLB': new Date('2013-08-14'),
    'LTR': new Date('2013-11-06'),
    'KSS': new Date('2013-11-08'),
    'XY': new Date('2014-02-05'),
    'FLF': new Date('2014-05-07'),
    'FFI': new Date('2014-08-13'),
    'PHF': new Date('2014-11-05'),
    'PRC': new Date('2015-02-04'),
    'DCR': new Date('2015-03-25'),
    'ROS': new Date('2015-05-06'),
    'AOR': new Date('2015-08-12'),
    'BKT': new Date('2015-11-04'),
    'BKP': new Date('2016-02-03'),
    'GEN': new Date('2016-02-22'),
    'FCO': new Date('2016-05-02'),
    'STS': new Date('2016-08-03'),
    'EVO': new Date('2016-11-02'),
    'XYP': new Date('2016-03-19'),
    'SUM': new Date('2017-02-03'),
    'SMP': new Date('2017-02-03'),
    'SM10a': new Date('2017-02-03'),
    'GRI': new Date('2017-05-05'),
    'BUS': new Date('2017-08-04'),
    'SLG': new Date('2017-10-06'),
    'CIN': new Date('2017-11-03'),
    'UPR': new Date('2018-02-02'),
    'FLI': new Date('2018-04-05'),
    'CES': new Date('2018-03-08'),
    'DRM': new Date('2018-07-09'),
    'LOT': new Date('2018-11-02'),
    'TEU': new Date('2019-01-02'),
    'DET': new Date('2019-03-29'),
    'UNB': new Date('2019-03-05'),
    'UNM': new Date('2019-02-08'),
    'HIF': new Date('2019-08-23'),
    'CEC': new Date('2019-11-01'),
    'SWSH': new Date('2020-02-07'),
    'SSH': new Date('2020-02-07'),
    'RCL': new Date('2020-05-01'),
    'DAA': new Date('2020-08-14'),
    'CPA': new Date('2020-09-25'),
    'VIV': new Date('2020-11-13'),
    'SHF': new Date('2021-02-19'),
    'BST': new Date('2021-03-19'),
    'CRE': new Date('2021-06-18'),
    'EVS': new Date('2021-08-27'),
    'CEL': new Date('2021-10-08'),
    'FST': new Date('2021-11-12'),
    'BRS': new Date('2022-02-25'),
    'ASR': new Date('2022-05-27'),
    'PGO': new Date('2022-07-01'),
    'LOR': new Date('2022-09-09'),
    'SIT': new Date('2022-11-11'),
    'CRZ': new Date('2023-01-20'),
    'SVP': new Date('2023-03-31'),
    'SVI': new Date('2023-03-31'),
    'PAL': new Date('2023-06-09'),
    'OBF': new Date('2023-08-11'),
    'MEW': new Date('2023-09-22'),
    'PAR': new Date('2023-11-03'),
    'PAF': new Date('2024-01-26'),
    'TEF': new Date('2024-03-22'),
    'TWM': new Date('2024-05-22'),
    'SFA': new Date('2024-08-02'),
    'SCR': new Date('2024-09-13'),
    'SSP': new Date('2024-11-08'),
    'PRE': new Date('2025-01-17'),
    'JTG': new Date('2025-03-28'),
    'DRI': new Date('2025-05-17'),
    'SV11': new Date('2025-07-18'),
    'SV11B': new Date('2025-07-18'),
    'SV11W': new Date('2025-07-18'),
    'BLK': new Date('2025-07-18'),
    'WHT': new Date('2025-07-18'),
    'MEG': new Date('2025-09-26'),
    'MEP': new Date('2025-09-26'),
    'M1L': new Date('2025-09-26'),
    'M1S': new Date('2025-09-26'),
    'PFL': new Date('2025-11-14'),
    'M2a': new Date('2026-01-31'),
};
function getValidFormatsForCardList(cardNames) {
    const cardManager = game_1.CardManager.getInstance();
    const cards = cardNames.map((name) => cardManager.getCardByName(name)).filter((c) => !!c);
    if (!cards || cards.length === 0) {
        return [];
    }
    const formats = [];
    cards.filter((c) => c && (c.superType !== card_types_1.SuperType.ENERGY || c.energyType === card_types_1.EnergyType.SPECIAL)).forEach((card) => {
        if (card) {
            formats.push(getValidFormats(card));
        }
    });
    let formatList = formats.length > 0 ? formats.reduce((a, b) => a.filter((c) => b.includes(c))) : [];
    const set = new Set(cards.filter((c) => !!c).map((c) => c.name));
    if ((set.has('Professor Sycamore') && set.has('Professor Juniper')) ||
        (set.has('Professor Juniper') && set.has('Professor\'s Research')) ||
        (set.has('Professor Sycamore') && set.has('Professor\'s Research')) ||
        (set.has('Lysandre') && set.has('Boss\'s Orders'))) {
        return formatList.filter((f) => f !== card_types_1.Format.GLC &&
            f !== card_types_1.Format.EXPANDED &&
            f !== card_types_1.Format.STANDARD &&
            f !== card_types_1.Format.UNLIMITED &&
            f !== card_types_1.Format.ETERNAL);
    }
    // Check for Unown card restriction
    const hasUnownTag = cards.some((card) => card && card.tags && card.tags.includes(card_types_1.CardTag.UNOWN));
    if (hasUnownTag) {
        const unownCount = cards.filter((card) => card && card.name && card.name.includes('Unown')).length;
        if (unownCount > 4) {
            return formatList.filter((f) => f !== card_types_1.Format.GLC &&
                f !== card_types_1.Format.EXPANDED &&
                f !== card_types_1.Format.STANDARD &&
                f !== card_types_1.Format.UNLIMITED);
        }
    }
    // code for the Arceus Rule
    const hasArceusRule = cards.some((card) => card && card.tags && card.tags.includes(card_types_1.CardTag.ARCEUS));
    if (hasArceusRule) {
        const arceusRuleCount = cards.filter((card) => card && card.tags && card.tags.includes(card_types_1.CardTag.ARCEUS)).length;
        const arceusCount = cards.filter((card) => card && card.name === 'Arceus').length;
        if (arceusCount !== arceusRuleCount && arceusCount > 4) {
            return formatList.filter((f) => f !== card_types_1.Format.GLC &&
                f !== card_types_1.Format.EXPANDED &&
                f !== card_types_1.Format.STANDARD &&
                f !== card_types_1.Format.STANDARD_NIGHTLY &&
                f !== card_types_1.Format.UNLIMITED &&
                f !== card_types_1.Format.ETERNAL);
        }
    }
    // Check GLC rules first
    if (formatList.includes(card_types_1.Format.GLC)) {
        // check for singleton violation
        const nonBasicEnergyCards = cards.filter((c) => c && c.superType !== card_types_1.SuperType.ENERGY && c.energyType !== card_types_1.EnergyType.BASIC);
        const set2 = new Set(nonBasicEnergyCards.map((c) => c.name));
        if (set2.size < nonBasicEnergyCards.length) {
            formatList = formatList.filter((f) => f !== card_types_1.Format.GLC);
        }
        // check for different type violation
        const pokemonCards = cards.filter((c) => c && c.superType === card_types_1.SuperType.POKEMON);
        const pokemonSet = new Set(pokemonCards.map((c) => c && c.cardType));
        if (pokemonSet.size > 1) {
            formatList = formatList.filter((f) => f !== card_types_1.Format.GLC);
        }
    }
    // Then check energy type restrictions
    if ((set.has('Fairy Energy')) ||
        (set.has('Wonder Energy'))) {
        return formatList.filter((f) => f !== card_types_1.Format.STANDARD &&
            f !== card_types_1.Format.RETRO);
    }
    if ((set.has('Metal Energy')) ||
        (set.has('Darkness Energy'))) {
        return formatList.filter((f) => f !== card_types_1.Format.RETRO);
    }
    return formatList;
}
function getValidFormats(card) {
    const formats = [card_types_1.Format.UNLIMITED];
    [
        card_types_1.Format.ETERNAL,
        card_types_1.Format.STANDARD,
        card_types_1.Format.STANDARD_NIGHTLY,
        card_types_1.Format.EXPANDED,
        card_types_1.Format.GLC,
        card_types_1.Format.SV,
        card_types_1.Format.SWSH,
        card_types_1.Format.SM,
        card_types_1.Format.XY,
        card_types_1.Format.BW,
        card_types_1.Format.RSPK,
        card_types_1.Format.RETRO,
        card_types_1.Format.PRE_RELEASE,
    ].forEach((format) => {
        isValid(card, format, any_printing_allowed_1.ANY_PRINTING_ALLOWED) ? formats.push(format) : null;
    });
    return formats;
}
function isValid(card, format, anyPrintingAllowed) {
    if (card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.BASIC) {
        return true;
    }
    if (anyPrintingAllowed && anyPrintingAllowed.includes(card.name)) {
        switch (format) {
            case card_types_1.Format.UNLIMITED:
                return true;
            case card_types_1.Format.ETERNAL:
                return !BanLists[format].includes(`${card.name} ${card.set} ${card.setNumber}`);
            case card_types_1.Format.STANDARD: {
                return card.regulationMark === 'G' ||
                    card.regulationMark === 'H' ||
                    card.regulationMark === 'I';
            }
            case card_types_1.Format.STANDARD_NIGHTLY:
                return card.regulationMark === 'G' ||
                    card.regulationMark === 'H' ||
                    card.regulationMark === 'I' ||
                    card.regulationMark === 'J';
            case card_types_1.Format.EXPANDED: {
                // For anyPrintingAllowed cards, they are known to be legal in Expanded format
                // Just check if this specific printing is not banned
                return !BanLists[format].includes(`${card.name} ${card.set} ${card.setNumber}`);
            }
            case card_types_1.Format.GLC: {
                // For anyPrintingAllowed, do NOT check set date, only tags
                return !(card.tags && card.tags.some((t) => [
                    card_types_1.CardTag.ACE_SPEC.toString(),
                    card_types_1.CardTag.POKEMON_EX.toString(),
                    card_types_1.CardTag.POKEMON_ex.toString(),
                    card_types_1.CardTag.POKEMON_V.toString(),
                    card_types_1.CardTag.POKEMON_VMAX.toString(),
                    card_types_1.CardTag.POKEMON_VSTAR.toString(),
                    card_types_1.CardTag.RADIANT.toString(),
                    card_types_1.CardTag.POKEMON_GX.toString(),
                    card_types_1.CardTag.PRISM_STAR.toString(),
                    card_types_1.CardTag.POKEMON_VUNION.toString()
                ].includes(t)));
            }
            case card_types_1.Format.RETRO:
                return true;
            case card_types_1.Format.BW:
                return true;
            case card_types_1.Format.SWSH:
                return true;
            case card_types_1.Format.XY:
                return true;
            case card_types_1.Format.SM:
                return true;
            case card_types_1.Format.RSPK:
                return true;
            case card_types_1.Format.PRE_RELEASE:
                // Pre-Release format allows all cards (like UNLIMITED)
                return true;
        }
    }
    switch (format) {
        case card_types_1.Format.UNLIMITED:
            return true;
        case card_types_1.Format.ETERNAL:
            return !BanLists[format].includes(`${card.name} ${card.set} ${card.setNumber}`);
        case card_types_1.Format.STANDARD: {
            const setDate = SetReleaseDates[card.set];
            if (card.regulationMark === 'J') {
                return false;
            }
            return setDate >= SetReleaseDates['SVI'] && setDate <= new Date();
        }
        case card_types_1.Format.STANDARD_NIGHTLY:
            return card.regulationMark === 'G' ||
                card.regulationMark === 'H' ||
                card.regulationMark === 'I' ||
                card.regulationMark === 'J';
        case card_types_1.Format.EXPANDED: {
            const setDate = SetReleaseDates[card.set];
            return setDate >= new Date('Mon, 25 Apr 2011 00:00:00 GMT') && setDate <= new Date() &&
                !BanLists[format].includes(`${card.name} ${card.set} ${card.setNumber}`);
        }
        case card_types_1.Format.GLC: {
            const setDate = SetReleaseDates[card.set];
            const forceLegalSets = ['SV11', 'SV11B', 'SV11W'];
            const isForceLegal = forceLegalSets.includes(card.set);
            return (((setDate >= new Date('Mon, 25 Apr 2011 00:00:00 GMT') && setDate <= new Date())
                || isForceLegal) &&
                !(card.tags && card.tags.some((t) => [
                    card_types_1.CardTag.ACE_SPEC.toString(),
                    card_types_1.CardTag.POKEMON_EX.toString(),
                    card_types_1.CardTag.POKEMON_ex.toString(),
                    card_types_1.CardTag.POKEMON_V.toString(),
                    card_types_1.CardTag.POKEMON_VMAX.toString(),
                    card_types_1.CardTag.POKEMON_VSTAR.toString(),
                    card_types_1.CardTag.RADIANT.toString(),
                    card_types_1.CardTag.POKEMON_GX.toString(),
                    card_types_1.CardTag.PRISM_STAR.toString(),
                    card_types_1.CardTag.POKEMON_VUNION.toString()
                ].includes(t))));
        }
        case card_types_1.Format.RETRO:
            return card.set === 'BS' ||
                card.set === 'JU' ||
                card.set === 'FO' ||
                card.set === 'TR' ||
                card.set === 'G1' ||
                card.set === 'G2' ||
                card.set === 'SI' ||
                card.set === 'N1' ||
                card.set === 'N2' ||
                card.set === 'N3' ||
                card.set === 'N4' ||
                card.set === 'LC' ||
                card.set === 'EX' ||
                card.set === 'AQ' ||
                card.set === 'SK' ||
                card.set === 'PR';
        case card_types_1.Format.RSPK:
            return card.set === 'RS' ||
                card.set === 'SS' ||
                card.set === 'DR' ||
                card.set === 'MA' ||
                card.set === 'HL' ||
                card.set === 'RG' ||
                card.set === 'TRR' ||
                card.set === 'DX' ||
                card.set === 'EM' ||
                card.set === 'UF' ||
                card.set === 'DS' ||
                card.set === 'LM' ||
                card.set === 'HP' ||
                card.set === 'CG' ||
                card.set === 'DF' ||
                card.set === 'PK' ||
                card.set === 'P1' ||
                card.set === 'P2' ||
                card.set === 'P3' ||
                card.set === 'P4' ||
                card.set === 'P5' ||
                card.set === 'NP' ||
                card.set === 'MCVS' ||
                card.set === 'MAL' ||
                card.set === 'MSM' ||
                card.set === 'MSD' ||
                card.set === 'PCGP' ||
                card.set === 'PCGL';
        case card_types_1.Format.SWSH:
            return card.set === 'SWSH' ||
                card.set === 'SSH' ||
                card.set === 'RCL' ||
                card.set === 'DAA' ||
                card.set === 'CPA' ||
                card.set === 'VIV' ||
                card.set === 'SHF' ||
                card.set === 'BST' ||
                card.set === 'CRE' ||
                card.set === 'EVS' ||
                card.set === 'CEL' ||
                card.set === 'FST' ||
                card.set === 'BRS' ||
                card.set === 'ASR' ||
                card.set === 'PGO' ||
                card.set === 'LOR' ||
                card.set === 'SIT' ||
                card.set === 'CRZ';
        case card_types_1.Format.SM:
            return card.set === 'SUM' ||
                card.set === 'SMP' ||
                card.set === 'SM10a' ||
                card.set === 'GRI' ||
                card.set === 'BUS' ||
                card.set === 'SLG' ||
                card.set === 'CIN' ||
                card.set === 'UPR' ||
                card.set === 'FLI' ||
                card.set === 'CES' ||
                card.set === 'DRM' ||
                card.set === 'LOT' ||
                card.set === 'TEU' ||
                card.set === 'DET' ||
                card.set === 'UNB' ||
                card.set === 'UNM' ||
                card.set === 'HIF' ||
                card.set === 'CEC';
        case card_types_1.Format.XY:
            return card.set === 'XY' ||
                card.set === 'KSS' ||
                card.set === 'FLF' ||
                card.set === 'FFI' ||
                card.set === 'PHF' ||
                card.set === 'PRC' ||
                card.set === 'DCR' ||
                card.set === 'ROS' ||
                card.set === 'AOR' ||
                card.set === 'BKT' ||
                card.set === 'BKP' ||
                card.set === 'GEN' ||
                card.set === 'FCO' ||
                card.set === 'STS' ||
                card.set === 'EVO' ||
                card.set === 'XYP';
        case card_types_1.Format.BW:
            return card.set === 'BW' ||
                card.set === 'EPO' ||
                card.set === 'NVI' ||
                card.set === 'NXD' ||
                card.set === 'DEX' ||
                card.set === 'DRX' ||
                card.set === 'DRV' ||
                card.set === 'BCR' ||
                card.set === 'PLS' ||
                card.set === 'PLF' ||
                card.set === 'PLB' ||
                card.set === 'LTR' ||
                card.set === 'BWP';
        case card_types_1.Format.PRE_RELEASE:
            // Pre-Release format allows all cards (like UNLIMITED)
            return true;
    }
    return false;
}

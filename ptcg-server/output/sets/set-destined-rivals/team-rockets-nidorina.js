"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsNidorina = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useDarkAwakening(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    // Look through all known cards to find out if Pokemon can evolve
    const cm = game_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage !== card_types_1.Stage.BASIC;
    });
    // Build possible evolution card names
    const evolutionNames = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const valid = evolutions.filter(e => e.evolvesFrom === card.name && e.cardType === card_types_1.CardType.DARK);
        valid.forEach(c => {
            if (!evolutionNames.includes(c.name)) {
                evolutionNames.push(c.name);
            }
        });
    });
    // There is nothing that can evolve
    if (evolutionNames.length === 0) {
        return state;
    }
    const blocked2 = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        var _a;
        if (((_a = list.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) !== card_types_1.CardType.DARK) {
            blocked2.push(target);
        }
    });
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false, blocked: blocked2 }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        return state; // canceled by user
    }
    // Log the selected Pokémon targets
    const targetNames = targets.map(target => { var _a; return (_a = target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean);
    store.log(state, game_1.GameLog.LOG_TEXT, {
        text: `${player.name} chooses to evolve ${targetNames.join(' and ')}`
    });
    for (const target of targets) {
        const pokemonCard = target.getPokemonCard();
        if (pokemonCard === undefined) {
            return state; // invalid target?
        }
        // Blocking pokemon cards, that cannot be valid evolutions
        const blocked = [];
        player.deck.cards.forEach((card, index) => {
            if (card instanceof pokemon_card_1.PokemonCard && card.evolvesFrom !== pokemonCard.name) {
                blocked.push(index);
            }
        });
        let cards = [];
        yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
            cards = selected || [];
            next();
        });
        // Canceled by user, he didn't found the card in the deck
        if (cards.length === 0) {
            continue;
        }
        const evolution = cards[0];
        // Evolve Pokemon
        player.deck.moveCardTo(evolution, target);
        target.clearEffects();
        target.pokemonPlayedTurn = state.turn;
    }
    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
}
class TeamRocketsNidorina extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Rocket\'s Nidoran F';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dark Awakening',
                cost: [D],
                damage: 0,
                text: 'Choose up to 2 of your [D] Pokémon. For each of those Pokémon, search your deck for a card that evolves from that Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck.'
            },
            {
                name: 'Scratch',
                cost: [D, D],
                damage: 50,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '115';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Nidorina';
        this.fullName = 'Team Rocket\'s Nidorina DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useDarkAwakening(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TeamRocketsNidorina = TeamRocketsNidorina;

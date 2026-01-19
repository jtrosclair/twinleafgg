"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feebas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useAscension(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_1, evolvesFrom: 'Feebas' }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        // Evolve Pokemon
        player.deck.moveCardsTo(cards, player.active);
        player.active.clearEffects();
        player.active.pokemonPlayedTurn = state.turn;
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Feebas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tackle',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Ascension',
                cost: [W],
                damage: 0,
                text: 'Search your deck for a card that evolves from Feebas and put it on Feebas. (This counts as evolving Feebas.) Shuffle your deck afterward.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Feebas';
        this.fullName = 'Feebas HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const generator = useAscension(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Feebas = Feebas;

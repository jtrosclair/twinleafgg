"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weedle = void 0;
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weedle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.set = 'CPA';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'D';
        this.name = 'Weedle';
        this.fullName = 'Weedle CPA';
        this.attacks = [
            {
                name: 'Call for Family',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Basic Pokemon and put it onto your Bench. Then, shuffle your deck. '
            },
        ];
    }
    reduceEffect(store, state, effect) {
        // Call for Family
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: true });
        }
        return state;
    }
}
exports.Weedle = Weedle;

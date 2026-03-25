"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kangaskhan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kangaskhan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Comet Punch',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kangaskhan';
        this.fullName = 'Kangaskhan PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, { stage: card_types_1.Stage.BASIC }, { max: 2 });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 4, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 20 * heads;
            });
        }
        return state;
    }
}
exports.Kangaskhan = Kangaskhan;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axew = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Axew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 50;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Strong Bond',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Supporter card named Iris, reveal it, and put it into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Dragon Claw',
                cost: [F, M],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Axew';
        this.fullName = 'Axew PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { name: 'Iris' }, { min: 0, max: 1, allowCancel: false });
        }
        return state;
    }
}
exports.Axew = Axew;

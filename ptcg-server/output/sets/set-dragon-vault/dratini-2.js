"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dratini2 = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Dratini2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 40;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Hypnotic Gaze',
                cost: [G],
                damage: 0,
                text: 'The Defending Pok\u00e9mon is now Asleep.'
            },
            {
                name: 'Tail Whap',
                cost: [L],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'DRV';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dratini';
        this.fullName = 'Dratini DRV 2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Dratini2 = Dratini2;

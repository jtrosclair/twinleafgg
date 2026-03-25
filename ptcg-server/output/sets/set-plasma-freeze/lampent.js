"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lampent = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Lampent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Litwick';
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Live Coal',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Searing Flame',
                cost: [R, C, C],
                damage: 40,
                text: 'The Defending Pokémon is now Burned.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '15';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lampent';
        this.fullName = 'Lampent PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Lampent = Lampent;

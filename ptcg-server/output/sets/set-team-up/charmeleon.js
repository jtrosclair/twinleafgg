"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmeleon = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Charmeleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charmander';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Fire Fang',
                cost: [R, R],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Charmeleon';
        this.fullName = 'Charmeleon TEU';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Charmeleon = Charmeleon;

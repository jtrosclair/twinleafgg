"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Darmanitan = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Darmanitan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Darumaka';
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Rock Smash',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            },
            {
                name: 'Fire Punch',
                cost: [R, R, C, C],
                damage: 70,
                text: 'The Defending Pokémon is now Burned.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Darmanitan';
        this.fullName = 'Darmanitan EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Darmanitan = Darmanitan;

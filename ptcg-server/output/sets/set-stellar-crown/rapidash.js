"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rapidash = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Rapidash extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ponyta';
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Burning Run',
                cost: [R, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 60 more damage.'
            }];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Rapidash';
        this.fullName = 'Rapidash SCR';
        this.regulationMark = 'H';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 60);
        }
        return state;
    }
}
exports.Rapidash = Rapidash;

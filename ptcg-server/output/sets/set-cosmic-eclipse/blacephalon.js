"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blacephalon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Blacephalon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ULTRA_BEAST];
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Fireworks Bomb',
                cost: [P, C],
                damage: 0,
                text: 'Put 4 damage counters on your opponent\'s Pokemon in any way you like. If your opponent has exactly 3 Prize cards remaining, put 12 damage counters on them instead.'
            }];
        this.set = 'CEC';
        this.name = 'Blacephalon';
        this.fullName = 'Blacephalon CEC';
        this.setNumber = '104';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            let counters = 4;
            const prizes = (0, prefabs_1.GET_PLAYER_PRIZES)(effect.opponent).length;
            if (prizes === 3) {
                counters = 12;
            }
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(counters, store, state, effect);
        }
        return state;
    }
}
exports.Blacephalon = Blacephalon;

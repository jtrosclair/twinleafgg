"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dratini = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Dratini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Dragon Song',
                cost: [C],
                damage: 0,
                text: 'Each Defending Pokémon is now Asleep.'
            },
            {
                name: 'Tail Strike',
                cost: [W, L],
                damage: 20,
                damageCaclulation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
            }];
        this.set = 'TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Dratini';
        this.fullName = 'Dratini TRR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Dratini = Dratini;

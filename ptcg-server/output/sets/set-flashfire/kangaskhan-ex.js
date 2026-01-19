"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KangaskhanEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class KangaskhanEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = C;
        this.hp = 180;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Triple Draw',
                cost: [C],
                damage: 0,
                text: 'Draw 3 cards.'
            },
            {
                name: 'Kindred Kick',
                cost: [C, C, C],
                damage: 70,
                damageCalculator: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }];
        this.set = 'FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Kangaskhan-EX';
        this.fullName = 'Kangaskhan-EX FLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 3);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 30);
        }
        return state;
    }
}
exports.KangaskhanEX = KangaskhanEX;

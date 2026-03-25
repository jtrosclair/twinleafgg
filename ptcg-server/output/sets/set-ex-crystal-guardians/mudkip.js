"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mudkip = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mudkip extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Submerge',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Mudkip is on your Bench, prevent all damage done to Mudkip by attacks (both yours and your opponent\'s).'
            }];
        this.attacks = [{
                name: 'Mud Slap',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'CG';
        this.name = 'Mudkip';
        this.fullName = 'Mudkip CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Target is this Mudkip
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Mudkip = Mudkip;

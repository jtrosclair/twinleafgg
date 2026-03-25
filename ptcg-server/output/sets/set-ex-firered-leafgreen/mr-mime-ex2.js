"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrMimeex2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class MrMimeex2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 80;
        this.retreat = [C];
        this.powers = [{
                name: 'Magic Odds',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'If Mr. Mime ex would be damaged by an attack, prevent that attack’s damage done to Mr. Mime ex if that damage is 20, 40, 60, 80, 100, 120, 140, 160, or 180.'
            }];
        this.attacks = [{
                name: 'Breakdown',
                cost: [P, C],
                damage: 0,
                text: 'Count the number of cards in your opponent\'s hand. Put that many damage counters on the Defending Pokémon.'
            }];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Mr. Mime ex';
        this.fullName = 'Mr. Mime ex RG 111';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this) {
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            // Prevent all damage if damage is an odd multiple of 10 between 10 and 250 (inclusive)
            if (effect.damage % 20 === 0 &&
                effect.damage >= 20 &&
                effect.damage <= 180) {
                effect.preventDefault = true;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_2.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON)(effect.opponent.hand.cards.length, store, state, effect);
        }
        return state;
    }
}
exports.MrMimeex2 = MrMimeex2;

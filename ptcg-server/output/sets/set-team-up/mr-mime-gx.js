"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrMimeGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
class MrMimeGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = P;
        this.hp = 150;
        this.retreat = [C, C];
        this.powers = [{
                name: 'Magic Odds',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokémon by your opponent\'s attacks if that damage is exactly 10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, or 250.'
            }];
        this.attacks = [{
                name: 'Breakdown',
                cost: [P, C],
                damage: 0,
                text: 'For each card in your opponent\'s hand, put 1 damage counter on their Active Pokémon.'
            },
            {
                name: 'Life Trick-GX',
                cost: [C],
                damage: 0,
                text: 'Heal all damage from this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Mr. Mime-GX';
        this.fullName = 'Mr. Mime-GX TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this) {
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            // Prevent all damage if damage is an odd multiple of 10 between 10 and 250 (inclusive)
            if (effect.damage % 20 === 10 &&
                effect.damage >= 10 &&
                effect.damage <= 250) {
                effect.preventDefault = true;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_2.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON)(effect.opponent.hand.cards.length, store, state, effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.player.usedGX) {
                throw new game_1.GameError(game_message_1.GameMessage.LABEL_GX_USED);
            }
            effect.player.usedGX = true;
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, effect.player.active.damage);
        }
        return state;
    }
}
exports.MrMimeGX = MrMimeGX;

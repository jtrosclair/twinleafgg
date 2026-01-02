"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yanmega = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Yanmega extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yanma';
        this.tags = [card_types_1.CardTag.PRIME];
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Insight',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If you have the same number of cards in your hand as your opponent the attack cost of each of Yanmega\'s attacks is 0.',
            }];
        this.attacks = [{
                name: 'Linear Attack',
                cost: [G, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 40 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Sonic Boom',
                cost: [G, G, C],
                damage: 70,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }];
        this.set = 'TM';
        this.setNumber = '98';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Yanmega';
        this.fullName = 'Yanmega TM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && (effect.attack === this.attacks[0] || effect.attack === this.attacks[1])) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            if (player.hand.cards.length === opponent.hand.cards.length) {
                effect.cost = [];
            }
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(40, effect, store, state);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
        }
        return state;
    }
}
exports.Yanmega = Yanmega;

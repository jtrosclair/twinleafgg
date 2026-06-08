"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ampharos = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ampharos extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Flaaffy';
        this.hp = 160;
        this.cardType = L;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Synchronized Pulse',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you and your opponent have the same number of cards in your hands, this Pokemon\'s attacks do 80 more damage to your opponent\'s Active Pokemon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Flash Bolt',
                cost: [L, C],
                damage: 140,
                text: 'During your next turn, this Pokemon can\'t use Flash Bolt.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.usSetNumber = 'POR 29';
        this.name = 'Ampharos';
        this.fullName = 'Ampharos M4';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.getPokemonCard() === this) {
            const player = game_1.StateUtils.findOwner(state, effect.source);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (effect.target === opponent.active && player.hand.cards.length === opponent.hand.cards.length) {
                effect.damage += 80;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.player.active.cannotUseAttacksNextTurnPending.push('Flash Bolt');
        }
        return state;
    }
}
exports.Ampharos = Ampharos;

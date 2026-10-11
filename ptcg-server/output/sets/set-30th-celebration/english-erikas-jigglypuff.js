"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnglishErikasJigglypuffCC4 = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// Printed English text: https://limitlesstcg.com/cards/30C/CC4
class EnglishErikasJigglypuffCC4 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 50;
        this.cardType = game_1.CardType.COLORLESS;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.resistance = [{ type: game_1.CardType.PSYCHIC, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.set = '30C';
        this.setNumber = 'CC4';
        this.usSetNumber = '30C CC4';
        this.name = "Erika's Jigglypuff";
        this.fullName = "Erika's Jigglypuff 30C CC4";
        this.cardImage = 'assets/cardback.png';
        this.attacks = [{
                name: 'Group Therapy', cost: [game_1.CardType.COLORLESS], damage: 0,
                text: 'You and your opponent remove 1 damage counter from each of your Pokémon with damage counters on them.'
            }, {
                name: 'Pulled Punch', cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS], damage: 40, damageCalculation: '-',
                text: 'If the Defending Pokémon has no damage counters on it, this attack does 40 damage. If it has any damage counters on it, this attack does 10 damage.'
            }];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            for (const player of [effect.player, effect.opponent]) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, target => {
                    if (target.damage > 0) {
                        store.reduceEffect(state, new game_effects_1.HealEffect(player, target, 10));
                    }
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.damage = effect.opponent.active.damage === 0 ? 40 : 10;
        }
        return state;
    }
}
exports.EnglishErikasJigglypuffCC4 = EnglishErikasJigglypuffCC4;

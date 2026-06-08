"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garbodor = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_1 = require("../../game/store/state/state");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Garbodor extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Trubbish';
        this.hp = 140;
        this.cardType = D;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Garbage Downer',
                powerType: game_1.PowerType.ABILITY,
                text: 'If your opponent\'s Active Pokemon has any Pokemon Tool attached, its attacks do 20 less damage (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Sludge Bomb',
                cost: [D, D, C],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.usSetNumber = 'CRI 57';
        this.name = 'Garbodor';
        this.fullName = 'Garbodor M4';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.damage > 0 && state.phase === state_1.GamePhase.ATTACK) {
            const targetOwner = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetOwner, this)) {
                return state;
            }
            let hasGarbodor = false;
            targetOwner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this)
                    hasGarbodor = true;
            });
            game_1.StateUtils.getOpponent(state, targetOwner).forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this)
                    hasGarbodor = true;
            });
            if (!hasGarbodor)
                return state;
            const attackerHasTool = effect.source.tools.length > 0;
            if (attackerHasTool) {
                effect.damage = Math.max(0, effect.damage - 20);
            }
        }
        return state;
    }
}
exports.Garbodor = Garbodor;

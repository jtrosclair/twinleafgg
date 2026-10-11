"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu46 = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #46 — Get Some Air + Smash Kick */
class Pikachu46 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Get Some Air',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'This Pokémon recovers from all Special Conditions.'
            },
            {
                name: 'Smash Kick',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 46';
    }
    reduceEffect(store, state, effect) {
        // Get Some Air
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const removeSpecialCondition = new attack_effects_1.RemoveSpecialConditionsEffect(effect, undefined);
            removeSpecialCondition.target = effect.player.active;
            state = store.reduceEffect(state, removeSpecialCondition);
        }
        return state;
    }
}
exports.Pikachu46 = Pikachu46;

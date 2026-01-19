"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lotad = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lotad extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Rain Dish',
                powerType: game_1.PowerType.POKEBODY,
                text: 'At any time between turns, remove 1 damage counter from Lotad.'
            }];
        this.attacks = [{
                name: 'Ram',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'SS';
        this.setNumber = '66';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lotad';
        this.fullName = 'Lotad SS';
    }
    reduceEffect(store, state, effect) {
        // Handle Healing Stone Poké-Body
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.ANY, cardList => {
                if (cardList.getPokemonCard() === this) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                    state = store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Lotad = Lotad;

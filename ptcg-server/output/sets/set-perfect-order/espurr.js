"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espurr = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Espurr extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Nap',
                cost: [C],
                damage: 0,
                text: 'Heal 20 damage from this Pokemon.'
            },
            {
                name: 'Stampede',
                cost: [P],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Espurr';
        this.fullName = 'Espurr M3';
    }
    reduceEffect(store, state, effect) {
        // Nap - heal 20 damage from this Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, player.active, 20);
            store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Espurr = Espurr;

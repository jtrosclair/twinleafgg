"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tynamo = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Tynamo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [{
                name: 'Hold Still',
                cost: [C],
                damage: 0,
                text: 'Heal 10 damage from this Pokémon'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tynamo';
        this.fullName = 'Tynamo SV11B';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const healEffect = new attack_effects_1.HealTargetEffect(effect, 10);
            healEffect.target = effect.player.active;
            store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Tynamo = Tynamo;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pignite = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pignite extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tepig';
        this.cardType = R;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Super Singe',
                cost: [R, R, C],
                damage: 70,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Pignite';
        this.fullName = 'Pignite MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.BURNED]);
            specialConditionEffect.target = opponent.active;
            return store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Pignite = Pignite;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasGloom = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ErikasGloom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.tags = [game_1.CardTag.ERIKAS];
        this.evolvesFrom = 'Erika\'s Oddish';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Poison Spray',
                cost: [G, C],
                damage: 50,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Erika\'s Gloom';
        this.fullName = 'Erika\'s Gloom MC';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.POISONED]);
            specialConditionEffect.target = opponent.active;
            return store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.ErikasGloom = ErikasGloom;

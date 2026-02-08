"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarrysBraviary = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const effect_of_attack_effects_1 = require("../../game/store/effects/effect-of-attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LarrysBraviary extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Larry\'s Rufflet';
        this.tags = [game_1.CardTag.LARRYS];
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Clutch',
                cost: [C, C],
                damage: 50,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            },
            {
                name: 'Brave Bird',
                cost: [C, C, C],
                damage: 120,
                text: 'This Pokémon also does 30 damage to itself.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '174';
        this.name = 'Larry\'s Braviary';
        this.fullName = 'Larry\'s Braviary MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const preventRetreat = new effect_of_attack_effects_1.PreventRetreatEffect(effect);
            preventRetreat.markerSource = this;
            preventRetreat.applyEffect();
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.LarrysBraviary = LarrysBraviary;

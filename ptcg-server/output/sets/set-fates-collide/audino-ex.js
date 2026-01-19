"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudinoEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class AudinoEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 180;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Drain Slap',
                cost: [C],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.'
            }, {
                name: 'Do the Wave',
                cost: [C, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each of your Benched Pokémon.'
            },
        ];
        this.set = 'FCO';
        this.name = 'Audino-EX';
        this.fullName = 'Audino EX FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
    }
    reduceEffect(store, state, effect) {
        // Drain Slap
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 20);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
        }
        // Do the Wave
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            effect.damage += playerBench * 10;
        }
        return state;
    }
}
exports.AudinoEx = AudinoEx;

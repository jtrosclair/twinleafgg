"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conkeldurr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Conkeldurr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gurdurr';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Stone Edge',
                cost: [F, F, C],
                damage: 80,
                text: 'Flip a coin. If tails, this attack does nothing.'
            },
            {
                name: 'Swing Around',
                cost: [F, F, C, C],
                damage: 100,
                text: 'Does 40 damage to each Benched Pokémon (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Conkeldurr';
        this.fullName = 'Conkeldurr BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Damage all opponent's benched Pokémon
            opponent.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 40);
                    damageEffect.target = benchSlot;
                    store.reduceEffect(state, damageEffect);
                }
            });
            // Damage all your own benched Pokémon
            player.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 40);
                    damageEffect.target = benchSlot;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Conkeldurr = Conkeldurr;

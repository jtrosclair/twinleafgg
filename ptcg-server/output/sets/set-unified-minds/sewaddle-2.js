"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sewaddle2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sewaddle2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Swaddling Leaves',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon takes 10 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Surprise Attack',
                cost: [G],
                damage: 20,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sewaddle';
        this.fullName = 'Sewaddle UNM 7';
    }
    reduceEffect(store, state, effect) {
        // Ability: Swaddling Leaves (passive - reduce damage)
        // Ref: set-unified-minds/sewaddle.ts (Swaddling Leaves)
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 10);
        }
        // Attack 1: Surprise Attack
        // Ref: set-unified-minds/sewaddle.ts (Surprise Attack)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Sewaddle2 = Sewaddle2;

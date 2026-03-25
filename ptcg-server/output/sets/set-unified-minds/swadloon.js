"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swadloon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Swadloon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sewaddle';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Swaddling Leaves',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Bug Bite',
                cost: [C],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '8';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Swadloon';
        this.fullName = 'Swadloon UNM';
    }
    reduceEffect(store, state, effect) {
        // Ability: Swaddling Leaves (passive - reduce damage by 30)
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
            effect.damage = Math.max(0, effect.damage - 30);
        }
        return state;
    }
}
exports.Swadloon = Swadloon;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnemite2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magnemite2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Solid Unit',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is on your Bench, prevent all damage done to this Pokémon by attacks (both yours and your opponent\'s).'
            }];
        this.attacks = [
            {
                name: 'Ram',
                cost: [M, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '81';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magnemite';
        this.fullName = 'Magnemite UPR 81';
    }
    reduceEffect(store, state, effect) {
        // Ability: Solid Unit (passive - prevent all damage on bench)
        // Ref: set-crimson-invasion/regice.ts (Iceberg Shield - AbstractAttackEffect prevention)
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Only works on bench
            if (player.active === effect.target) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.preventDefault = true;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Only works on bench
            if (player.active === effect.target) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Magnemite2 = Magnemite2;

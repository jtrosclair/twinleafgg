"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tangrowth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Tangrowth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tangela';
        this.cardType = G;
        this.hp = 150;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Thicket Body',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'This Pokemon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Loom Over',
                cost: [G, C, C],
                damage: 150,
                damageCalculation: '-',
                text: 'This attack does 10 less damage for each damage counter on this Pokémon.'
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Tangrowth';
        this.fullName = 'Tangrowth TWM';
    }
    reduceEffect(store, state, effect) {
        // Bouffer: reduce damage taken by 30 after Weakness/Resistance
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            // It's not this pokemon card
            if (pokemonCard !== this) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 30);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage -= effect.player.active.damage;
            return state;
        }
        return state;
    }
}
exports.Tangrowth = Tangrowth;

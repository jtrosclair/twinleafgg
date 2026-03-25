"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shuckle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shuckle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Extra-tight',
                useWhenInPlay: false,
                powerType: game_1.PowerType.POKEBODY,
                text: 'Prevent all damage done to Shuckle by attacks from your opponent\'s Pokémon-ex.'
            }];
        this.attacks = [{
                name: 'Toxic',
                cost: [G, C],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between turns.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Shuckle';
        this.fullName = 'Shuckle UF';
    }
    reduceEffect(store, state, effect) {
        // Mysterious Stone House
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined) {
                return state;
            }
            // Do not ignore self-damage from Pokemon-Ex
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            if (sourceCard.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                }
                catch (_a) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        // Toxic
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            addSpecialCondition.poisonDamage = 20; // 2 damage counters = 20 damage
            store.reduceEffect(state, addSpecialCondition);
        }
        return state;
    }
}
exports.Shuckle = Shuckle;

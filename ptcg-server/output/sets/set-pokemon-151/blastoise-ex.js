"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blastoiseex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Blastoiseex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Wartortle';
        this.cardType = W;
        this.hp = 330;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Solid Shell',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Twin Cannons',
                cost: [W, W],
                damage: 140,
                damageCalculation: 'x',
                text: 'Discard up to 2 Basic [W] Energies from your hand. This attack does 140 damage for each card you discarded in this way.'
            }];
        this.regulationMark = 'G';
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Blastoise ex';
        this.fullName = 'Blastoise ex MEW';
    }
    // Implement power
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY;
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 2 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const damage = cards.length * 140;
                effect.damage = damage;
                player.hand.moveCardsTo(cards, player.discard);
                return state;
            });
        }
        // Reduce damage by 30
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
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 30);
        }
        return state;
    }
}
exports.Blastoiseex = Blastoiseex;

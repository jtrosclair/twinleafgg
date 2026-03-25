"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vileplume = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vileplume extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gloom';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 140;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fully Blooming Energy',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may look at the top 8 cards of your deck and attach any number of Basic Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
            }];
        this.attacks = [{
                name: 'Solar Beam',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Vileplume';
        this.fullName = 'Vileplume MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Legacy implementation:
            // - Pulled top 8 cards into a temporary CardList.
            // - Attached any Basic Energy among them to your Pokémon.
            // - Shuffled the remaining cards back into the deck.
            //
            // Converted to prefab version (LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY).
            return (0, prefabs_1.LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY)(store, state, player, 8, 8, {
                energyFilter: { energyType: game_1.EnergyType.BASIC },
                remainderDestination: 'shuffle'
            });
        }
        return state;
    }
}
exports.Vileplume = Vileplume;

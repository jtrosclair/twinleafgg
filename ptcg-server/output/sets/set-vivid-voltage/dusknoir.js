"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dusknoir = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dusknoir extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dusclops';
        this.cardType = P;
        this.hp = 150;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Spooky Shot',
                cost: [P, C, C],
                damage: 120,
                text: ''
            }
        ];
        this.power = [
            {
                name: 'Spectral Breach',
                powerType: game_1.PowerType.ABILITY,
                text: 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide [C] Energy and have no other effect.'
            }
        ];
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Dusknoir';
        this.fullName = 'Dusknoir VIV';
    }
    reduceEffect(store, state, effect) {
        // Negate special energy effect when it is attached to a Pokemon
        if (effect instanceof game_effects_1.SpecialEnergyEffect) {
            // Check if this Dusknoir is in play
            const dusknoirCardList = game_1.StateUtils.findCardList(state, this);
            const dusknoirOwner = game_1.StateUtils.findOwner(state, dusknoirCardList);
            if (game_1.StateUtils.isPokemonInPlay(dusknoirOwner, this)) {
                // Handle special exceptions (e.g. Fusion Strike Energy)
                const energyOwner = game_1.StateUtils.findOwner(state, effect.attachedTo);
                if (effect.exemptFromOpponentsSpecialEnergyBlockingAbility && dusknoirOwner !== energyOwner) {
                    return state;
                }
                // Return if ability is blocked
                if (prefabs_1.IS_ABILITY_BLOCKED(store, state, dusknoirOwner, this)) {
                    return state;
                }
                // Check if effect of ability is prevented
                const canApplyAbility = new game_effects_1.EffectOfAbilityEffect(dusknoirOwner, this.powers[0], this, effect.attachedTo);
                store.reduceEffect(state, canApplyAbility);
                // Block the effect of the special energy if the effect is allowed
                if (canApplyAbility.target) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                }
            }
        }
        // Special energies provide [C]
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
            // Check if this Dusknoir is in play
            const dusknoirCardList = game_1.StateUtils.findCardList(state, this);
            const dusknoirOwner = game_1.StateUtils.findOwner(state, dusknoirCardList);
            if (game_1.StateUtils.isPokemonInPlay(dusknoirOwner, this)) {
                // Return if ability is blocked
                if (prefabs_1.IS_ABILITY_BLOCKED(store, state, dusknoirOwner, this)) {
                    return state;
                }
                // Check if effect of ability is prevented
                const canApplyAbility = new game_effects_1.EffectOfAbilityEffect(dusknoirOwner, this.powers[0], this, effect.source);
                store.reduceEffect(state, canApplyAbility);
                // Make special energies provide [C]
                if (canApplyAbility.target) {
                    effect.specialEnergiesProvideColorless = true;
                }
            }
        }
        return state;
    }
}
exports.Dusknoir = Dusknoir;

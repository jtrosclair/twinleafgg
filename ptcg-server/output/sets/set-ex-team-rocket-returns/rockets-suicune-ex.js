"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsSuicuneex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class RocketsSuicuneex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.ROCKETS];
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dark and Clear',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Rocket\'s Suicune ex has any [D] Energy attached to it, Rocket\'s Suicune ex can\'t be affected by any Special Conditions.'
            }];
        this.attacks = [{
                name: 'Icy Wind',
                cost: [C],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Hyper Splash',
                cost: [W, W, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is a Stage 2 Evolved Pokémon, this attack does 50 damage plus 40 more damage.'
            }];
        this.set = 'TRR';
        this.name = 'Rocket\'s Suicune ex';
        this.fullName = 'Rocket\'s Suicune ex TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
    }
    reduceEffect(store, state, effect) {
        // Dark and Clear
        if (effect instanceof attack_effects_2.AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(effect.player, effect.target);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyMap = checkProvidedEnergyEffect.energyMap;
            const hasDarkEnergy = game_1.StateUtils.checkEnoughEnergy(energyMap, [game_1.CardType.DARK]);
            if (hasDarkEnergy) {
                effect.preventDefault = true;
            }
        }
        // Icy Wind
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        }
        // Hyper Splash
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (effect.opponent.active.isStage(game_1.Stage.STAGE_2) && effect.opponent.active.getPokemons.length > 1) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.RocketsSuicuneex = RocketsSuicuneex;

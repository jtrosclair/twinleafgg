"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsSuicuneex = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class RocketsSuicuneex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ROCKETS];
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
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(effect.player, effect.target);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyMap = checkProvidedEnergyEffect.energyMap;
            const hasDarkEnergy = state_utils_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.DARK]);
            if (hasDarkEnergy) {
                effect.preventDefault = true;
            }
        }
        // Icy Wind
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Hyper Splash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.opponent.active.isStage(card_types_1.Stage.STAGE_2) && effect.opponent.active.getPokemons.length > 1) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.RocketsSuicuneex = RocketsSuicuneex;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MVenusaurEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MVenusaurEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA,];
        this.stage = card_types_1.Stage.MEGA;
        this.evolvesFrom = 'Venusaur-EX';
        this.cardType = G;
        this.hp = 230;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Crisis Vine',
                cost: [G, G, G, C],
                damage: 120,
                text: 'Your opponent\'s Active Pokémon is now Paralyzed and Poisoned.'
            }];
        this.set = 'XY';
        this.name = 'M Venusaur-EX';
        this.fullName = 'M Venusaur-EX XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
    }
    reduceEffect(store, state, effect) {
        // wow i hate the rules
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Venusaur Spirit Link') {
                return state;
            }
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(effect.player);
            store.reduceEffect(state, endTurnEffect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED, card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.MVenusaurEX = MVenusaurEX;

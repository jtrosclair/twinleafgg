"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MRayquazaEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class MRayquazaEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA];
        this.stage = card_types_1.Stage.MEGA;
        this.evolvesFrom = 'Rayquaza-EX';
        this.cardType = C;
        this.hp = 220;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Mega Evolution Rule',
                powerType: game_1.PowerType.MEGA_EVOLUTION_RULE,
                text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
            },
            {
                name: 'Δ Evolution',
                powerType: game_1.PowerType.ANCIENT_TRAIT,
                text: 'You may play this card from your hand to evolve a Pokémon during your first turn or the turn you play that Pokémon.'
            },
        ];
        this.attacks = [
            {
                name: 'Emerald Break',
                cost: [C, C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage times the number of your Benched Pokémon.'
            }
        ];
        this.set = 'ROS';
        this.name = 'M Rayquaza-EX';
        this.fullName = 'M Rayquaza-EX ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
    }
    reduceEffect(store, state, effect) {
        // love me some funny evolution crap, especially when they CHEAT
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            // maybe this will allow the ancient trait to go through
            effect.player.canEvolve = true;
            effect.target.pokemonPlayedTurn = state.turn - 1;
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Rayquaza Spirit Link') {
                return state;
            }
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(effect.player);
            store.reduceEffect(state, endTurnEffect);
        }
        // Emerald Break
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            effect.damage = playerBench * 30;
        }
        return state;
    }
}
exports.MRayquazaEx = MRayquazaEx;

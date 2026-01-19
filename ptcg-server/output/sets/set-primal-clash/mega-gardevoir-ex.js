"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MGardevoirEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MGardevoirEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA];
        this.stage = card_types_1.Stage.MEGA;
        this.evolvesFrom = 'Gardevoir-EX';
        this.cardType = Y;
        this.hp = 210;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Mega Evolution Rule',
                powerType: game_1.PowerType.MEGA_EVOLUTION_RULE,
                text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
            }
        ];
        this.attacks = [
            {
                name: 'Brilliant Arrow',
                cost: [Y, C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage times the amount of [Y] Energy attached to all of your Pokémon.'
            }
        ];
        this.set = 'PRC';
        this.name = 'M Gardevoir-EX';
        this.fullName = 'M Gardevoir-EX PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
    }
    reduceEffect(store, state, effect) {
        // screw the rules
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Gardevoir Spirit Link') {
                return state;
            }
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(effect.player);
            store.reduceEffect(state, endTurnEffect);
        }
        // Brilliant Arrow
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let fairyEnergies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                const goodEnergy = card.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Fairy Energy');
                fairyEnergies += goodEnergy.length;
            });
            effect.damage = fairyEnergies * 30;
        }
        return state;
    }
}
exports.MGardevoirEx = MGardevoirEx;

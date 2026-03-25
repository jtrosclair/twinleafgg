"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanilluxe = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vanilluxe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vanillish';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Slippery Soles',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may switch your Active Pokémon with 1 of your Benched Pokémon. If you do, your opponent switches his or her Active Pokémon with 1 of his or her Benched Pokémon.'
            }];
        this.attacks = [{
                name: 'Crushing Ice',
                cost: [W, C, C],
                damage: 60,
                text: 'Does 10 more damage for each Colorless in the Defending Pokémon\'s Retreat Cost.'
            }];
        this.set = 'NXD';
        this.setNumber = '33';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vanilluxe';
        this.fullName = 'Vanilluxe NXD';
        this.SLIPPERY_SOLES_MARKER = 'SLIPPERY_SOLES_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Slippery Soles - switch both actives
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.SLIPPERY_SOLES_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Check if player has benched Pokémon
            const playerHasBench = player.bench.some(b => b.cards.length > 0);
            if (!playerHasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if opponent has benched Pokémon
            const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!opponentHasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.marker.addMarker(this.SLIPPERY_SOLES_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            // First, switch player's active
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            // Then, switch opponent's active
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
        }
        // Crushing Ice - bonus damage for retreat cost
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const defending = opponent.active.getPokemonCard();
            if (defending) {
                const retreatCost = defending.retreat.length;
                effect.damage += retreatCost * 10;
            }
        }
        // Clean up marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.SLIPPERY_SOLES_MARKER, this);
        }
        return state;
    }
}
exports.Vanilluxe = Vanilluxe;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frosmoth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Frosmoth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snom';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Inviting Wings',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokemon is in your Active Spot, you may use this Ability. Each player draws a card.'
            }];
        this.attacks = [{
                name: 'Cold Cyclone',
                cost: [W, W],
                damage: 90,
                text: 'Move a [W] Energy from this Pokemon to 1 of your Benched Pokemon.'
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Frosmoth';
        this.fullName = 'Frosmoth M2a';
        this.INVITING_WINGS_MARKER = 'INVITING_WINGS_MARKER';
        this.COLD_CYCLONE_MARKER = 'COLD_CYCLONE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Reset marker when Pokemon is played
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.INVITING_WINGS_MARKER, this);
        }
        // Reset marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.INVITING_WINGS_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.INVITING_WINGS_MARKER, this);
        }
        // Inviting Wings ability
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            // Check if Pokemon is in active spot
            if (pokemonCard !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if ability was already used this turn
            if (player.marker.hasMarker(this.INVITING_WINGS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Check if decks have cards to draw
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0 && opponent.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Draw cards for both players
            if (player.deck.cards.length > 0) {
                prefabs_1.DRAW_CARDS(player, 1);
            }
            if (opponent.deck.cards.length > 0) {
                prefabs_1.DRAW_CARDS(opponent, 1);
            }
            // Mark ability as used
            player.marker.addMarker(this.INVITING_WINGS_MARKER, this);
            // Add visual effect
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            prefabs_1.ADD_MARKER(this.COLD_CYCLONE_MARKER, effect.player, this);
            return state;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && prefabs_1.HAS_MARKER(this.COLD_CYCLONE_MARKER, effect.player, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            // Valid Water energy types
            const validTypes = [card_types_1.CardType.WATER, card_types_1.CardType.ANY];
            // Then prompt for energy movement
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1, validCardTypes: validTypes }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.COLD_CYCLONE_MARKER, this);
        return state;
    }
}
exports.Frosmoth = Frosmoth;

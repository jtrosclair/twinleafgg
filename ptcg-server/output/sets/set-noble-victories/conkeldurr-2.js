"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conkeldurr2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Conkeldurr2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gurdurr';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Top Down',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may search your discard pile for a Stadium card, show it to your opponent, and put it on top of your deck.'
            }];
        this.attacks = [{
                name: 'Chip Away',
                cost: [F, C, C, C],
                damage: 80,
                text: 'Flip a coin until you get tails. For each heads, discard the top card of your opponent\'s deck.'
            }];
        this.set = 'NVI';
        this.setNumber = '64';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Conkeldurr';
        this.fullName = 'Conkeldurr NVI 64';
        this.TOP_DOWN_MARKER = 'TOP_DOWN_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Reset marker when Pokémon is played
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.TOP_DOWN_MARKER, this);
        }
        // Top Down ability
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.TOP_DOWN_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Check for Stadium cards in discard
            const stadiumCards = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM);
            if (stadiumCards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.marker.addMarker(this.TOP_DOWN_MARKER, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.STADIUM }, { min: 1, max: 1, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, selected);
                    // Put on top of deck
                    player.discard.moveCardTo(selected[0], player.deck);
                }
            });
        }
        // Clear marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.TOP_DOWN_MARKER, this);
        }
        // Chip Away attack - flip until tails, discard cards from opponent's deck for each heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const sequenceEffect = new play_card_effects_1.CoinFlipSequenceEffect(player, 'untilTails', (results) => {
                for (const isHeads of results) {
                    if (isHeads && opponent.deck.cards.length > 0) {
                        opponent.deck.moveTo(opponent.discard, 1);
                    }
                }
            });
            return store.reduceEffect(state, sequenceEffect);
        }
        return state;
    }
}
exports.Conkeldurr2 = Conkeldurr2;

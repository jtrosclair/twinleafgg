"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreamTailex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ScreamTailex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.ANCIENT];
        this.regulationMark = 'H';
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 190;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Scream',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'You can use this attack only if you go second, and only during your first turn. During your opponent\'s next turn, they can\'t play any Supporter cards from their hand.'
            },
            {
                name: 'Crunch',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 120,
                text: 'Discard an Energy from your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Scream Tail ex';
        this.fullName = 'Scream Tail ex TWM';
        this.SUDDEN_SHRIEK_MARKER = 'SUDDEN_SHRIEK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            // Get current turn
            const turn = state.turn;
            // Check if it is player's first turn
            if (turn !== 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            else {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                opponent.marker.addMarker(this.SUDDEN_SHRIEK_MARKER, this);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Defending Pokemon has no energy cards attached
            if (!opponent.active.cards.some(c => c.superType === game_1.SuperType.ENERGY)) {
                return state;
            }
            let card;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                card = selected[0];
                return store.reduceEffect(state, new attack_effects_1.DiscardCardsEffect(effect, [card]));
            });
        }
        if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.marker.hasMarker(this.SUDDEN_SHRIEK_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SUDDEN_SHRIEK_MARKER, this)) {
            effect.player.marker.removeMarker(this.SUDDEN_SHRIEK_MARKER, this);
        }
        return state;
    }
}
exports.ScreamTailex = ScreamTailex;

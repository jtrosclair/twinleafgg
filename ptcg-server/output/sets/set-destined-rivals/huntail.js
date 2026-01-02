"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Huntail = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Huntail extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Clamperl';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Diver Catch',
                powerType: game_1.PowerType.ABILITY,
                text: 'You may use this Ability whenever 1 of your [W] Pokémon is Knocked Out by damage from an opponent\'s Pokémon\'s attack. Return all Basic [W] Energy attached to the Knocked Out Pokémon to your hand instead of discarding them.'
            }
        ];
        this.attacks = [{
                name: 'Wave Splash',
                cost: [W, C, C],
                damage: 80,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Huntail';
        this.fullName = 'Huntail DRI';
        this.DIVER_CATCH_MARKER = 'DIVER_CATCH_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Diver Catch
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            if (((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) !== card_types_1.CardType.WATER) {
                return state;
            }
            let isThisInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card.getPokemonCard() === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            const target = effect.target;
            const cards = target.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Water Energy');
            cards.forEach(card => {
                player.marker.addMarker(this.DIVER_CATCH_MARKER, card);
            });
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.marker.hasMarker(this.DIVER_CATCH_MARKER)) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.DIVER_CATCH_MARKER)) {
                    return;
                }
                prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                    if (result) {
                        const rescued = player.marker.markers
                            .filter(m => m.name === this.DIVER_CATCH_MARKER && m.source !== undefined)
                            .map(m => m.source);
                        prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards: rescued });
                        player.marker.removeMarker(this.DIVER_CATCH_MARKER);
                    }
                });
            });
        }
        return state;
    }
}
exports.Huntail = Huntail;

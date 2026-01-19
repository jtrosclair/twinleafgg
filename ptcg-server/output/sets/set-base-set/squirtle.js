"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Squirtle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Squirtle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 40;
        this.weakness = [{
                type: card_types_1.CardType.LIGHTNING
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Bubble',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }, {
                name: 'Withdraw',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, prevent all damage done to Squirtle during your opponent\'s next turn. (Any other effects of attacks still happen.)'
            }];
        this.set = 'BS';
        this.name = 'Squirtle';
        this.fullName = 'Squirtle BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, state_utils_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    player.active.marker.addMarker(game_1.PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
                    opponent.marker.addMarker(game_1.PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            if (effect.target.marker.hasMarker(game_1.PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
                effect.preventDefault = true;
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(game_1.PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(game_1.PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            });
        }
        return state;
    }
}
exports.Squirtle = Squirtle;

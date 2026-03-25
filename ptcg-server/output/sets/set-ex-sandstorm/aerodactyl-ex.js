"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aerodactylex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class Aerodactylex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mysterious Fossil';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Primal Lock',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Aerodactyl ex is in play, your opponent can\'t play Pokémon Tool cards. Remove any Pokémon Tool cards attached to your opponent\'s Pokémon and put them into his or her discard pile.'
            }];
        this.attacks = [{
                name: 'Supersonic',
                cost: [C],
                damage: 10,
                text: 'The Defending Pokémon is now Confused.'
            },
            {
                name: 'Wing Attack',
                cost: [C, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'SS';
        this.name = 'Aerodactyl ex';
        this.fullName = 'Aerodactyl ex SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Block trainer cards
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (!state_utils_1.StateUtils.isPokemonInPlay(opponent, this)) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, opponent, this)) {
                return state;
            }
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.ANY, cardList => {
                    if (cardList.cards.includes(this)) {
                        const opponent = state_utils_1.StateUtils.getOpponent(state, player);
                        opponent.forEachPokemon(game_1.PlayerType.ANY, (cardList, card) => {
                            if (cardList.tools.length > 0) {
                                cardList.tools.forEach(tool => {
                                    (0, prefabs_1.MOVE_CARDS)(store, state, cardList, opponent.discard, { cards: [tool], sourceCard: this });
                                });
                            }
                        });
                    }
                });
            });
        }
        return state;
    }
}
exports.Aerodactylex = Aerodactylex;

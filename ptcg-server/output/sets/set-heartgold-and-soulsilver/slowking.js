"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowking = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slowking extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slowpoke';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Second Sight',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may look at the top 3 cards of that player\'s deck and put them back on top of that player\'s deck in any order. This power can\'t be used if Slowking is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Psyshock',
                cost: [P, C],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Slowking';
        this.fullName = 'Slowking HS';
        this.SECOND_SIGHT_MARKER = 'SECOND_SIGHT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SECOND_SIGHT_MARKER, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SECOND_SIGHT_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.SECOND_SIGHT_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            const options = [
                {
                    message: game_1.GameMessage.ORDER_YOUR_DECK,
                    action: () => {
                        if (player.deck.cards.length === 0) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                        }
                        const deckTop = new game_1.CardList();
                        player.deck.moveTo(deckTop, 4);
                        return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                            if (order === null) {
                                return state;
                            }
                            deckTop.applyOrder(order);
                            deckTop.moveToTopOfDestination(player.deck);
                        });
                    }
                },
                {
                    message: game_1.GameMessage.ORDER_OPPONENT_DECK,
                    action: () => {
                        if (opponent.deck.cards.length === 0) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                        }
                        const deckTop = new game_1.CardList();
                        opponent.deck.moveTo(deckTop, 4);
                        return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                            if (order === null) {
                                return state;
                            }
                            deckTop.applyOrder(order);
                            deckTop.moveToTopOfDestination(opponent.deck);
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Slowking = Slowking;

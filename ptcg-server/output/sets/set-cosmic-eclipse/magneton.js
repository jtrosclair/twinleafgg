"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magneton = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magneton extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magnemite';
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Call Signal',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                knocksOutSelf: true,
                text: 'Once during your turn (before your attack), you may search your deck for up to 3 Supporter cards, reveal them, and put them into your hand. Then, shuffle your deck. If you searched your deck in this way, this Pokémon is Knocked Out.'
            }];
        this.attacks = [{
                name: 'Magnetic Blast',
                cost: [L, L, C],
                damage: 50,
                text: ''
            }];
        this.set = 'CEC';
        this.setNumber = '69';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magneton';
        this.fullName = 'Magneton CEC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 3, allowCancel: true }), selectedCards => {
                cards = selectedCards || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.damage += 999;
                        }
                    });
                    return state;
                }
                cards.forEach((card, index) => {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: [card], sourceCard: this, sourceEffect: this.powers[0] });
                });
                cards.forEach((card, index) => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.damage += 999;
                    }
                });
            });
        }
        return state;
    }
}
exports.Magneton = Magneton;

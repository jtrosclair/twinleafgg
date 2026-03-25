"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magcargo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const card_list_1 = require("../../game/store/state/card-list");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useSmoothOver(next, store, state, self, effect) {
    const player = effect.player;
    let cards = [];
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    const deckTop = new card_list_1.CardList();
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK, player.deck, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, deckTop);
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === self) {
            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
        }
    });
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        if (order === null) {
            return state;
        }
        deckTop.applyOrder(order);
        deckTop.moveToTopOfDestination(player.deck);
    });
}
class Magcargo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slugma';
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Smooth Over',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may search your deck for a card. Shuffle your deck, then put that card on top of your deck. This power can\'t be used if Magcargo is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Knock Over',
                cost: [C],
                damage: 10,
                text: 'You may discard any Stadium card in play.'
            },
            {
                name: 'Combustion',
                cost: [R, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'DX';
        this.setNumber = '20';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magcargo';
        this.fullName = 'Magcargo DX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const generator = useSmoothOver(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_DISCARD_STADIUM), wantToUse => {
                    if (wantToUse) {
                        const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                        const player = game_1.StateUtils.findOwner(state, cardList);
                        cardList.moveTo(player.discard);
                    }
                    return state;
                });
            }
        }
        return state;
    }
}
exports.Magcargo = Magcargo;

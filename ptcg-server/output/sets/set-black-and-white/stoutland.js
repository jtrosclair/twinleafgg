"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stoutland = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
function* useOdorSleuth(next, store, state, self, player, opponent) {
    (0, prefabs_1.BLOCK_IF_DECK_EMPTY)(player);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 2, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        player.deck.moveCardsTo(cards, player.hand);
        // Show cards to opponent
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
}
class Stoutland extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Herdier';
        this.cardType = C;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Odor Sleuth',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 cards and put them into your hand. Show those cards to your opponent. Shuffle your deck afterward.'
            },
            {
                name: 'Wild Tackle',
                cost: [C, C, C, C],
                damage: 100,
                text: 'This Pokémon can\'t attack during your next turn.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Stoutland';
        this.fullName = 'Stoutland BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const generator = useOdorSleuth(() => generator.next(), store, state, this, player, opponent);
            return generator.next().value;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Stoutland = Stoutland;

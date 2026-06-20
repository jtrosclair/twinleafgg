"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FossilExcavationSite = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* useStadium(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    if (player.deck.cards.length === 0 || slots.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const maxPick = Math.min(2, slots.length);
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (!(card instanceof trainer_card_1.TrainerCard && card.name.includes('Antique'))) {
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: maxPick, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    cards.forEach((card, index) => {
        const playFromDeck = new play_card_effects_1.PlayPokemonFromDeckEffect(player, card, slots[index]);
        store.reduceEffect(state, playFromDeck);
        slots[index].pokemonPlayedTurn = state.turn;
    });
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class FossilExcavationSite extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'J';
        this.set = 'M5';
        this.setNumber = '79';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Fossil Excavation Site';
        this.fullName = 'Fossil Excavation Site M5';
        this.text = 'Once during each player\'s turn, that player may search their deck for up to 2 Trainer cards with "Antique" in their name, put them onto their Bench, and then shuffle their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.FossilExcavationSite = FossilExcavationSite;

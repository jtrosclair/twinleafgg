"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysCheerfulness = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playMistysCheerfulness(next, store, state, effect, self) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 0, max: 4, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1 }), targets => {
            if (!targets || targets.length === 0) {
                return;
            }
            const target = targets[0];
            (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, target, { cards, sourceCard: self });
            next();
        });
    }
    store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
    return store.reduceEffect(state, endTurnEffect);
}
class MistysCheerfulness extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'J';
        this.set = 'M5';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Misty\'s Cheerfulness';
        this.fullName = 'Misty\'s Cheerfulness M5';
        this.text = `If you play this card, your turn ends.
  
Search your deck for up to 4 Basic [W] Energy and attach them to 1 of your Pokémon. Then, shuffle your deck.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            const generator = playMistysCheerfulness(() => generator.next(), store, state, effect, this);
            return generator.next().value;
        }
        return state;
    }
}
exports.MistysCheerfulness = MistysCheerfulness;

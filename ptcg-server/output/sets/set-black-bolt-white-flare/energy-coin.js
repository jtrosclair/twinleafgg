"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyCoin = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect, sourceCard) {
    const player = effect.player;
    let coin1Result = false;
    let coin2Result = false;
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), (result) => {
        coin1Result = result;
        next();
    });
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), (result) => {
        coin2Result = result;
        next();
    });
    if (coin1Result && coin2Result) {
        state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 1 }), transfers => {
            transfers = transfers || [];
            if (transfers.length === 0) {
                prefabs_1.SHUFFLE_DECK(store, state, player);
                return;
            }
            for (const transfer of transfers) {
                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                prefabs_1.MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: effect.trainerCard });
            }
            return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), (order) => {
                player.deck.applyOrder(order);
            });
        });
        return state;
    }
}
class EnergyCoin extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Energy Coin';
        this.fullName = 'Energy Coin SV11B';
        this.text = 'Flip 2 coins. If both of them are heads, search your deck for 1 Basic Energy card and attach it to one of your Pokémon. Then shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect, this);
            return generator.next().value;
        }
        return state;
    }
}
exports.EnergyCoin = EnergyCoin;

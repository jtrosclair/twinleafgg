"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GustOfWind = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some(b => b.cards.length > 0);
    if (!hasBench) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
        const cardList = result[0];
        if (cardList) {
            const targetCard = new play_card_effects_1.TrainerTargetEffect(player, effect.trainerCard, cardList);
            targetCard.target = cardList;
            store.reduceEffect(state, targetCard);
            if (targetCard.target) {
                opponent.switchPokemon(targetCard.target);
            }
        }
        (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
        return state;
    });
}
class GustOfWind extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Gust of Wind';
        this.fullName = 'Gust of Wind BS';
        this.text = 'Switch 1 of your opponent\'s Benched Pokemon with his or her ' +
            'Active Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.GustOfWind = GustOfWind;

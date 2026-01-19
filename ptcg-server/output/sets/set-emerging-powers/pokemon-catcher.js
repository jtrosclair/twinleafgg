"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCatcher = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some(b => b.cards.length > 0);
    if (!hasBench) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
        (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
    });
    (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
}
class PokemonCatcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Pokemon Catcher';
        this.fullName = 'Pokemon Catcher EPO';
        this.text = 'Switch your opponent\'s Active Pokémon with 1 of their Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PokemonCatcher = PokemonCatcher;

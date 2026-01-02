"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossSwitcher = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const name = effect.trainerCard.name;
    // Must have another Cross Switcher in hand besides this one
    const second = player.hand.cards.find(c => {
        return c.name === name && c !== effect.trainerCard;
    });
    if (second === undefined) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Check if opponent has any benched Pokemon
    const benchCount = opponent.bench.some(b => b.cards.length > 0);
    if (!benchCount) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We already verified second exists; discard both at the end
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), targets => {
        if (!targets || targets.length === 0) {
            return;
        }
        opponent.active.clearEffects();
        opponent.switchPokemon(targets[0]);
        next();
        // Do not discard the card yet
        effect.preventDefault = true;
        // Check if player has any benched Pokemon
        const hasBench = player.bench.some(b => b.cards.length > 0);
        if (!hasBench) {
            // No bench for player: discard both Cross Switchers now and finish
            if (second !== undefined) {
                player.hand.moveCardTo(second, player.discard);
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        let target = [];
        return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), results => {
            target = results || [];
            next();
            if (target.length === 0) {
                return state;
            }
            // Perform player's switch, then discard both Cross Switchers
            player.active.clearEffects();
            player.switchPokemon(target[0]);
            if (second !== undefined) {
                player.hand.moveCardTo(second, player.discard);
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        });
    });
}
class CrossSwitcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '230';
        this.set = 'FST';
        this.name = 'Cross Switcher';
        this.fullName = 'Cross Switcher FST';
        this.text = 'You must play 2 Cross Switcher cards at once. (This effect works one time for 2 cards.)' +
            '' +
            'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. If you do, switch your Active Pokémon with 1 of your Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.CrossSwitcher = CrossSwitcher;

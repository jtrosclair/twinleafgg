"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Celebi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const pokemon_card_2 = require("../../game/store/card/pokemon-card");
function* playAttack(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_ATTACK);
    }
    // Count Grass Pokemon and Stadium cards
    let grassPokemons = 0;
    let stadiums = 0;
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        if (c instanceof pokemon_card_2.PokemonCard && c.cardType === card_types_1.CardType.GRASS) {
            grassPokemons += 1;
        }
        else if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM) {
            stadiums += 1;
        }
        else {
            blocked.push(index);
        }
    });
    const maxPokemons = Math.min(grassPokemons, 3);
    const maxStadiums = Math.min(stadiums, 3);
    const count = Math.min(maxPokemons + maxStadiums, 3);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, {
        min: 0,
        max: count,
        allowCancel: false,
        blocked,
        maxPokemons,
        maxStadiums,
        allowDifferentSuperTypes: true
    }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Celebi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Traverse Time',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Search your deck for up to 3 in any combination of {G} Pokémon and Stadium cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Solar Cutter',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                text: ''
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Celebi';
        this.fullName = 'Celebi MEG';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = playAttack(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Celebi = Celebi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokePad = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
function hasRuleBox(card) {
    return card.tags.includes(card_types_1.CardTag.POKEMON_ex) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_EX) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_V) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_VUNION) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_GX) ||
        card.tags.includes(card_types_1.CardTag.TAG_TEAM) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_LV_X) ||
        card.tags.includes(card_types_1.CardTag.BREAK) ||
        card.tags.includes(card_types_1.CardTag.PRISM_STAR) ||
        card.tags.includes(card_types_1.CardTag.MEGA) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA) ||
        card.tags.includes(card_types_1.CardTag.LEGEND) ||
        card.tags.includes(card_types_1.CardTag.RADIANT);
}
class PokePad extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'J';
        this.set = 'ASC';
        this.setNumber = '198';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Poké Pad';
        this.fullName = 'Poké Pad MC';
        this.text = 'Search your deck for a Pokémon that doesn\'t have a Rule Box, reveal it, and put it into your hand. Then, shuffle your deck. (Pokémon ex, Pokémon V, etc. have Rule Boxes.)';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard) {
                    // Block Pokemon cards with Rule Box tags
                    if (hasRuleBox(card)) {
                        blocked.push(index);
                    }
                }
                else {
                    // Block non-Pokemon cards
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, effect.player, {}, { min: 0, max: 1, blocked });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.PokePad = PokePad;

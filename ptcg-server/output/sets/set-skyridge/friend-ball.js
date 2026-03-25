"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendBall = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class FriendBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SK';
        this.setNumber = '126';
        this.name = 'Friend Ball';
        this.fullName = 'Friend Ball SK';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Choose 1 of your opponent\'s Pokémon. Search your deck for a Baby Pokémon, Basic Pokémon, or Evolution card of the same type (color), show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            effect.preventDefault = true;
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return state;
                }
                const target = targets[0];
                const checkEffect = new check_effects_1.CheckPokemonTypeEffect(target);
                store.reduceEffect(state, checkEffect);
                const uniqueTypes = new Set();
                checkEffect.cardTypes.forEach(type => uniqueTypes.add(type));
                const blocked = [];
                player.deck.cards.forEach((card, index) => {
                    if (card instanceof game_1.PokemonCard && uniqueTypes.has(card.cardType)) {
                        // Valid card
                    }
                    else {
                        blocked.push(index);
                    }
                });
                (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, player, {}, { blocked, min: 0, max: 1 });
            });
        }
        return state;
    }
}
exports.FriendBall = FriendBall;

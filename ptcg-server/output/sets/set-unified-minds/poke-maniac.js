"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeManiac = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PokeManiac extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UNM';
        this.setNumber = '204';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pok\u00e9 Maniac';
        this.fullName = 'Pok\u00e9 Maniac UNM';
        this.text = 'Search your deck for up to 3 Pok\u00e9mon that have a Retreat Cost of exactly 4, reveal them, and put them into your hand. Then, shuffle your deck. You may play only 1 Supporter card during your turn (before your attack).';
    }
    // Ref: set-cosmic-eclipse/steelix.ts (Thumping Fall - retreat cost 4 filter)
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.retreat.length === 4) {
                    return;
                }
                blocked.push(index);
            });
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 3, allowCancel: true, blocked }), cards => {
                cards = cards || [];
                cards.forEach(card => {
                    player.deck.moveCardTo(card, player.hand);
                });
                return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        return state;
    }
}
exports.PokeManiac = PokeManiac;

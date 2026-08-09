"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookOfTransformation = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class BookOfTransformation extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.usSetNumber = 'CRI 83';
        this.name = 'Book of Transformation';
        this.fullName = 'Book of Transformation M4';
        this.text = 'You must play 2 Transformation Tome cards at once. Switch 1 of your Basic Pokemon in play with 1 of your Basic Pokemon in your discard pile. (Any attached cards, damage counters, and effects remain on the new Pokemon.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Any print of this card counts (e.g. Transformation Tome CRI 83)
            const second = player.hand.cards.find(c => c instanceof BookOfTransformation && c !== effect.trainerCard);
            if (second === undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const hasBasicInPlay = player.active.cards.some(c => c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC) ||
                player.bench.some(b => b.cards.some(c => c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC));
            const hasBasicInDiscard = player.discard.cards.some(c => c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC);
            if (!hasBasicInPlay || !hasBasicInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect.preventDefault = true;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card && card.stage !== card_types_1.Stage.BASIC) {
                    blocked.push(target);
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), inPlaySelected => {
                const inPlayTargets = inPlaySelected || [];
                if (inPlayTargets.length === 0)
                    return state;
                const inPlayList = inPlayTargets[0];
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), discardSelected => {
                    const fromDiscard = discardSelected || [];
                    if (fromDiscard.length === 0)
                        return state;
                    const inPlayCard = inPlayList.getPokemonCard();
                    if (inPlayCard && inPlayList.cards.length > 0) {
                        inPlayList.moveCardTo(inPlayList.cards[0], player.discard);
                    }
                    player.discard.moveCardTo(fromDiscard[0], inPlayList);
                    player.hand.moveCardTo(second, player.discard);
                });
            });
        }
        return state;
    }
}
exports.BookOfTransformation = BookOfTransformation;

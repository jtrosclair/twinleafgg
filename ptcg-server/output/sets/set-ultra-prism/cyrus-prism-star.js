"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyrusPrismStar = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
//Avery is not done yet!! have to add the "remove from bench" logic
class CyrusPrismStar extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Cyrus Prism Star';
        this.fullName = 'Cyrus Prism Star UPR';
        this.text = 'You can play this card only if your Active Pokémon is a [W] or [M] Pokémon.\n\nYour opponent chooses 2 Benched Pokémon and shuffles the others, and all cards attached to them, into their deck.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let hasActiveWaterMetal = false;
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.WATER) || checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL)) {
                hasActiveWaterMetal = true;
            }
            if (!hasActiveWaterMetal) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const opponentBenched = opponent.bench.filter(c => c.cards.length > 0);
            if (opponentBenched.length > 2) {
                store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: Math.min(opponentBenched.length, 2), max: 2 }), targets => {
                    if (!targets || targets.length === 0) {
                        return;
                    }
                    opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                        if (card !== opponent.active && !targets.includes(card)) {
                            card.clearEffects();
                            (0, prefabs_1.MOVE_CARDS)(store, state, card, opponent.deck);
                            (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                        }
                    });
                });
            }
            return state;
        }
        return state;
    }
}
exports.CyrusPrismStar = CyrusPrismStar;

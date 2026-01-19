"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blowtorch = void 0;
/* eslint-disable quotes */
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Blowtorch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.name = 'Blowtorch';
        this.fullName = 'Blowtorch M2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.text = `You can use this card only if you discard a Basic [R] Energy card from your hand. Discard a Pokémon Tool or Special Energy card from 1 of your opponent's Pokémon, or discard a Stadium in play.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if player has a Basic Fire Energy in hand
            const hasBasicFireEnergy = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Fire Energy';
            });
            if (!hasBasicFireEnergy) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Count opponent's Pokemon with Tools or Special Energy
            let opponentPokemonsWithTargets = 0;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, _card, target) => {
                const hasTools = cardList.tools.length > 0;
                const hasSpecialEnergy = cardList.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL);
                if (hasTools || hasSpecialEnergy) {
                    opponentPokemonsWithTargets += 1;
                }
                else {
                    blocked.push(target);
                }
            });
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            // Check if there are any valid targets
            if (opponentPokemonsWithTargets === 0 && stadiumCard === undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Move card to supporter zone temporarily
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            // Prompt to discard Basic Fire Energy
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    player.supporter.moveCardTo(this, player.hand);
                    return state;
                }
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards, sourceCard: this });
            });
            // If both Pokemon targets and Stadium exist, give choice
            if (opponentPokemonsWithTargets >= 1 && stadiumCard !== undefined) {
                const options = [
                    {
                        message: game_1.GameMessage.CHOICE_TOOL,
                        action: () => {
                            return this.discardFromOpponentPokemon(store, state, player, opponent, blocked);
                        }
                    },
                    {
                        message: game_1.GameMessage.CHOICE_STADIUM,
                        action: () => {
                            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
                            if (stadiumCard === undefined) {
                                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                            }
                            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                            const owner = game_1.StateUtils.findOwner(state, cardList);
                            (0, prefabs_1.MOVE_CARDS)(store, state, cardList, owner.discard, { sourceCard: this });
                            player.supporter.moveCardTo(this, player.discard);
                            return state;
                        }
                    }
                ];
                return store.prompt(state, new game_1.SelectOptionPrompt(player.id, game_1.GameMessage.DISCARD_STADIUM_OR_TOOL, options.map(c => c.message), { allowCancel: false }), choice => {
                    const result = options[choice].action();
                    return result;
                });
            }
            // Only Stadium available
            if (opponentPokemonsWithTargets === 0 && stadiumCard !== undefined) {
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const owner = game_1.StateUtils.findOwner(state, cardList);
                (0, prefabs_1.MOVE_CARDS)(store, state, cardList, owner.discard, { sourceCard: this });
                player.supporter.moveCardTo(this, player.discard);
                return state;
            }
            // Only Pokemon targets available
            if (opponentPokemonsWithTargets >= 1 && stadiumCard === undefined) {
                return this.discardFromOpponentPokemon(store, state, player, opponent, blocked);
            }
            player.supporter.moveCardTo(this, player.discard);
            return state;
        }
        return state;
    }
    discardFromOpponentPokemon(store, state, player, opponent, blocked) {
        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), (results) => {
            const targets = results || [];
            if (targets.length === 0) {
                player.supporter.moveCardTo(this, player.discard);
                return state;
            }
            const target = targets[0];
            const tools = target.tools;
            const specialEnergies = target.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL);
            const discardableCards = [...tools, ...specialEnergies];
            if (discardableCards.length === 0) {
                player.supporter.moveCardTo(this, player.discard);
                return state;
            }
            if (discardableCards.length === 1) {
                // Only one card, discard it directly
                target.moveCardTo(discardableCards[0], opponent.discard);
                player.supporter.moveCardTo(this, player.discard);
                return state;
            }
            // Multiple cards, prompt to choose one
            const cardList = new game_1.CardList();
            cardList.cards = [...discardableCards];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, cardList, {}, { min: 1, max: 1, allowCancel: false }), selectedCards => {
                if (selectedCards && selectedCards.length === 1) {
                    target.moveCardTo(selectedCards[0], opponent.discard);
                }
                player.supporter.moveCardTo(this, player.discard);
                return state;
            });
        });
    }
}
exports.Blowtorch = Blowtorch;

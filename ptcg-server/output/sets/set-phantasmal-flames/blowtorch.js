"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blowtorch = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Blowtorch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Blowtorch';
        this.fullName = 'Blowtorch PFL';
        this.text = 'You can use this card only if you discard a Basic [R] Energy card from your hand.\n\nDiscard a Pokémon Tool or Special Energy card from 1 of your opponent\'s Pokémon, or discard a Stadium in play.';
    }
    canPlay(store, state, player) {
        const opponent = game_1.StateUtils.getOpponent(state, player);
        if (!player.hand.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.name === 'Fire Energy')) {
            return false;
        }
        let pokemonsWithTool = 0;
        opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
            if (cardList.tools.length > 0) {
                pokemonsWithTool += 1;
            }
        });
        let specialEnergy = 0;
        opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
            if (cardList.energies.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.SPECIAL)) {
                specialEnergy += 1;
            }
        });
        const stadiumCard = game_1.StateUtils.getStadiumCard(state);
        if (pokemonsWithTool === 0 && stadiumCard === undefined && specialEnergy === 0) {
            return false;
        }
        // No other restrictions - card can be played
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!player.hand.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.name === 'Fire Energy')) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let pokemonsWithTool = 0;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.tools.length > 0) {
                    pokemonsWithTool += 1;
                }
                else {
                    blocked.push(target);
                }
            });
            let specialEnergy = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.energies.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.SPECIAL)) {
                    specialEnergy += 1;
                }
            });
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (pokemonsWithTool === 0 && stadiumCard === undefined && specialEnergy === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                player.hand.moveCardsTo(cards, player.discard);
                const toolOption = {
                    message: game_1.GameMessage.CHOICE_TOOL,
                    action: () => {
                        let targets = [];
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), results => {
                            targets = results || [];
                            if (targets.length === 0) {
                                return state;
                            }
                            const cardList = targets[0];
                            const owner = game_1.StateUtils.findOwner(state, cardList);
                            if (cardList.tools.length > 0) {
                                if (cardList.tools.length > 1) {
                                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, cardList, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { min: 1, max: 1, allowCancel: false }), selected => {
                                        if (selected && selected.length > 0) {
                                            cardList.moveCardTo(selected[0], owner.discard);
                                        }
                                        player.supporter.moveCardTo(this, player.discard);
                                        return state;
                                    });
                                }
                                else {
                                    cardList.moveCardTo(cardList.tools[0], owner.discard);
                                }
                            }
                            player.supporter.moveCardTo(this, player.discard);
                            return state;
                        });
                    }
                };
                const stadiumOption = {
                    message: game_1.GameMessage.CHOICE_STADIUM,
                    action: () => {
                        const stadiumCard = game_1.StateUtils.getStadiumCard(state);
                        if (stadiumCard == undefined) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                        }
                        // Discard Stadium
                        const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                        const owner = game_1.StateUtils.findOwner(state, cardList);
                        (0, prefabs_1.MOVE_CARDS)(store, state, cardList, owner.discard, { sourceCard: this });
                        player.supporter.moveCardTo(this, player.discard);
                        return state;
                    }
                };
                const specialEnergyBlocked = [];
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    if (cardList.energies.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.SPECIAL)) {
                        return;
                    }
                    else {
                        specialEnergyBlocked.push(target);
                    }
                });
                const specialEnergyOption = {
                    message: game_1.GameMessage.CHOICE_SPECIAL_ENERGY,
                    action: () => {
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: specialEnergyBlocked }), results => {
                            if (results.length === 0) {
                                return state;
                            }
                            const target = results[0];
                            let cards = [];
                            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                                cards = selected || [];
                                if (cards.length > 0) {
                                    target.moveCardsTo(cards, opponent.discard);
                                }
                                return state;
                            });
                        });
                    }
                };
                const options = [];
                if (pokemonsWithTool > 0) {
                    options.push(toolOption);
                }
                if (specialEnergy > 0) {
                    options.push(specialEnergyOption);
                }
                if (stadiumCard !== undefined) {
                    options.push(stadiumOption);
                }
                return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.DISCARD_STADIUM_OR_TOOL_OR_SPECIAL_ENERGY, options.map(c => c.message), { allowCancel: false }), choice => {
                    const option = options[choice];
                    if (option.action) {
                        option.action();
                    }
                    player.supporter.moveCardTo(this, player.discard);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.Blowtorch = Blowtorch;

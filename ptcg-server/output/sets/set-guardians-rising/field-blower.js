"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldBlower = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class FieldBlower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'GRI';
        this.name = 'Field Blower';
        this.fullName = 'Field Blower GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.text = 'Choose up to 2 in any combination of Pokémon Tool cards and Stadium cards in play (yours or your opponent\'s) and discard them.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count Pokémon with tools and build blocked list
            let pokemonsWithTool = 0;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.tools.length > 0) {
                    pokemonsWithTool += 1;
                }
                else {
                    blocked.push(target);
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.tools.length > 0) {
                    pokemonsWithTool += 1;
                }
                else {
                    blocked.push(target);
                }
            });
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            // Check if card can be played
            if (pokemonsWithTool === 0 && stadiumCard === undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Prevent default effect and move card to supporter pile temporarily
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // Handle the case where only stadium is in play
            if (pokemonsWithTool === 0 && stadiumCard !== undefined) {
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const owner = game_1.StateUtils.findOwner(state, cardList);
                prefabs_1.MOVE_CARDS(store, state, cardList, owner.discard, { sourceCard: this });
                store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, {
                    name: player.name,
                    card: stadiumCard.name,
                    effectName: this.name
                });
                player.supporter.moveCardTo(this, player.discard);
                return state;
            }
            // Handle the case where only Pokémon tools are in play
            if (pokemonsWithTool >= 1 && stadiumCard === undefined) {
                return this.handlePokemonToolDiscard(store, state, player, blocked, 2);
            }
            // Handle the case where both stadium and Pokémon tools are in play
            if (pokemonsWithTool >= 1 && stadiumCard !== undefined) {
                return store.prompt(state, new game_1.SelectOptionPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, [
                    'Discard the Stadium card and up to 1 Pokémon Tool card.',
                    'Discard up to 2 Pokémon Tool cards.'
                ], { allowCancel: false }), choice => {
                    if (choice === 0) { // YES - discard stadium and up to 1 tool
                        const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                        const owner = game_1.StateUtils.findOwner(state, cardList);
                        prefabs_1.MOVE_CARDS(store, state, cardList, owner.discard, { sourceCard: this });
                        store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, {
                            name: player.name,
                            card: stadiumCard.name,
                            effectName: this.name
                        });
                        // Allow up to 1 Pokémon tool discard
                        return this.handlePokemonToolDiscard(store, state, player, blocked, 1);
                    }
                    else { // NO - discard up to 2 tools
                        return this.handlePokemonToolDiscard(store, state, player, blocked, 2);
                    }
                });
            }
            return state;
        }
        return state;
    }
    handlePokemonToolDiscard(store, state, player, blocked, maxTools) {
        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 0, max: maxTools, allowCancel: false, blocked }), results => {
            const targets = results || [];
            if (targets.length === 0) {
                // No Pokémon selected, just discard the Field Blower
                player.supporter.moveCardTo(this, player.discard);
                return state;
            }
            // Process tool discards sequentially
            this.processToolDiscards(store, state, player, targets, 0, () => {
                player.supporter.moveCardTo(this, player.discard);
            });
            return state;
        });
    }
    processToolDiscards(store, state, player, targets, index, onComplete) {
        if (index >= targets.length) {
            onComplete();
            return;
        }
        const target = targets[index];
        const owner = game_1.StateUtils.findOwner(state, target);
        if (target.tools.length === 1) {
            // Single tool, discard it directly
            const tool = target.tools[0];
            target.moveCardTo(tool, owner.discard);
            store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, {
                name: player.name,
                card: tool.name,
                effectName: this.name
            });
            this.processToolDiscards(store, state, player, targets, index + 1, onComplete);
        }
        else if (target.tools.length > 1) {
            // Multiple tools, prompt for selection
            const toolList = new card_list_1.CardList();
            toolList.cards = [...target.tools];
            store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, toolList, { trainerType: card_types_1.TrainerType.TOOL }, { min: 1, max: 1, allowCancel: false }), selectedTools => {
                if (selectedTools && selectedTools.length > 0) {
                    const tool = selectedTools[0];
                    target.moveCardTo(tool, owner.discard);
                    store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, {
                        name: player.name,
                        card: tool.name,
                        effectName: this.name
                    });
                }
                this.processToolDiscards(store, state, player, targets, index + 1, onComplete);
            });
        }
        else {
            // No tools on this Pokémon, continue to next
            this.processToolDiscards(store, state, player, targets, index + 1, onComplete);
        }
    }
}
exports.FieldBlower = FieldBlower;

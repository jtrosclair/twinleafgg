"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianSamurottV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const card_list_1 = require("../../game/store/state/card-list");
class HisuianSamurottV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 220;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Basket Crash',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Discard up to 2 Pokémon Tools from your opponent\'s Pokémon.'
            },
            {
                name: 'Shadow Slash',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 180,
                text: 'Discard an Energy from this Pokémon.'
            }
        ];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.name = 'Hisuian Samurott V';
        this.fullName = 'Hisuian Samurott V ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let pokemonsWithTool = 0;
            const blocked = [];
            const validTargets = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.tools.length > 0) {
                    pokemonsWithTool += 1;
                    validTargets.push(cardList);
                }
                else {
                    blocked.push(target);
                }
            });
            if (pokemonsWithTool === 0) {
                return state;
            }
            const max = Math.min(2, pokemonsWithTool);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: false, blocked }), results => {
                const chosenPokemons = results || [];
                if (chosenPokemons.length === 0) {
                    return state;
                }
                // If only one Pokémon is chosen and it has more than one tool, allow discarding up to 2 tools from it
                if (chosenPokemons.length === 1 && chosenPokemons[0].tools.length > 1) {
                    const toolList = new card_list_1.CardList();
                    toolList.cards = [...chosenPokemons[0].tools];
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, // You may want a new message for 'choose tool(s) to discard'
                    toolList, { trainerType: game_1.TrainerType.TOOL }, { min: 1, max: 2, allowCancel: false }), selectedTools => {
                        if (selectedTools && selectedTools.length > 0) {
                            const owner = game_1.StateUtils.findOwner(state, chosenPokemons[0]);
                            selectedTools.forEach(tool => {
                                chosenPokemons[0].moveCardTo(tool, owner.discard);
                            });
                        }
                        return state;
                    });
                }
                // If two Pokémon are chosen, discard one tool from each
                chosenPokemons.forEach(pokemon => {
                    if (pokemon.tools.length === 1) {
                        const owner = game_1.StateUtils.findOwner(state, pokemon);
                        pokemon.moveCardTo(pokemon.tools[0], owner.discard);
                    }
                    else if (pokemon.tools.length > 1) {
                        // Prompt to choose which tool to discard from this Pokémon
                        const toolList = new card_list_1.CardList();
                        toolList.cards = [...pokemon.tools];
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, // You may want a new message for 'choose tool to discard'
                        toolList, { trainerType: game_1.TrainerType.TOOL }, { min: 1, max: 1, allowCancel: false }), selectedTools => {
                            if (selectedTools && selectedTools.length === 1) {
                                const tool = selectedTools[0];
                                const owner = game_1.StateUtils.findOwner(state, pokemon);
                                pokemon.moveCardTo(tool, owner.discard);
                            }
                            return state;
                        });
                    }
                });
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.HisuianSamurottV = HisuianSamurottV;

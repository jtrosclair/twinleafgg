"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevolutionSprayZ = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class DevolutionSprayZ extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.name = 'Devolution Spray Z';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '166';
        this.set = 'UB';
        this.fullName = 'Devolution Spray Z UB';
        this.superType = card_types_1.SuperType.TRAINER;
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.text = 'Devolve 1 of your evolved Pokémon by shuffling any number of Evolution cards on it into your deck. (That Pokémon can\'t evolve this turn.)';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            let canDevolve = false;
            const player = effect.player;
            const blocked = [];
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (list.isEvolved()) {
                    canDevolve = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!canDevolve) {
                throw new game_1.GameError(game_1.GameStoreMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Choose Pokemon to Devolve
            return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1, blocked }), (results) => {
                if (results && results.length > 0 && results[0].getPokemons().length > 0) {
                    // Choose how far to devolve
                    store.prompt(state, new game_1.ChooseCardsPrompt(effect.player, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, results[0], { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false }), selected => {
                        if (selected && selected.length > 0) {
                            const pokemons = results[0].getPokemons();
                            const selectedPokemon = selected[0];
                            const selectedIndex = pokemons.findIndex(p => p === selectedPokemon);
                            if (selectedIndex === 0) {
                                throw new game_1.GameError(game_1.GameMessage.INVALID_PROMPT_RESULT);
                            }
                            if (selectedIndex >= 0) {
                                // Devolve until the selected Pokemon and everything above it is in hand
                                // We need to devolve (pokemons.length - selectedIndex) times
                                const devolvesNeeded = pokemons.length - selectedIndex;
                                for (let i = 0; i < devolvesNeeded; i++) {
                                    (0, prefabs_1.DEVOLVE_POKEMON)(store, state, results[0], effect.player.deck);
                                }
                                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                            }
                            return state;
                        }
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.DevolutionSprayZ = DevolutionSprayZ;

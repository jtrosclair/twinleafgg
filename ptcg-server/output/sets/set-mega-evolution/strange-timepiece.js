"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrangeTimepiece = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class StrangeTimepiece extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.name = 'Strange Timepiece';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.set = 'MEG';
        this.regulationMark = 'I';
        this.fullName = 'Strange Timepiece MEG';
        this.superType = card_types_1.SuperType.TRAINER;
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.text = 'Devolve 1 of your evolved [P] Pokémon by putting any number of Evolution cards on it into your hand. (That Pokémon can\'t evolve this turn.)';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            let canDevolve = false;
            const blocked = [];
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                const checkTypeEffect = new check_effects_1.CheckPokemonTypeEffect(list);
                store.reduceEffect(state, checkTypeEffect);
                if (list.isEvolved() && checkTypeEffect.cardTypes.includes(card_types_1.CardType.PSYCHIC)) {
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
                    // Choose how many evolutions to pick up
                    const pokemons = results[0].getPokemons();
                    const maxCount = pokemons.length - 1;
                    const options = [...Array(maxCount).keys()].map(i => String(i + 1));
                    store.prompt(state, new game_1.SelectPrompt(effect.player.id, game_1.GameMessage.CHOOSE_DEVOLVE_COUNT, options, { allowCancel: false }), choice => {
                        const devolvesNeeded = choice + 1;
                        for (let i = 0; i < devolvesNeeded; i++) {
                            (0, prefabs_1.DEVOLVE_POKEMON)(store, state, results[0], effect.player.hand);
                        }
                        // Keep this Pokémon from evolving again this turn.
                        results[0].pokemonPlayedTurn = state.turn;
                        return state;
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.StrangeTimepiece = StrangeTimepiece;

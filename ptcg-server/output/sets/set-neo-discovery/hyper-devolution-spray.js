"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperDevolutionSpray = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HyperDevolutionSpray extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.name = 'Hyper Devolution Spray';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.set = 'N2';
        this.fullName = 'Hyper Devolution Spray N2';
        this.superType = card_types_1.SuperType.TRAINER;
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.text = 'Choose 1 of your evolved Pokémon. Take the highest Stage Evolution card from that Pokémon and put it into your hand. (You can\'t evolve a Pokémon the turn you devolve it.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            let canDevolve = false;
            const player = effect.player;
            const blocked = [];
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (list.getPokemons().length > 1) {
                    canDevolve = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!canDevolve) {
                throw new game_1.GameError(game_1.GameStoreMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1, blocked }), (results) => {
                if (results && results.length > 0) {
                    (0, prefabs_1.DEVOLVE_POKEMON)(store, state, results[0], effect.player.hand);
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.HyperDevolutionSpray = HyperDevolutionSpray;

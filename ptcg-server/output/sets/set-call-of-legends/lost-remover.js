"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostRemover = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const game_1 = require("../../game");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LostRemover extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'CL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Lost Remover';
        this.fullName = 'Lost Remover CL';
        this.text = 'Put 1 Special Energy card attached to 1 of your opponent\'s Pokémon in the Lost Zone.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let hasPokemonWithEnergy = false;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.energies.cards.some(c => c.energyType === card_types_1.EnergyType.SPECIAL)) {
                    hasPokemonWithEnergy = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasPokemonWithEnergy) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let targets = [];
            store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
                targets = results || [];
                if (targets.length === 0) {
                    return state;
                }
                const target = targets[0];
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target.energies, { energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                    (0, prefabs_1.MOVE_CARDS)(store, state, target, opponent.lostzone, { cards: selected, sourceCard: this });
                });
            });
        }
        return state;
    }
}
exports.LostRemover = LostRemover;

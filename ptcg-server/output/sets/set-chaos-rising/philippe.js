"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Philippe = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class Philippe extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'M4';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.usSetNumber = 'CRI 79';
        this.name = 'Philippe';
        this.fullName = 'Philippe M4';
        this.text = 'Attach up to 2 Basic [M] Energy from your discard pile to 1 of your [M] Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const basicMetalInDiscard = player.discard.cards.filter(c => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.METAL));
            if (basicMetalInDiscard.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked = [];
            let metalPokemonCount = 0;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkType);
                if (!checkType.cardTypes.includes(card_types_1.CardType.METAL)) {
                    blocked.push(target);
                }
                else {
                    metalPokemonCount++;
                }
            });
            if (metalPokemonCount === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const discardBlocked = [];
            player.discard.cards.forEach((card, index) => {
                if (!(card instanceof energy_card_1.EnergyCard) || card.energyType !== card_types_1.EnergyType.BASIC || !card.provides.includes(card_types_1.CardType.METAL)) {
                    discardBlocked.push(index);
                }
            });
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), targets => {
                if (!targets || targets.length === 0)
                    return state;
                const target = targets[0];
                const checkType = new check_effects_1.CheckPokemonTypeEffect(target);
                store.reduceEffect(state, checkType);
                if (!checkType.cardTypes.includes(card_types_1.CardType.METAL)) {
                    return state;
                }
                return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: Math.min(2, basicMetalInDiscard.length), allowCancel: false, blocked: discardBlocked }), (selected) => {
                    const cards = selected || [];
                    cards.forEach(card => {
                        player.discard.moveCardTo(card, target);
                    });
                    return state;
                });
            });
        }
        return state;
    }
}
exports.Philippe = Philippe;

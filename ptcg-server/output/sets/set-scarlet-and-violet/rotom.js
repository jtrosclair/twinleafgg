"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotom = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Rotom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Junk Hunt',
                cost: [C],
                damage: 0,
                text: 'Put an Item card from your discard pile into your hand.'
            },
            {
                name: 'Thunder Shock',
                cost: [L],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Rotom';
        this.fullName = 'Rotom SVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: game_1.TrainerType.ITEM }, { min: 0, max: 1, allowCancel: false }), selected => {
                if (selected) {
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, selected);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards: selected });
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Rotom = Rotom;

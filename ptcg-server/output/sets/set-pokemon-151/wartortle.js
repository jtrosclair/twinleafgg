"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wartortle = void 0;
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wartortle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Squirtle';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Free Diving',
                cost: [W],
                damage: 0,
                text: 'Put up to 3 [W] Energy cards from your discard pile into your hand.'
            },
            {
                name: 'Spinning Attack',
                cost: [W, W],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'G';
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Wartortle';
        this.fullName = 'Wartortle MEW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const prompt = new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {
                cardType: card_types_1.CardType.WATER
            }, {
                min: 0,
                max: 3
            });
            state = store.prompt(state, prompt, chosenCards => {
                player.discard.moveCardsTo(chosenCards, player.hand);
            });
        }
        return state;
    }
}
exports.Wartortle = Wartortle;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decidueye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Decidueye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dartrix';
        this.cardType = G;
        this.hp = 150;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Stock Up on Feathers',
                cost: [C],
                damage: 0,
                text: 'Draw cards until you have 7 cards in your hand.'
            },
            {
                name: 'Power Shot',
                cost: [G],
                damage: 170,
                text: 'Discard a Basic [G] Energy from your hand. If you can\'t, this attack does nothing.'
            }
        ];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Decidueye';
        this.fullName = 'Decidueye SFA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            while (player.hand.cards.length < 7) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Prompt player to choose cards to discard 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Grass Energy' }, { allowCancel: false, min: 0, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    effect.damage = 0;
                    return state;
                }
                player.hand.moveCardsTo(cards, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.Decidueye = Decidueye;

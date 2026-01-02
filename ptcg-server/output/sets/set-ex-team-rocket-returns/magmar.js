"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magmar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const energy_card_1 = require("../../game/store/card/energy-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magmar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Dump and Draw',
                cost: [C],
                damage: 0,
                text: 'Discard up to 2 Energy cards from your hand. Then, draw 2 cards for each Energy card you discarded.'
            },
            {
                name: 'Flame Tail',
                cost: [R, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Magmar';
        this.fullName = 'Magmar TRR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof energy_card_1.EnergyCard;
            });
            if (!hasEnergyInHand) {
                return state;
            }
            if (player.deck.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 2 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                prefabs_1.DRAW_CARDS(player, cards.length * 2);
            });
        }
        return state;
    }
}
exports.Magmar = Magmar;

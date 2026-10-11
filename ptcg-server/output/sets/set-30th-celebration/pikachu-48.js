"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu48 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #48 — Store Up */
class Pikachu48 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Store Up',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put up to 2 Basic Energy cards from your discard pile into your hand.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 48';
    }
    reduceEffect(store, state, effect) {
        // Store Up
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergy = player.discard.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === game_1.EnergyType.BASIC);
            if (!hasEnergy) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: true }), cards => {
                if (cards && cards.length > 0) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
                }
            });
        }
        return state;
    }
}
exports.Pikachu48 = Pikachu48;

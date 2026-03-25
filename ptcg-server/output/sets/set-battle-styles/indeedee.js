"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Indeedee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Indeedee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Collect',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw 2 cards.'
            },
            {
                name: 'Hand Kinesis',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'This attack does 10 damage for each card in your hand.'
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Indeedee';
        this.fullName = 'Indeedee BST';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const damage = effect.player.hand.cards.length;
            effect.damage += damage;
        }
        return state;
    }
}
exports.Indeedee = Indeedee;

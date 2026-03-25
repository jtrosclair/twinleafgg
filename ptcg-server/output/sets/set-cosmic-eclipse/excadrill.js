"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Excadrill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Excadrill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drilbur';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Eleventh Hour Tackle', cost: [card_types_1.CardType.FIGHTING], damage: 30, text: 'If there are 3 or fewer cards in your deck, this attack does 150 more damage.' },
            { name: 'Drill Bazooka', cost: [card_types_1.CardType.FIGHTING], damage: 120, text: 'Discard the top 4 cards of your deck.' }
        ];
        this.set = 'CEC';
        this.name = 'Excadrill';
        this.fullName = 'Excadrill CEC';
        this.setNumber = '115';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Eleventh Hour Tackle
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length <= 3) {
                effect.damage += 150;
            }
        }
        // Drill Bazooka
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.deck.moveTo(player.discard, 4);
        }
        return state;
    }
}
exports.Excadrill = Excadrill;

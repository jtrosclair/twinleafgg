"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avalugg = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const energy_card_1 = require("../../game/store/card/energy-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Avalugg extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bergmite';
        this.hp = 160;
        this.cardType = W;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Iceberg Destruction',
                cost: [W],
                damage: 60,
                damageCalculation: 'x',
                text: 'Discard the top 6 cards of your deck. This attack does 60 damage for each Basic [W] Energy discarded in this way.'
            },
            {
                name: 'Frost Stomp',
                cost: [W, W, C, C],
                damage: 160,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Avalugg';
        this.fullName = 'Avalugg M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const count = Math.min(6, player.deck.cards.length);
            const topCards = player.deck.cards.slice(0, count);
            const basicWCount = topCards.filter(c => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(W)).length;
            state = (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.discard, {
                cards: topCards,
                sourceCard: this,
                sourceEffect: effect
            });
            effect.damage = basicWCount * 60;
        }
        return state;
    }
}
exports.Avalugg = Avalugg;

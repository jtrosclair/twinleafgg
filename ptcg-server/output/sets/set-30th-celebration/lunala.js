"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lunala = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lunala extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Cosmoem';
        this.hp = 160;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Midnight Ray',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each Energy in your discard pile.'
            },
            {
                name: 'Lunar Blast',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Lunala';
        this.fullName = 'Lunala 30C';
    }
    reduceEffect(store, state, effect) {
        // Midnight Ray
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const energyCount = effect.player.discard.cards.filter(c => c instanceof game_1.EnergyCard || c.superType === card_types_1.SuperType.ENERGY).length;
            effect.damage += energyCount * 20;
        }
        return state;
    }
}
exports.Lunala = Lunala;

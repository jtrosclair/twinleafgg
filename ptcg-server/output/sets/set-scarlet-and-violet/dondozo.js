"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dondozo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dondozo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Dondozo';
        this.cardType = W;
        this.hp = 160;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Release Rage',
                cost: [C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each Tatsugiri in your discard pile.'
            },
            {
                name: 'Heavy Splash',
                cost: [W, W, C, C],
                damage: 120,
                text: ''
            }
        ];
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Dondozo';
        this.fullName = 'Dondozo SVI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const cards = effect.player.discard.cards.filter(c => c.name === 'Tatsugiri');
            effect.damage = cards.length * 50;
            return state;
        }
        return state;
    }
}
exports.Dondozo = Dondozo;

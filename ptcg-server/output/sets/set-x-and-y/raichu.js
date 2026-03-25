"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Raichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikachu';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Circle Circuit',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack does 20 damage times the number of your ' +
                    'Benched Pokemon.'
            },
            {
                name: 'Thunderbolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Discard all Energy attached to this Pokemon.'
            }
        ];
        this.set = 'XY';
        this.name = 'Raichu';
        this.fullName = 'Raichu XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const benched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            effect.damage = benched * 20;
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const cards = player.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            return store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.Raichu = Raichu;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirlia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const card_types_2 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// LOT Kirlia 140 (https://limitlesstcg.com/cards/LOT/140)
class Kirlia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ralts';
        this.cardType = card_types_1.CardType.FAIRY;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [{ type: card_types_1.CardType.DARK, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Beat', cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 20, text: '' },
            { name: 'Disarming Voice', cost: [card_types_1.CardType.FAIRY, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 50, text: 'Your opponent\'s Active Pokémon is now Confused. ' },
        ];
        this.set = 'LOT';
        this.setNumber = '140';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kirlia';
        this.fullName = 'Kirlia LOT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.CONFUSED]);
            return store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.Kirlia = Kirlia;

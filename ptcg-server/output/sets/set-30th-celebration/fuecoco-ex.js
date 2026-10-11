"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fuecocoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Fuecocoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.hp = 210;
        this.cardType = card_types_1.CardType.FIRE;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Singe',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: "Your opponent's Active Pokémon is now Burned.",
            },
            {
                name: 'Cheerful Flame',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 70,
                damageCalculation: 'x',
                text: 'This attack does 70 damage for each Prize card you have taken.',
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Fuecoco ex';
        this.fullName = 'Fuecoco ex 30C';
    }
    reduceEffect(store, state, effect) {
        // Singe
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
        }
        // Cheerful Flame
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const prizesTaken = 6 - effect.player.getPrizeLeft();
            effect.damage = prizesTaken * 70;
        }
        return state;
    }
}
exports.Fuecocoex = Fuecocoex;

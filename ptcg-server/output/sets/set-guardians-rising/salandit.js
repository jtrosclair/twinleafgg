"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salandit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Salandit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [card_types_1.CardType.FIRE],
                damage: 10,
                text: '',
            },
            {
                name: 'Venoshock',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is Poisoned, this attack does 40 more damage.',
            }
        ];
        this.set = 'GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Salandit';
        this.fullName = 'Salandit GRI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            let damage = 20;
            if (effect.opponent.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                damage += 40;
            }
            effect.damage = damage;
        }
        return state;
    }
}
exports.Salandit = Salandit;

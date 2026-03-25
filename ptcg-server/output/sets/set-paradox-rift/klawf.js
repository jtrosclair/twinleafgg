"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klawf = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Klawf extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Unhinged Scissors',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                damageCalculation: '+',
                text: 'If this Pokémon is affected by a Special Condition, this attack does 160 more damage.'
            },
            {
                name: 'Boiled Press',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 80,
                text: 'This Pokémon is now Burned.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Klawf';
        this.fullName = 'Klawf PAR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const specialConditions = player.active.specialConditions;
            if (specialConditions.length > 0) {
                effect.damage += 160;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
        }
        return state;
    }
}
exports.Klawf = Klawf;

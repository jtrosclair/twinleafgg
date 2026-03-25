"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Raichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikachu';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ambushing Spark',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 40,
                damageCalculation: '+',
                text: 'If your opponent has used their VSTAR Power during this game, this attack does 100 more damage.'
            },
            {
                name: 'Electric Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Raichu';
        this.fullName = 'Raichu SIT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            /*
             * Legacy pre-prefab implementation:
             * - resolved opponent with StateUtils.getOpponent(...)
             * - checked opponent.usedVSTAR directly
             */
            // Converted to prefab version (OPPONENT_HAS_USED_VSTAR_POWER).
            if ((0, prefabs_1.OPPONENT_HAS_USED_VSTAR_POWER)(state, effect.player)) {
                effect.damage += 100;
            }
            return state;
        }
        return state;
    }
}
exports.Raichu = Raichu;

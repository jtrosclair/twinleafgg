"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoopa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hoopa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Assault Gate',
                cost: [card_types_1.CardType.DARK],
                damage: 90,
                text: 'If this Pokémon didn\'t move from the Bench to the Active Spot this turn, this attack does nothing. This attack\'s damage isn\'t affected by Weakness.'
            }
        ];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Hoopa';
        this.fullName = 'Hoopa CRZ';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (!(0, prefabs_1.MOVED_TO_ACTIVE_THIS_TURN)(effect.player, this)) {
                effect.damage = 0;
                return state;
            }
            effect.ignoreWeakness = true;
            effect.damage = 90;
        }
        return state;
    }
}
exports.Hoopa = Hoopa;

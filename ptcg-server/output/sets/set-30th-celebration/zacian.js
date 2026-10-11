"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zacian = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zacian extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 130;
        this.cardType = card_types_1.CardType.METAL;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hard Blade',
                cost: [card_types_1.CardType.METAL],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pokémon has a Pokémon Tool attached to it, this attack does 40 more damage.'
            },
            {
                name: 'Slash Down',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t use Slash Down.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Zacian';
        this.fullName = 'Zacian 30C';
    }
    reduceEffect(store, state, effect) {
        // Hard Blade
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.player.active.tools.length > 0) {
                effect.damage += 40;
            }
        }
        // Slash Down
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.player.active.cannotUseAttacksNextTurnPending.push('Slash Down');
        }
        return state;
    }
}
exports.Zacian = Zacian;

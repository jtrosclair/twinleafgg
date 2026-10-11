"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Umbreon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Umbreon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.hp = 110;
        this.cardType = card_types_1.CardType.DARK;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Retaliate',
                cost: [card_types_1.CardType.DARK],
                damage: 30,
                damageCalculation: '+',
                text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 100 more damage.'
            },
            {
                name: 'Darkness Fang',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Umbreon';
        this.fullName = 'Umbreon 30C';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-lost-thunder/umbreon.ts (Retaliate — REVENGE_MARKER)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN)(player, { byAttackDamage: true })) {
                effect.damage += 100;
            }
            return state;
        }
        return state;
    }
}
exports.Umbreon = Umbreon;

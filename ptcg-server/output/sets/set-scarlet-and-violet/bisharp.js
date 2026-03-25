"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bisharp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bisharp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pawniard';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Dark Cutter',
                cost: [card_types_1.CardType.DARK],
                damage: 40,
                text: ''
            },
            {
                name: 'Double-Edged Slash',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'This Pokémon also does 30 damage to itself.'
            }
        ];
        this.set = 'SVI';
        this.setNumber = '133';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Bisharp';
        this.fullName = 'Bisharp SVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const damageThatBoi = new attack_effects_1.PutDamageEffect(effect, 30);
            damageThatBoi.target = effect.player.active;
            store.reduceEffect(state, damageThatBoi);
        }
        return state;
    }
}
exports.Bisharp = Bisharp;

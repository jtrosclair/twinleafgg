"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lanturn = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Lanturn extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chinchou';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Special Tackle',
                cost: [L],
                damage: 30,
                damageCalculation: '+',
                text: 'If this Pokémon has any Special Energy attached to it, this attack does 30 more damage.'
            },
            {
                name: 'Extreme Current',
                cost: [L, C, C],
                damage: 90,
                text: 'Discard an Energy attached to this Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lanturn';
        this.fullName = 'Lanturn PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasSpecial = player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.SPECIAL);
            if (hasSpecial) {
                effect.damage += 30;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Lanturn = Lanturn;

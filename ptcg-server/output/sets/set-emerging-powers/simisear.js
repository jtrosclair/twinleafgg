"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simisear = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Simisear extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pansear';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Water\'s Power',
                cost: [C, C],
                damage: 30,
                text: 'If this Pokémon has any [W] Energy attached to it, the Defending Pokémon is now Asleep.'
            },
            {
                name: 'Flamethrower',
                cost: [R, C, C],
                damage: 70,
                text: 'Discard an Energy attached to this Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Simisear';
        this.fullName = 'Simisear EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasWaterEnergy = player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.provides.includes(card_types_1.CardType.WATER));
            if (hasWaterEnergy) {
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Simisear = Simisear;

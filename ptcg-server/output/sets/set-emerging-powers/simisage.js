"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simisage = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Simisage extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pansage';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Fire\'s Power',
                cost: [C, C],
                damage: 30,
                text: 'If this Pokémon has any [R] Energy attached to it, the Defending Pokémon is now Burned.'
            },
            {
                name: 'Seed Bomb',
                cost: [G, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Simisage';
        this.fullName = 'Simisage EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasFireEnergy = player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.provides.includes(card_types_1.CardType.FIRE));
            if (hasFireEnergy) {
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
            }
        }
        return state;
    }
}
exports.Simisage = Simisage;

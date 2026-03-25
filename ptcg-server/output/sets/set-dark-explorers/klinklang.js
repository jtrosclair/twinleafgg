"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klinklang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Klinklang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Klang';
        this.cardType = M;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Metal Blast',
                cost: [C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 more damage for each [M] Energy attached to this Pokémon.'
            },
            {
                name: 'Lock Gear',
                cost: [M, M, C, C],
                damage: 60,
                text: 'Draw cards until you have 6 cards in your hand.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Klinklang';
        this.fullName = 'Klinklang DEX';
    }
    reduceEffect(store, state, effect) {
        // Metal Blast - 20 + 20 for each Metal energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            let metalEnergy = 0;
            for (const energyMap of checkProvidedEnergy.energyMap) {
                const metalCount = energyMap.provides.filter(t => t === card_types_1.CardType.METAL).length;
                metalEnergy += metalCount;
            }
            effect.damage += 20 * metalEnergy;
        }
        // Lock Gear - draw until 6 cards in hand
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(player, 6);
        }
        return state;
    }
}
exports.Klinklang = Klinklang;

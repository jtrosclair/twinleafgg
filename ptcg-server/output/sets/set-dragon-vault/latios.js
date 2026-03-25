"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latios = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Latios extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 100;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Sky Blade',
                cost: [W, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If Latias is on your Bench, this attack does 20 more damage.'
            },
            {
                name: 'Speed Wing',
                cost: [P, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'DRV';
        this.setNumber = '10';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Latios';
        this.fullName = 'Latios DRV';
    }
    reduceEffect(store, state, effect) {
        // Sky Blade - +20 if Latias on bench
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let hasLatias = false;
            player.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    const pokemon = benchSlot.getPokemonCard();
                    if (pokemon && pokemon.name === 'Latias') {
                        hasLatias = true;
                    }
                }
            });
            if (hasLatias) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.Latios = Latios;

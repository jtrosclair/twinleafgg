"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terrakion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Terrakion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Cavern Counter',
                cost: [F, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If all of your Benched Pokémon have at least 1 damage counter on them, this attack does 150 more damage.'
            },
            {
                name: 'Boulder Crush',
                cost: [F, F, C, C],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '122';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Terrakion';
        this.fullName = 'Terrakion UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Cavern Counter
        // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - conditional bonus damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const benchedPokemon = player.bench.filter(b => b.cards.length > 0);
            if (benchedPokemon.length > 0 && benchedPokemon.every(b => b.damage > 0)) {
                effect.damage += 150;
            }
        }
        return state;
    }
}
exports.Terrakion = Terrakion;

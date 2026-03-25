"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rayquaza = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Rayquaza extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 120;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Breakthrough Assault',
                cost: [L, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 90 more damage.'
            },
            {
                name: 'Dragon Claw',
                cost: [R, L, C],
                damage: 130,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '153';
        this.name = 'Rayquaza';
        this.fullName = 'Rayquaza M2a';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if ((0, prefabs_1.MOVED_TO_ACTIVE_THIS_TURN)(effect.player, this)) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.Rayquaza = Rayquaza;

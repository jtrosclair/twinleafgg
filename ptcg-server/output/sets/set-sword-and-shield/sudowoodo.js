"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sudowoodo = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sudowoodo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Double Draw',
                cost: [C],
                damage: 0,
                text: 'Draw 2 cards.'
            },
            {
                name: 'Flail',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'This attack does 10 damage for each damage counter on this Pokémon.'
            }];
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Sudowoodo';
        this.fullName = 'Sudowoodo SSH';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 2);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.damage = effect.player.active.damage;
        }
        return state;
    }
}
exports.Sudowoodo = Sudowoodo;

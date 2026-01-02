"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tangela = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tangela extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Toxic',
                cost: [G],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Tangela';
        this.fullName = 'Tangela CEC';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this, 20);
        }
        return state;
    }
}
exports.Tangela = Tangela;

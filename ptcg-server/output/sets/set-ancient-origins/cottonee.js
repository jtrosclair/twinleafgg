"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cottonee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cottonee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 40;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cotton Bed',
                cost: [Y],
                damage: 10,
                text: 'Your opponent\'s Active Pokémon is now Asleep.',
            }];
        this.set = 'AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Cottonee';
        this.fullName = 'Cottonee AOR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Cottonee = Cottonee;

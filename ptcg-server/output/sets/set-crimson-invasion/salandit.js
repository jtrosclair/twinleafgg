"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salandit = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Salandit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Singe',
                cost: [P],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }];
        this.set = 'CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Salandit';
        this.fullName = 'Salandit CIN';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Salandit = Salandit;

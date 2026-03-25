"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bellsprout = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Bellsprout extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sleep Powder',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            }];
        this.set = 'LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Bellsprout';
        this.fullName = 'Bellsprout LM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Bellsprout = Bellsprout;

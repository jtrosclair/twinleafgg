"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lileep = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Lileep extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Unidentified Fossil';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Confuse Ray',
                cost: [G],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
            {
                name: 'Seed Bomb',
                cost: [G, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Lileep';
        this.fullName = 'Lileep CEC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Lileep = Lileep;

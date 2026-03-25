"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pyukumuku = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pyukumuku extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Collect',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Rain Splash',
                cost: [W, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '52';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pyukumuku';
        this.fullName = 'Pyukumuku UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Collect
        // Ref: set-unbroken-bonds/samson-oak.ts (draw cards pattern)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS)(player, 1);
        }
        return state;
    }
}
exports.Pyukumuku = Pyukumuku;

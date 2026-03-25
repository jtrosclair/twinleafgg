"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snorunt = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Snorunt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Powder Snow',
                cost: [W],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Headbutt',
                cost: [W, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '21';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Snorunt';
        this.fullName = 'Snorunt PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Snorunt = Snorunt;

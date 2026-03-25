"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Larvesta2 = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Larvesta2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Super Singe',
                cost: [R, C],
                damage: 10,
                text: 'The Defending Pokémon is now Burned.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '21';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Larvesta';
        this.fullName = 'Larvesta DEX 21';
    }
    reduceEffect(store, state, effect) {
        // Super Singe
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Larvesta2 = Larvesta2;

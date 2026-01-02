"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mareep = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mareep extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Jolt',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'DR';
        this.setNumber = '64';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mareep';
        this.fullName = 'Mareep DR';
    }
    reduceEffect(store, state, effect) {
        // Handle Jolt attack
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Mareep = Mareep;

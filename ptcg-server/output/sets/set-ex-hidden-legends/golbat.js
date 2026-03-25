"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golbat = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Golbat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zubat';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Supersonic',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Confused.'
            },
            {
                name: 'Sharp Fang',
                cost: [G, C],
                damage: 20,
                text: ''
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Golbat';
        this.fullName = 'Golbat HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Golbat = Golbat;

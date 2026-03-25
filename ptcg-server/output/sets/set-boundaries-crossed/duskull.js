"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duskull = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Duskull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: D }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Confuse Ray',
                cost: [P],
                damage: 0,
                text: 'The Defending Pokemon is now Confused.'
            }];
        this.set = 'BCR';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Duskull';
        this.fullName = 'Duskull BCR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Confuse Ray
        // Ref: set-boundaries-crossed/vileplume.ts (Pollen Spray)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Duskull = Duskull;

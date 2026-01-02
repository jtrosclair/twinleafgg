"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primarina = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Primarina extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = W;
        this.hp = 150;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Disarming Voice',
                cost: [W, C],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
            {
                name: 'Sparkling Aria',
                cost: [W, W, C],
                damage: 100,
                text: 'Heal 30 damage from this Pokémon.'
            }];
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Primarina';
        this.fullName = 'Primarina SUM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
        }
        return state;
    }
}
exports.Primarina = Primarina;

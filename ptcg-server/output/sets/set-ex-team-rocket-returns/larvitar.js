"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Larvitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Larvitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Light Punch',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Dig Drain',
                cost: [F, C],
                damage: 20,
                text: 'Remove 1 damage counter from Larvitar.'
            }];
        this.set = 'TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Larvitar';
        this.fullName = 'Larvitar TRR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 10);
        }
        return state;
    }
}
exports.Larvitar = Larvitar;

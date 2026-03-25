"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exploud = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Exploud extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Loudred';
        this.cardType = C;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Breaking Sound',
                cost: [C],
                damage: 0,
                text: 'Does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Bass Control',
                cost: [C, C],
                damage: 0,
                text: 'Does 30 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Thunderous Roar',
                cost: [C, C, C],
                damage: 30,
                text: 'The Defending Pokémon is now Confused.'
            },
            {
                name: 'Hyper Voice',
                cost: [C, C, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Exploud';
        this.fullName = 'Exploud HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON)(10, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(30, effect, store, state, 1, 1);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 2, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Exploud = Exploud;

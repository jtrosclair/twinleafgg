"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reuniclus2 = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Reuniclus2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Duosion';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dizzy Punch',
                cost: [P],
                damage: 30,
                text: ''
            },
            {
                name: 'Mind Bend',
                cost: [P, C, C],
                damage: 60,
                text: 'The Defending Pokémon is now Confused.'
            }
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Reuniclus';
        this.fullName = 'Reuniclus NVI 53';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Reuniclus2 = Reuniclus2;

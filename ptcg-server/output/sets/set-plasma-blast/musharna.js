"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Musharna = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Musharna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Munna';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Precognitive Dream',
                cost: [P],
                damage: 0,
                text: 'Draw 3 cards. This Pok\u00e9mon is now Asleep.'
            },
            {
                name: 'Psybeam',
                cost: [P, C, C],
                damage: 60,
                text: 'The Defending Pok\u00e9mon is now Confused.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '40';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Musharna';
        this.fullName = 'Musharna PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS)(player, 3);
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, player, this);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Musharna = Musharna;

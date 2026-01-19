"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirlia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kirlia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ralts';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flickering Flames',
                cost: [R, C],
                damage: 20,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Smack',
                cost: [R, C, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Kirlia';
        this.fullName = 'Kirlia DF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Kirlia = Kirlia;

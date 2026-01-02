"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelgon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shelgon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bagon';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Tight Jaw',
                cost: [R],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Combustion',
                cost: [R, C, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'DS';
        this.name = 'Shelgon';
        this.fullName = 'Shelgon DS 53';
        this.setNumber = '53';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Shelgon = Shelgon;

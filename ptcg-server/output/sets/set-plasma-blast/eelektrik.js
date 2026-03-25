"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eelektrik = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Eelektrik extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tynamo';
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Thunder Wave',
                cost: [L],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Headbutt',
                cost: [C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '32';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eelektrik';
        this.fullName = 'Eelektrik PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Eelektrik = Eelektrik;

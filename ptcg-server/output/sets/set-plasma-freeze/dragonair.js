"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonair = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Dragonair extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dratini';
        this.cardType = N;
        this.hp = 70;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Wrap',
                cost: [L],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Tail Smack',
                cost: [G, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '82';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dragonair';
        this.fullName = 'Dragonair PLF';
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
exports.Dragonair = Dragonair;

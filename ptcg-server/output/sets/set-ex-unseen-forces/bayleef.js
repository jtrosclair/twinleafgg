"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bayleef = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Bayleef extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chikorita';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Soothing Scent',
                cost: [C],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Razor Leaf',
                cost: [G, G, C],
                damage: 50,
                text: ''
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Bayleef';
        this.fullName = 'Bayleef UF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Bayleef = Bayleef;

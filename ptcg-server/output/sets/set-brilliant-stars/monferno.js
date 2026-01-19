"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monferno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Monferno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = R;
        this.evolvesFrom = 'Chimchar';
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Flare',
                cost: [R],
                damage: 30,
                text: ''
            },
            {
                name: 'Flamethrower',
                cost: [R, C],
                damage: 50,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Monferno';
        this.fullName = 'Monferno BRS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Monferno = Monferno;

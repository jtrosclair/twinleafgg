"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ivysaur = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Ivysaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bulbasaur';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sleep Seed',
                cost: [G, C],
                damage: 20,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Vine Whip',
                cost: [G, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'EX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Ivysaur';
        this.fullName = 'Ivysaur EX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Ivysaur = Ivysaur;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cascoon = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cascoon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wurmple';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Trading Places',
                cost: [G],
                damage: 0,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Cascoon';
        this.fullName = 'Cascoon M2a';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
        }
        return state;
    }
}
exports.Cascoon = Cascoon;

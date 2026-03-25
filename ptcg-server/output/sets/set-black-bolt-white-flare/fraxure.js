"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fraxure = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Fraxure extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Axew';
        this.cardType = N;
        this.hp = 100;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Bite',
                cost: [C],
                damage: 30,
                text: ''
            },
            {
                name: 'Boundless Power',
                cost: [F, M],
                damage: 90,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'BLK';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Fraxure';
        this.fullName = 'Fraxure SV11B';
    }
    reduceEffect(store, state, effect) {
        // Boundless Power
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Fraxure = Fraxure;

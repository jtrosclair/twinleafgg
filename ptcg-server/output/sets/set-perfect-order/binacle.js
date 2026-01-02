"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Binacle = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Binacle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Double Draw',
                cost: [F],
                damage: 0,
                text: 'Draw 2 cards.'
            },
            {
                name: 'Scratch',
                cost: [F, F],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Binacle';
        this.fullName = 'Binacle M3';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.DRAW_CARDS(player, 2);
            return state;
        }
        return state;
    }
}
exports.Binacle = Binacle;

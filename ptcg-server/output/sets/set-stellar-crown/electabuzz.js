"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electabuzz = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Electabuzz extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Collect',
                cost: [L],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Magnum Punch',
                cost: [L, L],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Electabuzz';
        this.fullName = 'Electabuzz SCR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        return state;
    }
}
exports.Electabuzz = Electabuzz;

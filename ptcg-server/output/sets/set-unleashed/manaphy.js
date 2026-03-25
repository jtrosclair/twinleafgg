"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manaphy = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Manaphy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [];
        this.attacks = [{
                name: 'Deep Sea Swirl',
                cost: [C],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw 5 cards.'
            },
            {
                name: 'Rain Splash',
                cost: [W],
                damage: 20,
                text: ''
            }];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Manaphy';
        this.fullName = 'Manaphy UL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, {});
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            (0, prefabs_1.DRAW_CARDS)(player, 5);
        }
        return state;
    }
}
exports.Manaphy = Manaphy;

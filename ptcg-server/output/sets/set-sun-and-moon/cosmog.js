"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cosmog = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cosmog extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Dust Gathering',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw a card.'
            }];
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Cosmog';
        this.fullName = 'Cosmog SUM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS)(player, 1);
            return state;
        }
        return state;
    }
}
exports.Cosmog = Cosmog;

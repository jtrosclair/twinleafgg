"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slugma = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Slugma extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesInto = 'Magcargo';
        this.attacks = [{
                name: 'Singe',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Your opponent\'s Active Pokemon is now Burned.'
            }];
        this.set = 'CEC';
        this.name = 'Slugma';
        this.fullName = 'Slugma CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Slugma = Slugma;

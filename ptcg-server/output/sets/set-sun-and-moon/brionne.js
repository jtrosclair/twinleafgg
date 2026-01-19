"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brionne = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Brionne extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Wave Splash',
                cost: [W, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Disarming Voice',
                cost: [W, W, C],
                damage: 50,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }];
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Brionne';
        this.fullName = 'Brionne SUM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Brionne = Brionne;

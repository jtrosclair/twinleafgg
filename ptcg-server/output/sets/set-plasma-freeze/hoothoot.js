"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoothoot = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hoothoot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Dual Draw',
                cost: [C],
                damage: 0,
                text: 'Each player draws 2 cards.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '91';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hoothoot';
        this.fullName = 'Hoothoot PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.DRAW_CARDS)(player, 2);
            (0, prefabs_1.DRAW_CARDS)(opponent, 2);
        }
        return state;
    }
}
exports.Hoothoot = Hoothoot;

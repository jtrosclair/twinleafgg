"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialga = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Dialga extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Turn Back Time',
                cost: [M, C, C],
                damage: 60,
                text: 'If your opponent\'s Active Pokémon is an evolved Pokémon, devolve it by putting the highest Stage Evolution card on it into your opponent\'s hand.'
            },
            {
                name: 'Power Blast',
                cost: [M, M, C, C],
                damage: 130,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '127';
        this.name = 'Dialga';
        this.fullName = 'Dialga LOT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.DEVOLVE_POKEMON)(store, state, opponent.active, opponent.hand);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Dialga = Dialga;

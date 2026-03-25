"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bouffalant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bouffalant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Revenge',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 70 more damage.'
            },
            {
                name: 'Head Charge',
                cost: [C, C, C, C],
                damage: 80,
                text: 'Bouffalant does 10 damage to itself.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Bouffalant';
        this.fullName = 'Bouffalant BLW 91';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent took prizes on their last turn
            if (opponent.prizesTakenLastTurn > 0) {
                effect.damage += 70;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Bouffalant = Bouffalant;

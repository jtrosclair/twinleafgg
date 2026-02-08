"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaFeraligatrex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaFeraligatrex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Croconaw';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 370;
        this.weakness = [{ type: L }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Mortal Crunch',
                cost: [W, W, C],
                damage: 200,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 200 more damage.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Mega Feraligatr ex';
        this.fullName = 'Mega Feraligatr ex MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage = 200 + 200;
            }
            else {
                effect.damage = 200;
            }
        }
        return state;
    }
}
exports.MegaFeraligatrex = MegaFeraligatrex;

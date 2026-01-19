"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accelgor = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Accelgor extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shelmet';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Poisonous Ploy',
                cost: [G, C],
                damage: 70,
                text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned. Switch this Pokémon with 1 of your Benched Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Accelgor';
        this.fullName = 'Accelgor JTG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
        }
        return state;
    }
}
exports.Accelgor = Accelgor;

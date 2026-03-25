"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Butterfree = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Butterfree extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Metapod';
        this.cardType = G;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Tricolored Scales',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may make your opponent\'s Active Pokémon Burned, Confused, and Poisoned.'
            }
        ];
        this.attacks = [
            {
                name: 'Gust',
                cost: [G, C],
                damage: 90,
                text: ''
            },
        ];
        this.set = 'FST';
        this.regulationMark = 'E';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Butterfree';
        this.fullName = 'Butterfree FST';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this) && !(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, effect.player, this)) {
            if ((0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                    (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            })) {
                return state;
            }
        }
        return state;
    }
}
exports.Butterfree = Butterfree;

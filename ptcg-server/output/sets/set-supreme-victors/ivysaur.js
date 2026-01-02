"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ivysaur = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ivysaur extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bulbasaur';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R, value: +20 }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Evolutionary Pollen',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Ivysaur from your hand to evolve 1 of your Pokémon, you may use this power. Your opponent\'s Active Pokémon is now Asleep.'
            }
        ];
        this.attacks = [
            {
                name: 'Cut',
                cost: [G, C, C],
                damage: 50,
                text: ''
            },
        ];
        this.set = 'SV';
        this.setNumber = '62';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ivysaur';
        this.fullName = 'Ivysaur SV';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.JUST_EVOLVED(effect, this) && !prefabs_1.IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
            if (prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            })) {
                return state;
            }
        }
        return state;
    }
}
exports.Ivysaur = Ivysaur;

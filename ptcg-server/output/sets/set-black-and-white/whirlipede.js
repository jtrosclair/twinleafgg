"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whirlipede = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Whirlipede extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Venipede';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Toxic Claws',
                cost: [P, C],
                damage: 30,
                text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
            },
            {
                name: 'Steamroller',
                cost: [P, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Whirlipede';
        this.fullName = 'Whirlipede BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this, 20);
        }
        return state;
    }
}
exports.Whirlipede = Whirlipede;

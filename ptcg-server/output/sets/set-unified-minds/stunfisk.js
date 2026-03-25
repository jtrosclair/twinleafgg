"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stunfisk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Stunfisk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Trap Bolt',
                cost: [F],
                damage: 30,
                damageCalculation: '+',
                text: 'If, before doing damage, your opponent\'s Active Pokémon has more remaining HP than this Pokémon, this attack does 30 more damage.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Stunfisk';
        this.fullName = 'Stunfisk UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Trap Bolt
        // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - conditional bonus damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Get opponent's active remaining HP
            const checkHp = new check_effects_1.CheckHpEffect(opponent, opponent.active);
            store.reduceEffect(state, checkHp);
            const opponentRemainingHp = checkHp.hp - opponent.active.damage;
            // Get this Pokemon's remaining HP
            const checkMyHp = new check_effects_1.CheckHpEffect(player, player.active);
            store.reduceEffect(state, checkMyHp);
            const myRemainingHp = checkMyHp.hp - player.active.damage;
            if (opponentRemainingHp > myRemainingHp) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Stunfisk = Stunfisk;

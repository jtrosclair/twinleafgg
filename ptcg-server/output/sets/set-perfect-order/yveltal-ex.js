"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltalex = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yveltalex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 210;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Death Soul',
                cost: [D, D, C],
                damage: 0,
                text: 'Knock Out each of your opponent\'s Pokemon that has 50 HP or less remaining.'
            },
            {
                name: 'Dark Strike',
                cost: [D, D, C],
                damage: 210,
                text: 'During your next turn, this Pokemon can\'t use Dark Strike.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.usSetNumber = 'POR 53';
        this.name = 'Yveltal ex';
        this.fullName = 'Yveltal ex M3';
    }
    reduceEffect(store, state, effect) {
        // Death Soul - KO opponent's Pokemon with ≤50 HP remaining
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check all opponent's Pokemon
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                const remainingHp = checkHpEffect.hp - cardList.damage;
                if (remainingHp <= 50) {
                    const koEffect = new game_effects_1.KnockOutEffect(opponent, cardList);
                    store.reduceEffect(state, koEffect);
                }
            });
        }
        // Dark Strike - cannot use next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Dark Strike')) {
                player.active.cannotUseAttacksNextTurnPending.push('Dark Strike');
            }
        }
        return state;
    }
}
exports.Yveltalex = Yveltalex;

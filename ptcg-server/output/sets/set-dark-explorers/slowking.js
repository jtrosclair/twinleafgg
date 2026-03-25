"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowking = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Slowking extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slowpoke';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Psy Bolt',
                cost: [P],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Hand Press',
                cost: [P, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If you have more cards in your hand than your opponent, this attack does 30 more damage.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '49';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slowking';
        this.fullName = 'Slowking DEX';
    }
    reduceEffect(store, state, effect) {
        // Psy Bolt - flip coin for paralysis
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        // Hand Press - bonus damage if more cards in hand
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const playerHandSize = player.hand.cards.length;
            const opponentHandSize = opponent.hand.cards.length;
            if (playerHandSize > opponentHandSize) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Slowking = Slowking;

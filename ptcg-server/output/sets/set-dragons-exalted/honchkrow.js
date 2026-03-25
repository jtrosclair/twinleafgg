"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Honchkrow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Honchkrow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Murkrow';
        this.cardType = D;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Whirlwind',
                cost: [C, C],
                damage: 30,
                text: 'You may have your opponent switch the Defending Pokémon with 1 of his or her Benched Pokémon.'
            },
            {
                name: 'Diving Swipe',
                cost: [D, C, C],
                damage: 70,
                text: 'Discard a random card from your opponent\'s hand.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '73';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Honchkrow';
        this.fullName = 'Honchkrow DRX';
        this.usedWhirlwind = false;
        this.wantsToSwitch = false;
    }
    reduceEffect(store, state, effect) {
        // Whirlwind - optional opponent switch after damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
            if (opponentHasBench) {
                this.usedWhirlwind = true;
                (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                    this.wantsToSwitch = result;
                });
            }
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedWhirlwind) {
            this.usedWhirlwind = false;
            if (this.wantsToSwitch) {
                this.wantsToSwitch = false;
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedWhirlwind = false;
            this.wantsToSwitch = false;
        }
        // Diving Swipe - discard random card from opponent's hand
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const cardToDiscard = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(cardToDiscard, opponent.discard);
            }
        }
        return state;
    }
}
exports.Honchkrow = Honchkrow;

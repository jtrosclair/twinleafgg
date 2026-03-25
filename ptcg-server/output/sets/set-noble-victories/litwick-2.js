"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litwick2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Litwick2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Astonish',
                cost: [P],
                damage: 10,
                text: 'Choose 1 card from your opponent\'s hand without looking and shuffle it into your opponent\'s deck.'
            },
            {
                name: 'Ambush',
                cost: [P, C],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 20 more damage. If tails, switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '58';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Litwick';
        this.fullName = 'Litwick NVI 58';
        this.shouldSwitch = false;
    }
    reduceEffect(store, state, effect) {
        // Astonish - shuffle random card from opponent's hand into deck
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length > 0) {
                // Pick random card
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const card = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(card, opponent.deck);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                    opponent.deck.applyOrder(order);
                });
            }
        }
        // Ambush - flip, heads = +20, tails = switch self
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, (result) => {
                if (result) {
                    effect.damage += 20;
                }
                else {
                    this.shouldSwitch = true;
                }
            });
        }
        // After attack, switch self if tails
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.shouldSwitch) {
            this.shouldSwitch = false;
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            }
        }
        // Cleanup
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.shouldSwitch) {
            this.shouldSwitch = false;
        }
        return state;
    }
}
exports.Litwick2 = Litwick2;

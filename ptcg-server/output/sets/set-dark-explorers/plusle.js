"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plusle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Plusle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tag Draw',
                cost: [C],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw 4 cards. If Minun is on your Bench, draw 4 more cards.'
            }, {
                name: 'Positive Ion',
                cost: [L],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            }];
        this.set = 'DEX';
        this.setNumber = '39';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Plusle';
        this.fullName = 'Plusle DEX';
    }
    reduceEffect(store, state, effect) {
        // Tag Draw - shuffle hand into deck, draw 4 (or 8 if Minun on Bench)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Shuffle hand into deck
            const handCards = player.hand.cards.slice();
            if (handCards.length > 0) {
                (0, prefabs_1.SHUFFLE_CARDS_INTO_DECK)(store, state, player, handCards);
            }
            // Check if Minun is on the bench
            const hasMinun = player.bench.some(b => { var _a; return ((_a = b.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Minun'; });
            // Draw 4 cards (or 8 if Minun is on Bench)
            const cardsToDraw = hasMinun ? 8 : 4;
            (0, prefabs_1.DRAW_CARDS)(player, cardsToDraw);
        }
        // Positive Ion - flip a coin, if heads +10 damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Plusle = Plusle;

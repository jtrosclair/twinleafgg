"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Darmanitan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
class Darmanitan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Darumaka';
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Synchrodraw',
                cost: [P],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw a number of cards equal to the number of cards in your opponent\'s hand.'
            },
            {
                name: 'DarMAXitan',
                cost: [C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 50 damage times the number of heads.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '60';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Darmanitan';
        this.fullName = 'Darmanitan NXD';
    }
    reduceEffect(store, state, effect) {
        // Synchrodraw - shuffle hand, draw equal to opponent's hand
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentHandSize = opponent.hand.cards.length;
            // Shuffle hand into deck
            const cardsToShuffle = player.hand.cards.slice();
            player.hand.moveCardsTo(cardsToShuffle, player.deck);
            return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
                // Draw cards equal to opponent's hand size
                if (opponentHandSize > 0) {
                    (0, prefabs_1.DRAW_CARDS)(player, opponentHandSize);
                }
            });
        }
        // DarMAXitan - flip coins for each energy attached
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const energyCount = player.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY).length;
            if (energyCount === 0) {
                effect.damage = 0;
                return state;
            }
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, energyCount, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.Darmanitan = Darmanitan;

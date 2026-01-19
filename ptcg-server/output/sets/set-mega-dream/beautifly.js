"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beautifly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Beautifly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Silcoon';
        this.cardType = G;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Stun Spore',
                cost: [G],
                damage: 40,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Energy Straw',
                cost: [G],
                damage: 80,
                damageCalculation: 'x',
                text: 'Your opponent reveals their hand, and this attack does 80 damage for each Energy card you find there.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Beautifly';
        this.fullName = 'Beautifly M2a';
    }
    reduceEffect(store, state, effect) {
        // Stun Spore - coin flip for paralysis
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        // Energy Straw - reveal hand and count Energy cards
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Reveal opponent's hand
            state = store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                // Count Energy cards in opponent's hand
                let energyCount = 0;
                opponent.hand.cards.forEach(card => {
                    if (card instanceof game_1.EnergyCard) {
                        energyCount++;
                    }
                });
                // Calculate damage: 80 per Energy card
                effect.damage = 80 * energyCount;
            });
        }
        return state;
    }
}
exports.Beautifly = Beautifly;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailord = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const effect_of_attack_effects_1 = require("../../game/store/effects/effect-of-attack-effects");
class Wailord extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wailmer';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Dive',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
            },
            {
                name: 'Open Sea',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'Heal 30 damage from each of your Water Pokémon.'
            }
        ];
        this.set = 'GRI';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Wailord';
        this.fullName = 'Wailord GRI';
    }
    reduceEffect(store, state, effect) {
        // Dive attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    const preventEffect = (0, effect_of_attack_effects_1.preventDamageEffect)(effect, this);
                    store.reduceEffect(state, preventEffect);
                }
                return state;
            });
        }
        // Open Sea attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                // Only heal Water Pokémon
                if (card && card.cardType === card_types_1.CardType.WATER) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 30);
                    store.reduceEffect(state, healEffect);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Wailord = Wailord;

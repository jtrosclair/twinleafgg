"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beedrill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Beedrill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.name = 'Beedrill';
        this.fullName = 'Beedrill BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.evolvesFrom = 'Kakuna';
        this.weakness = [{
                type: card_types_1.CardType.FIRE
            }];
        this.resistance = [{
                type: card_types_1.CardType.FIGHTING,
                value: -30
            }];
        this.attacks = [
            {
                name: 'Twineedle',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'Poison Sting',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 40,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
                new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP)
            ], (results) => {
                const heads = results.filter(r => !!r).length;
                effect.damage = 30 * heads;
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Beedrill = Beedrill;

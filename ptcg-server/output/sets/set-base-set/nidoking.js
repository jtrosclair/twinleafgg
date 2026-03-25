"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidoking = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
class Nidoking extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.name = 'Nidoking';
        this.fullName = 'Nidoking BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Thrash',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If heads, this attack does 30 damage plus 10 more damage; if tails, this attack does 30 damage plus Nidoking does 10 damage to itself.'
            },
            {
                name: 'Toxic',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 20,
                text: 'The Defending Pokémon is now Poisoned. It now takes 20 Poison damage instead of 10 after each player\'s turn (even if it was already Poisoned).'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.FLIP_COIN), (heads) => {
                if (heads) {
                    effect.damage += 10;
                }
                else {
                    const selfDamage = new attack_effects_1.DealDamageEffect(effect, 10);
                    selfDamage.target = effect.player.active;
                    store.reduceEffect(state, selfDamage);
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this, 20);
        }
        return state;
    }
}
exports.Nidoking = Nidoking;

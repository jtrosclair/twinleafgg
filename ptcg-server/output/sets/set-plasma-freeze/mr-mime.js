"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrMime = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MrMime extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Bench Barrier',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to your Benched Pokemon by attacks.'
            }];
        this.attacks = [{
                name: 'Psy Bolt',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
            }];
        this.set = 'PLF';
        this.name = 'Mr. Mime';
        this.fullName = 'Mr. Mime PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            // Find the owner of the target (the defending player)
            const defendingPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            // Find the owner of the source (the attacking player)
            const attackingPlayer = state_utils_1.StateUtils.findOwner(state, effect.source);
            // Only prevent if the effect is coming from the opponent
            if (attackingPlayer === defendingPlayer) {
                return state;
            }
            // Only prevent if the target is on the bench (not active)
            if (effect.target === defendingPlayer.active) {
                return state;
            }
            // Check if Manaphy is in play on the defending player's field
            let isManaphyInPlay = false;
            defendingPlayer.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card instanceof MrMime) {
                    isManaphyInPlay = true;
                }
            });
            if (!isManaphyInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(defendingPlayer, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.MrMime = MrMime;

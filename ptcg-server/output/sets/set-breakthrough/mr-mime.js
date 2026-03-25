"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrMime = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MrMime extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Bench Barrier',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all damage done to your Benched Pokemon by attacks.'
            }];
        this.attacks = [{
                name: 'Juggling',
                cost: [Y, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 10 damage times the number of heads.'
            }];
        this.set = 'BKT';
        this.name = 'Mr. Mime';
        this.fullName = 'Mr. Mime BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 10 * heads;
            });
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            // Find the owner of the target (the defending player)
            const defendingPlayer = game_1.StateUtils.findOwner(state, effect.target);
            // Find the owner of the source (the attacking player)
            const attackingPlayer = game_1.StateUtils.findOwner(state, effect.source);
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
            defendingPlayer.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
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
                    powerType: game_1.PowerType.ABILITY,
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

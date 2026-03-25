"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slakoth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slakoth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Claw',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If tails, this attack does nothing. '
            },
            {
                name: 'Slack Off',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Heal all damage from this Pokémon. It can\'t attack during your next turn.'
            }];
        this.set = 'CES';
        this.setNumber = '113';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slakoth';
        this.fullName = 'Slakoth CES';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
            ], heads => {
                if (heads) {
                    effect.damage = 0;
                }
            });
        }
        // Slack Off
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
            const healEffect = new game_effects_1.HealEffect(player, player.active, player.active.damage);
            state = store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Slakoth = Slakoth;

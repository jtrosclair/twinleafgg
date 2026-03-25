"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flareon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Flareon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Sand-Attack',
                cost: [C],
                damage: 20,
                text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
            },
            {
                name: 'Fire Slash',
                cost: [R, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'You may discard a [R] Energy attached to this Pokémon. If you do, this attack does 30 more damage.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '12';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Flareon';
        this.fullName = 'Flareon DEX';
    }
    reduceEffect(store, state, effect) {
        // Sand-Attack - mark opponent's active
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(game_1.PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
            opponent.marker.addMarker(game_1.PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
        }
        // Block attacks if marked - coin flip
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this)) {
            const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(effect.player, (result) => {
                if (result === false) {
                    effect.preventDefault = true;
                }
            });
            return store.reduceEffect(state, coinFlipEffect);
        }
        // Clear marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(game_1.PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(game_1.PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
            });
        }
        // Fire Slash - may discard Fire energy for +30
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const hasFireEnergy = player.active.cards.some(c => {
                var _a;
                return c.superType === card_types_1.SuperType.ENERGY &&
                    ((_a = c.provides) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardType.FIRE));
            });
            if (hasFireEnergy) {
                return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_DEAL_MORE_DAMAGE), result => {
                    if (result) {
                        const fireEnergy = player.active.cards.find(c => {
                            var _a;
                            return c.superType === card_types_1.SuperType.ENERGY &&
                                ((_a = c.provides) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardType.FIRE));
                        });
                        if (fireEnergy) {
                            player.active.moveCardTo(fireEnergy, player.discard);
                            effect.damage += 30;
                        }
                    }
                });
            }
        }
        return state;
    }
}
exports.Flareon = Flareon;

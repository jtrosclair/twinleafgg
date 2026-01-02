"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lombre = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lombre extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lotad';
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Rain Dish',
                powerType: game_1.PowerType.POKEBODY,
                text: 'At any time between turns, remove 1 damage counter from Lombre.'
            }];
        this.attacks = [{
                name: 'Double Scratch',
                cost: [W, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
            }];
        this.set = 'SS';
        this.setNumber = '45';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lombre';
        this.fullName = 'Lombre SS';
    }
    reduceEffect(store, state, effect) {
        // Handle Rain Dish Poké-Body
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            if (!prefabs_1.IS_POKEBODY_BLOCKED) {
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                                state = store.reduceEffect(state, healEffect);
                            }
                        });
                    }
                });
            }
            return state;
        }
        // Handle Double Scratch attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let heads = 0;
            // First coin flip
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN), result => {
                if (result) {
                    heads++;
                }
            });
            // Second coin flip
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN), result => {
                if (result) {
                    heads++;
                }
                effect.damage = 30 * heads;
                return state;
            });
        }
        return state;
    }
}
exports.Lombre = Lombre;

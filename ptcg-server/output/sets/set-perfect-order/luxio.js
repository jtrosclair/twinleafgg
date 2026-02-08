"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxio = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Luxio extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shinx';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Roar of the Tiger',
                powerType: game_1.PowerType.ABILITY,
                text: 'If your opponent\'s Active Pokemon is a Pokemon ex, you can evolve this Pokemon on your first turn, or on the first turn this Pokemon is put into play.'
            }];
        this.attacks = [{
                name: 'Zzzap',
                cost: [L, C],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Luxio';
        this.fullName = 'Luxio M3';
    }
    reduceEffect(store, state, effect) {
        // Roar of the Tiger - can evolve on first turn if opponent's Active is ex
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const player = state.players[state.activePlayer];
            if (player.active.cards[0] == this) {
                const opponent = game_1.StateUtils.getOpponent(state, player);
                const opponentActive = opponent.active.getPokemonCard();
                if (opponentActive && opponentActive.tags.includes(game_1.CardTag.POKEMON_ex)) {
                    try {
                        const stub = new game_effects_1.PowerEffect(player, {
                            name: 'test',
                            powerType: game_1.PowerType.ABILITY,
                            text: ''
                        }, this);
                        store.reduceEffect(state, stub);
                    }
                    catch (_a) {
                        return state;
                    }
                    // Allow evolution on first turn or first turn this Pokemon is put into play
                    if (state.turn === 1 || state.turn === 2) {
                        player.canEvolve = true;
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this || cardList.cards.some(c => c.name === 'Shinx')) {
                                cardList.pokemonPlayedTurn = state.turn - 1;
                            }
                        });
                    }
                }
            }
            return state;
        }
        return state;
    }
}
exports.Luxio = Luxio;

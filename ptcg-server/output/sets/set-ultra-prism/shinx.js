"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shinx = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Shinx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Evolutionary Advantage',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you go second, this Pokémon can evolve during your first turn.',
            }];
        this.attacks = [{ name: 'Static Shock', cost: [L], damage: 10, text: '' }];
        this.set = 'UPR';
        this.name = 'Shinx';
        this.fullName = 'Shinx UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const player = state.players[state.activePlayer];
            if (state.turn === 2) {
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
                player.canEvolve = true;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.pokemonPlayedTurn = state.turn - 1;
                    }
                });
            }
            return state;
        }
        return state;
    }
}
exports.Shinx = Shinx;

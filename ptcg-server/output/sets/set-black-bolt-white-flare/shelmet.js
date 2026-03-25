"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelmet = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shelmet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Stimulated Evolution',
                text: 'If you have Karrablast in play, this Pokémon can evolve during your first turn or the turn you play it.',
                powerType: game_1.PowerType.ABILITY
            }];
        this.attacks = [{
                name: 'Headbutt Bounce',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'WHT';
        this.regulationMark = 'I';
        this.name = 'Shelmet';
        this.fullName = 'Shelmet WHT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.canEvolve = false;
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (!player.bench.some(b => { var _a; return ((_a = b.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Karrablast'; }) && ((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'Karrablast') {
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
}
exports.Shelmet = Shelmet;

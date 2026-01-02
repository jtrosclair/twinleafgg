"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unown = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Unown extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'CURE',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Unown from your hand onto your Bench, remove all Special Conditions from your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Hidden Power',
                cost: [P],
                damage: 10,
                text: ''
            }];
        this.set = 'TM';
        this.name = 'Unown';
        this.fullName = 'Unown TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if (prefabs_1.IS_POKEPOWER_BLOCKED(store, state, player, this)) {
                return state;
            }
            const conditions = player.active.specialConditions.slice();
            conditions === null || conditions === void 0 ? void 0 : conditions.forEach(condition => {
                player.active.removeSpecialCondition(condition);
            });
        }
        return state;
    }
}
exports.Unown = Unown;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pidgey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Peck Off',
                cost: [C],
                damage: 10,
                text: 'Before doing damage, discard all Pokémon Tool cards attached to your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'FLF';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pidgey';
        this.fullName = 'Pidgey FLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard active Pokemon's tool first
            const activePokemon = opponent.active;
            if (activePokemon.tools.length > 0) {
                // Discard all tools attached to the opponent's active Pokémon
                for (const tool of [...activePokemon.tools]) {
                    activePokemon.moveCardTo(tool, opponent.discard);
                }
            }
        }
        return state;
    }
}
exports.Pidgey = Pidgey;

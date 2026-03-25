"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basculin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Basculin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bite',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Bared Fangs',
                cost: [W, C],
                damage: 60,
                text: 'If the Defending Pokémon has no damage counters on it, this attack does nothing.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Basculin';
        this.fullName = 'Basculin NXD';
    }
    reduceEffect(store, state, effect) {
        // Bared Fangs - only works if defender has damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if defending Pokémon has damage
            if (opponent.active.damage === 0) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.Basculin = Basculin;

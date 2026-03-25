"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Krookodile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Krookodile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Krokorok';
        this.cardType = D;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Dark Clamp',
                cost: [D, C, C],
                damage: 60,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Bombast',
                cost: [D, D, C, C],
                damage: 0,
                damageCalculation: 'x',
                text: 'Does 40 damage times the number of Prize cards you have taken.'
            }
        ];
        this.set = 'DEX';
        this.name = 'Krookodile';
        this.fullName = 'Krookodile DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
    }
    reduceEffect(store, state, effect) {
        // Dark Clamp - prevent retreat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        // Handle marker-based retreat blocking
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        // Bombast - damage based on prizes taken
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Count prize cards taken (6 total minus remaining)
            const prizesTaken = 6 - player.getPrizeLeft();
            effect.damage = 40 * prizesTaken;
        }
        return state;
    }
}
exports.Krookodile = Krookodile;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KrookodileEx = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class KrookodileEx extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Krokorok';
        this.hp = 320;
        this.cardType = D;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Corner',
                cost: [D, C],
                damage: 80,
                text: "During your opponent's next turn, the Defending Pokémon can't retreat.",
            },
            {
                name: 'Strong Bite',
                cost: [D, D, C],
                damage: 140,
                damageCalculation: '+',
                text: 'If this Pokémon has a Pokémon Tool attached, this attack does 140 more damage.',
            },
        ];
        this.regulationMark = 'I';
        this.set = 'CRI';
        this.usSetNumber = 'CRI 55';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Krookodile ex';
        this.fullName = 'Krookodile ex CRI';
    }
    reduceEffect(store, state, effect) {
        // Corner
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_2.BLOCK_RETREAT)(store, state, effect, this);
        }
        // Strong Bite
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.active.tools.length > 0) {
                // Upstream used 90 here, contradicting its printed 140 bonus.
                effect.damage += 140;
            }
        }
        (0, prefabs_2.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_2.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.KrookodileEx = KrookodileEx;

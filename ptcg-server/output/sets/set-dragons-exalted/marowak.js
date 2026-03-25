"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marowak = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Marowak extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cubone';
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bone Lock',
                cost: [F],
                damage: 30,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Vortex Chop',
                cost: [F, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If the Defending Pokémon has any Resistance, this attack does 30 more damage.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Marowak';
        this.fullName = 'Marowak DRX';
    }
    reduceEffect(store, state, effect) {
        // Bone Lock - prevent retreat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        // Vortex Chop - more damage if Defending has Resistance
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const target = opponent.active.getPokemonCard();
            if (target && target.resistance !== undefined && target.resistance.length > 0) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Marowak = Marowak;

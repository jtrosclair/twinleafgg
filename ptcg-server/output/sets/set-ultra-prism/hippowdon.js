"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hippowdon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Hippowdon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hippopotas';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Sand Tomb',
                cost: [F, C, C],
                damage: 50,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Dust Cannon',
                cost: [F, F, C, C],
                damage: 100,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each Colorless in your opponent\'s Active Pokémon\'s Retreat Cost.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '69';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hippowdon';
        this.fullName = 'Hippowdon UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Sand Tomb
        // Ref: set-x-and-y/scolipede.ts (Poison Ring - BLOCK_RETREAT 3-call pattern)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        // Attack 2: Dust Cannon
        // Ref: set-breakpoint/ferrothorn.ts (Spike Lash - CheckRetreatCostEffect)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkRetreat = new check_effects_1.CheckRetreatCostEffect(opponent);
            store.reduceEffect(state, checkRetreat);
            const colorlessCount = checkRetreat.cost.length;
            effect.damage += 10 * colorlessCount;
        }
        return state;
    }
}
exports.Hippowdon = Hippowdon;

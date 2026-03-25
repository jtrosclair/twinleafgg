"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Druddigon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Druddigon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.retreat = [C, C];
        this.powers = [{
                name: 'Rough Skin',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), put 2 damage counters on the Attacking Pokémon.'
            }];
        this.attacks = [{
                name: 'Clutch',
                cost: [C, C, C],
                damage: 60,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'NVI';
        this.setNumber = '89';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Druddigon';
        this.fullName = 'Druddigon NVI';
    }
    reduceEffect(store, state, effect) {
        // Rough Skin - damage attacker when hit
        if ((0, prefabs_1.ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT)(state, effect, { source: this })) {
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            // Legacy implementation:
            // - Checked AfterDamageEffect, damage > 0, active-spot requirement, opponent source, and attack phase.
            // - Then placed 2 damage counters on the attacker.
            //
            // Converted to prefab version (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT).
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetPlayer, this)) {
                return state;
            }
            effect.source.damage += 20;
        }
        // Clutch - prevent retreat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        // Handle marker-based retreat blocking
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Druddigon = Druddigon;

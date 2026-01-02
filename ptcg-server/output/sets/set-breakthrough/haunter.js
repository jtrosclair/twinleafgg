"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Haunter extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Gothic Fear',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, you may leave both Active Pokémon Confused.'
            }];
        this.attacks = [{
                name: 'Poison Ring',
                cost: [P, C],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. That Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Haunter';
        this.fullName = 'Haunter BKT';
        this.POISON_RING_MARKER = 'POISON_RING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.JUST_EVOLVED(effect, this) && !prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (!result) {
                    return state;
                }
                prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
                prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
            return prefabs_1.BLOCK_RETREAT(store, state, effect, this);
        }
        prefabs_1.BLOCK_RETREAT_IF_MARKER(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Haunter = Haunter;

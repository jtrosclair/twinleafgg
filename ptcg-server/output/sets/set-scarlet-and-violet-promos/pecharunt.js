"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pecharunt = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Pecharunt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Toxic Subjugation',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, put 5 more damage counters on your opponent\'s Poisoned Pokémon during Pokémon Checkup.'
            }];
        this.attacks = [{
                name: 'Poison Chain',
                cost: [D, C],
                damage: 10,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. During your opponent\'s next turn, that Pokémon can\'t retreat.'
            }];
        this.regulationMark = 'H';
        this.set = 'SVP';
        this.name = 'Pecharunt';
        this.fullName = 'Pecharunt SVP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
    }
    reduceEffect(store, state, effect) {
        // Toxic Subjugation
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const currentPlayer = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, currentPlayer);
            let pecharuntOwner = null;
            [currentPlayer, opponent].forEach(player => {
                if (player.active.cards[0] === this) {
                    pecharuntOwner = player;
                }
            });
            if (!pecharuntOwner) {
                return state;
            }
            try {
                const stub = new game_effects_1.PowerEffect(pecharuntOwner, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const pecharuntOpponent = game_1.StateUtils.getOpponent(state, pecharuntOwner);
            if (effect.player === pecharuntOpponent && pecharuntOpponent.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                effect.poisonDamage += 50;
            }
        }
        // Poison Chain
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
            return prefabs_1.BLOCK_RETREAT(store, state, effect, this);
        }
        prefabs_1.BLOCK_RETREAT_IF_MARKER(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Pecharunt = Pecharunt;

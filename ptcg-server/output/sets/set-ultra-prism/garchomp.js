"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garchomp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Garchomp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gabite';
        this.cardType = N;
        this.hp = 150;
        this.weakness = [{ type: Y }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Quick Dive',
                cost: [C, C],
                damage: 0,
                text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Royal Blades',
                cost: [F, C, C],
                damage: 100,
                damageCalculation: '+',
                text: 'If you played Cynthia from your hand during this turn, this attack does 100 more damage.'
            }
        ];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.name = 'Garchomp';
        this.fullName = 'Garchomp UPR';
        this.CYNTHIA_MARKER = 'CYNTHIA_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(50, effect, store, state);
        }
        // Track if we played Cynthia this turn
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard.name == 'Cynthia') {
            // Put a "played Cynthia this turn" marker on ourselves.
            const player = effect.player;
            prefabs_1.ADD_MARKER(this.CYNTHIA_MARKER, player, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CYNTHIA_MARKER, this)) {
            // Remove marker at the end of turn.
            effect.player.marker.removeMarker(this.CYNTHIA_MARKER);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (prefabs_1.HAS_MARKER(this.CYNTHIA_MARKER, effect.player, this)) {
                effect.damage += 100;
            }
        }
        return state;
    }
}
exports.Garchomp = Garchomp;

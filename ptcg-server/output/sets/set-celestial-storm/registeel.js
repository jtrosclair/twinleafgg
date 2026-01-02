"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registeel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Registeel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Exoskeleton',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon takes 20 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Silver Fist',
                cost: [M, C, C],
                damage: 60,
                text: 'If your opponent\'s Active Pokémon has an Ability, this attack does 60 more damage.'
            }];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Registeel';
        this.fullName = 'Registeel CES';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.getPokemonCard() === this) {
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            effect.damage -= 20;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, opponent, opponentActive)) {
                    prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 60);
                }
            }
        }
        return state;
    }
}
exports.Registeel = Registeel;

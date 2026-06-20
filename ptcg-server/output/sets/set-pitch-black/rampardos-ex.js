"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rampardosex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Rampardosex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Cranidos';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 330;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Destructive Headbutt',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may flip a coin. If heads, discard 1 Energy from your opponent\'s Active Pokémon.',
            }];
        this.attacks = [{
                name: 'Rampaging Hammer',
                cost: [F, F],
                damage: 150,
                text: 'During your next turn, attacks used by this Pokémon deal 150 more damage to your opponent\'s Active Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '43';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rampardos ex';
        this.fullName = 'Rampardos ex M5';
        this.DESTRUCTIVE_HEADBUTT_MARKER = 'RAMPARDOS_EX_DESTRUCTIVE_HEADBUTT_MARKER';
        this.RAMPAGING_HAMMER_MARKER = 'RAMPARDOS_EX_RAMPAGING_HAMMER_MARKER';
        this.CLEAR_RAMPAGING_HAMMER_MARKER = 'RAMPARDOS_EX_CLEAR_RAMPAGING_HAMMER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.DESTRUCTIVE_HEADBUTT_MARKER, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result && opponent.active.cards.length > 0) {
                    const attackStub = new game_effects_1.AttackEffect(player, opponent, this.attacks[0]);
                    (0, attack_effects_2.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, attackStub);
                }
                (0, prefabs_1.ABILITY_USED)(player, this);
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.DESTRUCTIVE_HEADBUTT_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.player.marker.addMarker(this.RAMPAGING_HAMMER_MARKER, this);
        }
        // Ref: set-cosmic-eclipse/herdier.ts (Work Up)
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source) {
            const attacker = effect.player;
            const opp = game_1.StateUtils.getOpponent(state, attacker);
            if ((attacker.marker.hasMarker(this.RAMPAGING_HAMMER_MARKER, this)
                || attacker.marker.hasMarker(this.CLEAR_RAMPAGING_HAMMER_MARKER, this))
                && effect.source.cards.includes(this)
                && effect.source.getPokemonCard() === this
                && effect.target === opp.active) {
                effect.damage += 150;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.CLEAR_RAMPAGING_HAMMER_MARKER, this);
            (0, prefabs_1.REPLACE_MARKER_AT_END_OF_TURN)(effect, this.RAMPAGING_HAMMER_MARKER, this.CLEAR_RAMPAGING_HAMMER_MARKER, this);
        }
        return state;
    }
}
exports.Rampardosex = Rampardosex;

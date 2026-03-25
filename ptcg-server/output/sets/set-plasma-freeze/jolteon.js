"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jolteon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jolteon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Pin Missile',
                cost: [C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
            },
            {
                name: 'Electri-Defuse',
                cost: [L, C],
                damage: 40,
                text: 'If the Defending Pokémon is a Pokémon-EX, that Pokémon can\'t attack during your opponent\'s next turn.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '34';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jolteon';
        this.fullName = 'Jolteon PLF';
        this.ELECTRI_DEFUSE_MARKER = 'ELECTRI_DEFUSE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 4, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 20 * heads;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const defending = opponent.active.getPokemonCard();
            if (defending && defending.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                opponent.active.marker.addMarker(this.ELECTRI_DEFUSE_MARKER, this);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect
            && effect.player.active.marker.hasMarker(this.ELECTRI_DEFUSE_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.active.marker.hasMarker(this.ELECTRI_DEFUSE_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.ELECTRI_DEFUSE_MARKER, this);
        }
        return state;
    }
}
exports.Jolteon = Jolteon;

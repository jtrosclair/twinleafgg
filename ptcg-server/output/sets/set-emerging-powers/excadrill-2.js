"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Excadrill2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Excadrill2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drilbur';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dig',
                cost: [F, C],
                damage: 30,
                text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
            },
            {
                name: 'Earthquake',
                cost: [F, C, C],
                damage: 70,
                text: 'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Excadrill';
        this.fullName = 'Excadrill EPO 57';
        this.DIG_MARKER = 'DIG_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    player.active.marker.addMarker(this.DIG_MARKER, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.bench.forEach(bench => {
                if (bench.cards.length > 0) {
                    const putDamage = new attack_effects_1.PutDamageEffect(effect, 10);
                    putDamage.target = bench;
                    store.reduceEffect(state, putDamage);
                }
            });
        }
        // Prevent damage and effects
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.marker.hasMarker(this.DIG_MARKER, this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const attacker = effect.player;
            if (player !== attacker) {
                effect.preventDefault = true;
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DIG_MARKER, this);
        }
        return state;
    }
}
exports.Excadrill2 = Excadrill2;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AurasLucario = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class AurasLucario extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.AURAS];
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Iron Defense',
                cost: [M],
                damage: 0,
                text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to Aura\'s Lucario during your opponent\'s next turn.'
            },
            {
                name: 'Low Kick',
                cost: [F, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'PCGP';
        this.name = 'Aura\'s Lucario';
        this.fullName = 'Aura\'s Lucario PCGP 75';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.IRON_DEFENSE_MARKER = 'IRON_DEFENSE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    this.marker.addMarker(this.IRON_DEFENSE_MARKER, this);
                    prefabs_1.ADD_MARKER(this.IRON_DEFENSE_MARKER, effect.opponent, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && prefabs_1.HAS_MARKER(this.IRON_DEFENSE_MARKER, effect.target, this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            effect.preventDefault = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.IRON_DEFENSE_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.IRON_DEFENSE_MARKER, effect.player, this);
            this.marker.removeMarker(this.IRON_DEFENSE_MARKER, this);
        }
        return state;
    }
}
exports.AurasLucario = AurasLucario;

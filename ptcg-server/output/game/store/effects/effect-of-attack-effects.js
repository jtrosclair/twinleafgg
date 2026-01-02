"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceDamageEffect = exports.preventAttackEffect = exports.preventDamageEffect = exports.preventRetreatEffect = exports.ReduceDamageEffect = exports.PreventAttackEffect = exports.PreventDamageEffect = exports.PreventRetreatEffect = exports.EffectOfAttackEffect = void 0;
const attack_effects_1 = require("./attack-effects");
const marker_constants_1 = require("../markers/marker-constants");
/**
 * Base class for effects that are caused by attacks
 * These can be prevented by abilities like Skeledirge's "Unaware"
 */
class EffectOfAttackEffect extends attack_effects_1.AbstractAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'EFFECT_OF_ATTACK_EFFECT';
        this.preventDefault = false;
    }
}
exports.EffectOfAttackEffect = EffectOfAttackEffect;
/**
 * Effect that adds a retreat prevention marker
 */
class PreventRetreatEffect extends EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'PREVENT_RETREAT_EFFECT';
    }
    applyEffect() {
        this.opponent.active.marker.addMarker(marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this.markerSource);
    }
}
exports.PreventRetreatEffect = PreventRetreatEffect;
/**
 * Effect that adds a damage prevention marker
 */
class PreventDamageEffect extends EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'PREVENT_DAMAGE_EFFECT';
    }
    applyEffect() {
        this.player.active.marker.addMarker(marker_constants_1.MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this.markerSource);
        this.opponent.marker.addMarker(marker_constants_1.MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this.markerSource);
    }
}
exports.PreventDamageEffect = PreventDamageEffect;
/**
 * Effect that adds an attack prevention marker
 */
class PreventAttackEffect extends EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'PREVENT_ATTACK_EFFECT';
    }
    applyEffect() {
        this.opponent.active.marker.addMarker(marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this.markerSource);
    }
}
exports.PreventAttackEffect = PreventAttackEffect;
/**
 * Effect that adds a damage reduction marker
 */
class ReduceDamageEffect extends EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'REDUCE_DAMAGE_EFFECT';
    }
    applyEffect() {
        this.opponent.active.marker.addMarker(marker_constants_1.MarkerConstants.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this.markerSource);
    }
}
exports.ReduceDamageEffect = ReduceDamageEffect;
/**
 * Helper functions for creating common effect-of-attack effects
 */
function preventRetreatEffect(attackEffect, source) {
    const effect = new PreventRetreatEffect(attackEffect);
    effect.markerSource = source;
    return effect;
}
exports.preventRetreatEffect = preventRetreatEffect;
function preventDamageEffect(attackEffect, source) {
    const effect = new PreventDamageEffect(attackEffect);
    effect.markerSource = source;
    return effect;
}
exports.preventDamageEffect = preventDamageEffect;
function preventAttackEffect(attackEffect, source) {
    const effect = new PreventAttackEffect(attackEffect);
    effect.markerSource = source;
    return effect;
}
exports.preventAttackEffect = preventAttackEffect;
function reduceDamageEffect(attackEffect, source) {
    const effect = new ReduceDamageEffect(attackEffect);
    effect.markerSource = source;
    return effect;
}
exports.reduceDamageEffect = reduceDamageEffect;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS = exports.PREVENT_EFFECTS_OF_ATTACKS = exports.PREVENT_DAMAGE = exports.DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN = exports.DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect = exports.DEFENDING_POKEMON_WEAKNESS_IS_NOW = exports.DefendingPokemonWeaknessIsNowEffect = exports.DEFENDING_POKEMON_DOES_LESS_DAMAGE = exports.OutgoingDamageReductionEffect = void 0;
const effect_of_attack_effects_1 = require("../effects/effect-of-attack-effects");
// Upstream ReduceDamageEffect; separate from the fork's legacy marker-only class.
class OutgoingDamageReductionEffect extends effect_of_attack_effects_1.EffectOfAttackEffect {
    constructor(base, reduction) {
        super(base);
        this.reduction = reduction;
        this.type = 'OUTGOING_DAMAGE_REDUCTION_EFFECT';
    }
    applyEffect() {
        this.opponent.active.attackDamageReductionNextTurn = Math.max(0, this.reduction);
    }
}
exports.OutgoingDamageReductionEffect = OutgoingDamageReductionEffect;
function DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, source, reduction) {
    const reduced = new OutgoingDamageReductionEffect(effect, reduction);
    reduced.markerSource = source;
    return store.reduceEffect(state, reduced);
}
exports.DEFENDING_POKEMON_DOES_LESS_DAMAGE = DEFENDING_POKEMON_DOES_LESS_DAMAGE;
// Upstream weakness override effect and duration fields, with fork scalar card types.
class DefendingPokemonWeaknessIsNowEffect extends effect_of_attack_effects_1.EffectOfAttackEffect {
    constructor(base, weaknessType) {
        super(base);
        this.weaknessType = weaknessType;
        this.type = 'DEFENDING_POKEMON_WEAKNESS_IS_NOW_EFFECT';
    }
    applyEffect() {
        const target = this.opponent.active;
        target.weaknessOverrideType = this.weaknessType;
        target.weaknessOverrideAttackerId = this.player.id;
        target.weaknessOverrideClearArmed = false;
    }
}
exports.DefendingPokemonWeaknessIsNowEffect = DefendingPokemonWeaknessIsNowEffect;
function DEFENDING_POKEMON_WEAKNESS_IS_NOW(store, state, effect, source, weaknessType) {
    const modified = new DefendingPokemonWeaknessIsNowEffect(effect, weaknessType);
    modified.markerSource = source;
    return store.reduceEffect(state, modified);
}
exports.DEFENDING_POKEMON_WEAKNESS_IS_NOW = DEFENDING_POKEMON_WEAKNESS_IS_NOW;
class DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect extends effect_of_attack_effects_1.EffectOfAttackEffect {
    constructor(base, damageBonus) {
        super(base);
        this.damageBonus = damageBonus;
        this.type = 'DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_ATTACKER_NEXT_TURN_EFFECT';
    }
    applyEffect() {
        const target = this.opponent.active;
        const bonusAlreadyActive = target.defendingPokemonExtraDamageNextTurn > 0
            && !target.defendingPokemonExtraDamagePending
            && target.defendingPokemonExtraDamageAttackerId === this.player.id;
        target.defendingPokemonExtraDamageNextTurn = this.damageBonus;
        target.defendingPokemonExtraDamageAttackerId = this.player.id;
        if (bonusAlreadyActive) {
            // Attack effects run before damage. Keep the bonus active for this attack,
            // then re-arm pending afterward so the next trap cycle can begin.
            target.defendingPokemonExtraDamageRearmAfterAttack = true;
            return;
        }
        target.defendingPokemonExtraDamagePending = true;
    }
}
exports.DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect = DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect;
function DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, attackEffect, source, damageBonus) {
    const effect = new DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect(attackEffect, damageBonus);
    effect.markerSource = source;
    return store.reduceEffect(state, effect);
}
exports.DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN = DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN;
// Upstream pending/active self-protection; legacy prefab PREVENT_DAMAGE remains unchanged.
class NextTurnPreventDamageEffect extends effect_of_attack_effects_1.EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'NEXT_TURN_PREVENT_DAMAGE_EFFECT';
        this.target = base.source;
    }
    applyEffect() { this.player.active.preventDamageNextTurnPending = true; }
}
class PreventEffectsOfAttacksEffect extends effect_of_attack_effects_1.EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'PREVENT_EFFECTS_OF_ATTACKS_EFFECT';
        this.target = base.source;
    }
    applyEffect() { this.player.active.preventEffectsOfAttacksNextTurnPending = true; }
}
function PREVENT_DAMAGE(store, state, effect, source) {
    const protection = new NextTurnPreventDamageEffect(effect);
    protection.markerSource = source;
    return store.reduceEffect(state, protection);
}
exports.PREVENT_DAMAGE = PREVENT_DAMAGE;
function PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, source) {
    const protection = new PreventEffectsOfAttacksEffect(effect);
    protection.markerSource = source;
    return store.reduceEffect(state, protection);
}
exports.PREVENT_EFFECTS_OF_ATTACKS = PREVENT_EFFECTS_OF_ATTACKS;
class CoinFlipCancelTrainerPlayEffect extends effect_of_attack_effects_1.EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'COIN_FLIP_CANCEL_TRAINER_PLAY_EFFECT';
        this.target = base.source;
    }
    applyEffect() {
        this.opponent.coinFlipCancelTrainerPlayTurnsRemaining = Math.max(this.opponent.coinFlipCancelTrainerPlayTurnsRemaining, 1);
    }
}
function OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS(store, state, effect, source) {
    const restriction = new CoinFlipCancelTrainerPlayEffect(effect);
    restriction.markerSource = source;
    return store.reduceEffect(state, restriction);
}
exports.OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS = OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS;

import { Card } from '../card/card';
import { CardType } from '../card/card-types';
import { AttackEffect } from '../effects/game-effects';
import { EffectOfAttackEffect } from '../effects/effect-of-attack-effects';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
export declare class OutgoingDamageReductionEffect extends EffectOfAttackEffect {
    reduction: number;
    readonly type = "OUTGOING_DAMAGE_REDUCTION_EFFECT";
    constructor(base: AttackEffect, reduction: number);
    applyEffect(): void;
}
export declare function DEFENDING_POKEMON_DOES_LESS_DAMAGE(store: StoreLike, state: State, effect: AttackEffect, source: Card, reduction: number): State;
export declare class DefendingPokemonWeaknessIsNowEffect extends EffectOfAttackEffect {
    weaknessType: CardType;
    readonly type = "DEFENDING_POKEMON_WEAKNESS_IS_NOW_EFFECT";
    constructor(base: AttackEffect, weaknessType: CardType);
    applyEffect(): void;
}
export declare function DEFENDING_POKEMON_WEAKNESS_IS_NOW(store: StoreLike, state: State, effect: AttackEffect, source: Card, weaknessType: CardType): State;
export declare class DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect extends EffectOfAttackEffect {
    damageBonus: number;
    readonly type: string;
    constructor(base: AttackEffect, damageBonus: number);
    applyEffect(): void;
}
export declare function DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store: StoreLike, state: State, attackEffect: AttackEffect, source: Card, damageBonus: number): State;
export declare function PREVENT_DAMAGE(store: StoreLike, state: State, effect: AttackEffect, source: Card): State;
export declare function PREVENT_EFFECTS_OF_ATTACKS(store: StoreLike, state: State, effect: AttackEffect, source: Card): State;
export declare function OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS(store: StoreLike, state: State, effect: AttackEffect, source: Card): State;

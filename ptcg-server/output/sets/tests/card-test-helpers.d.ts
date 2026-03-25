import { Store } from '../../game/store/store';
import { State } from '../../game/store/state/state';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { SetupGameResult } from './test-helpers';
export declare function useAttack(store: Store, state: State, playerIndex: number, attackName: string): void;
export declare function useAbility(store: Store, state: State, playerIndex: number, abilityName: string): void;
export declare function endTurn(store: Store, state: State): void;
export declare function playTrainerCard(store: Store, state: State, playerIndex: number, cardFullName: string): void;
export declare function createDamageEffect(game: SetupGameResult, attackerIndex: number, options?: {
    benchIndex?: number;
    damage?: number;
}): PutDamageEffect;
export declare function createActiveDamageEffect(game: SetupGameResult, attackerIndex: number, options?: {
    damage?: number;
}): DealDamageEffect;
export declare function createAttackEffect(game: SetupGameResult, attackerIndex: number, options?: {
    damage?: number;
}): AttackEffect;
export declare function getDamage(state: State, playerIndex: number, slot?: 'active' | number): number;
export declare function getEnergyCount(state: State, playerIndex: number, slot?: 'active' | number): number;
type ZoneName = 'hand' | 'deck' | 'discard' | 'lostzone';
export declare function getZoneCount(state: State, playerIndex: number, zone: ZoneName): number;
export declare function hasSpecialCondition(state: State, playerIndex: number, slot: 'active' | number | undefined, condition: SpecialCondition): boolean;
export declare function zoneContains(state: State, playerIndex: number, zone: ZoneName, cardFullName: string): boolean;
export declare function getActivePokemon(state: State, playerIndex: number): PokemonCard;
export {};

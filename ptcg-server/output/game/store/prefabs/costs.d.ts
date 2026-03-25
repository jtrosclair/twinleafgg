import { Card, CardTarget, SlotType, State, StoreLike } from '../..';
import { CardType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { AttackEffect } from '../effects/game-effects';
type EnergyDiscardTransfer = {
    from: CardTarget;
    card: Card;
};
/**
 * Discard up to X Energy cards from this Pokémon.
 *
 * Defaults:
 * - `minAmount`: 0 (fully optional)
 * - `filter`: all Energy cards
 *
 * Optional `onDiscarded` receives the resolved transfers after discard effects are applied.
 */
export declare function DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON(store: StoreLike, state: State, effect: AttackEffect, maxAmount: number, filter?: Partial<EnergyCard>, minAmount?: number, onDiscarded?: (transfers: EnergyDiscardTransfer[]) => void): State;
/**
 * Discard up to X Energy cards from your Pokémon.
 *
 * Defaults:
 * - `minAmount`: 0 (fully optional)
 * - `filter`: all Energy cards
 * - `slots`: Active + Bench
 *
 * Optional `onDiscarded` receives the resolved transfers after discard effects are applied.
 */
export declare function DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(store: StoreLike, state: State, effect: AttackEffect, maxAmount: number, filter?: Partial<EnergyCard>, minAmount?: number, slots?: SlotType[], onDiscarded?: (transfers: EnergyDiscardTransfer[]) => void): State;
/**
 * Discard up to X [type] Energy from your Pokémon.
 *
 * This defaults to all attached Energy and validates type server-side so callers
 * can safely use broad selection filters.
 *
 * Optional `onDiscarded` receives the resolved transfers after discard effects are applied.
 */
export declare function DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON(store: StoreLike, state: State, effect: AttackEffect, maxAmount: number, cardType: CardType, minAmount?: number, slots?: SlotType[], onDiscarded?: (transfers: EnergyDiscardTransfer[]) => void): State;
/**
 * Discards an exact amount of Energy from this Pokémon.
 *
 * This helper is preserved for compatibility with existing exact-cost logic.
 */
export declare function DISCARD_X_ENERGY_FROM_THIS_POKEMON(store: StoreLike, state: State, effect: AttackEffect, amount: number, type?: CardType): State;
export {};

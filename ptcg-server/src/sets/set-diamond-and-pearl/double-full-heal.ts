import { DoubleFullHeal as SandstormDoubleFullHeal } from '../set-ex-sandstorm/double-full-heal';

// Reprint of the existing effect; keep the DP printed identity for old decks.
export class DoubleFullHealDP extends SandstormDoubleFullHeal {
  public set: string = 'DP';
  public setNumber: string = '105';
  public fullName: string = 'Double Full Heal DP';
}

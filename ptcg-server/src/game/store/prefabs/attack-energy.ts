import { CardType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import type { EnergyMap } from '../prompts/choose-energy-prompt';

/** Assign the attack and bonus costs to distinct units of attached Energy. */
export function canPayAttackCostWithExtraEnergy(
  energy: EnergyMap[], cost: readonly CardType[], extra: CardType
): boolean {
  const required = [...cost.filter(type => type !== CardType.NONE && type !== CardType.ANY), extra];
  const units = energy.flatMap(({ card, provides, disableBlend }) => {
    const blend = (card as EnergyCard).blendedEnergies;
    if (!disableBlend && blend?.length) {
      return Array.from({ length: (card as EnergyCard).blendedEnergyCount || 1 }, () => blend);
    }
    return provides.filter(type => type !== CardType.NONE).map(type => [type]);
  });
  const assigned = units.map(() => -1);

  const assign = (requirement: number, visited: Set<number>): boolean => {
    const type = required[requirement];
    for (const [index, options] of units.entries()) {
      if (visited.has(index)) continue;
      if (type !== CardType.COLORLESS && !options.includes(type) && !options.includes(CardType.ANY)) continue;
      visited.add(index);
      if (assigned[index] === -1 || assign(assigned[index], visited)) {
        assigned[index] = requirement;
        return true;
      }
    }
    return false;
  };

  return required.length <= units.length && required.every((_, index) => assign(index, new Set()));
}

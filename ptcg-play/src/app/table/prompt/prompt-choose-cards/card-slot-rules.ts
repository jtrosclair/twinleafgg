import { Card, ChooseCardsPrompt, EnergyType, Stage, SuperType, TrainerType } from 'ptcg-server';

export interface CardSlotRule {
  label: string;
  accepts: (card: Card) => boolean;
}

function filterRule(filter: ChooseCardsPrompt['filter']): CardSlotRule {
  const type = filter as any;
  // Some older prompts provide only a subtype rather than its supertype.
  const superType = type.superType ?? (type.trainerType !== undefined ? SuperType.TRAINER
    : type.energyType !== undefined ? SuperType.ENERGY : type.stage !== undefined ? SuperType.POKEMON : undefined);
  let label = 'any';
  if (superType === SuperType.POKEMON) {
    const stage = { [Stage.BASIC]: 'Basic', [Stage.STAGE_1]: 'Stage 1', [Stage.STAGE_2]: 'Stage 2' }[type.stage];
    label = stage ? `${stage} Pokémon` : 'Pokémon';
  } else if (superType === SuperType.ENERGY) {
    label = type.energyType === EnergyType.BASIC ? 'Basic Energy'
      : type.energyType === EnergyType.SPECIAL ? 'Special Energy' : 'Energy';
  } else if (superType === SuperType.TRAINER) {
    label = { [TrainerType.ITEM]: 'Item', [TrainerType.TOOL]: 'Pokémon Tool',
      [TrainerType.SUPPORTER]: 'Supporter', [TrainerType.STADIUM]: 'Stadium' }[type.trainerType] || 'Trainer';
  }
  return { label, accepts: card => Object.keys(filter).every(key => type[key] === (card as any)[key]) };
}

/** Reuse every engine restriction while allowing an unfinished selection. */
export function partialSelectionPrompt(prompt: ChooseCardsPrompt): ChooseCardsPrompt {
  return Object.assign(Object.create(prompt), { options: { ...prompt.options, min: 0 } });
}

export function cardSlotRules(prompt: ChooseCardsPrompt, count = prompt.options.max): CardSlotRule[] {
  const general = filterRule(prompt.filter || {});
  const fallback = () => Array.from({ length: count }, () => general);
  // Hidden card identities must not influence the labels. Either/or and different-type
  // requirements cannot be represented by independent, fixed category slots.
  const options = prompt.options;
  if (options.isSecret || options.differentTypes || !options.allowDifferentSuperTypes
    || options.maxBasics !== undefined || options.maxEvolutions !== undefined
    || options.maxStage1 !== undefined || options.maxStage2 !== undefined) { return fallback(); }

  const partial = partialSelectionPrompt(prompt);
  const available = prompt.cards.cards.filter(card => partial.validate([card]));
  const groups: Array<{ rule: CardSlotRule; max: number }> = [];
  const families: Array<{ superType: SuperType; max: number | undefined;
    children: Array<{ max: number | undefined; energyType?: EnergyType; trainerType?: TrainerType }> }> = [
    { superType: SuperType.POKEMON, max: options.maxPokemons, children: [] },
    { superType: SuperType.ENERGY, max: options.maxEnergies, children: [
      { energyType: EnergyType.BASIC, max: options.maxBasicEnergies },
      { energyType: EnergyType.SPECIAL, max: options.maxSpecialEnergies }
    ] },
    { superType: SuperType.TRAINER, max: options.maxTrainers, children: [
      { trainerType: TrainerType.ITEM, max: options.maxItems },
      { trainerType: TrainerType.TOOL, max: options.maxTools },
      { trainerType: TrainerType.SUPPORTER, max: options.maxSupporters },
      { trainerType: TrainerType.STADIUM, max: options.maxStadiums }
    ] }
  ];
  for (const family of families) {
    const children = family.children.filter(child => child.max !== undefined).map(child => {
      const { max, ...filter } = child;
      return { max, rule: filterRule({ ...prompt.filter, superType: family.superType, ...filter }) };
    });
    const childMax = children.reduce((sum, child) => sum + child.max, 0);
    const covered = available.filter(card => card.superType === family.superType)
      .every(card => children.some(child => child.rule.accepts(card)));
    if (children.length && covered && (family.max === undefined || childMax <= family.max)) {
      groups.push(...children);
    } else if (family.max !== undefined) {
      groups.push({ max: family.max, rule: filterRule({ ...prompt.filter, superType: family.superType }) });
    }
  }
  // Only split a prompt when its limits form a complete, non-overlapping partition.
  // Other prompts keep broad labels and still use engine validation on every drop.
  if (groups.reduce((sum, group) => sum + group.max, 0) !== count
    || !available.every(card => groups.some(group => group.max > 0 && group.rule.accepts(card)))) { return fallback(); }
  return groups.reduce((slots, group) => slots.concat(Array.from({ length: group.max }, () => group.rule)), []);
}

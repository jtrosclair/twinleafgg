import { Card, EnergyCard, PokemonCard, SuperType, TrainerCard, TrainerType } from 'ptcg-server';
import { HandItem } from './hand-item.interface';

export interface HandStack extends HandItem {
  key: string;
  copies: HandItem[];
  backingCards: HandItem[];
  playable: boolean;
}

const trainerOrder = [TrainerType.SUPPORTER, TrainerType.ITEM, TrainerType.TOOL, TrainerType.STADIUM];
const effects = new WeakMap<Function, number>();
let nextEffectId = 0;

function effectId(effect: Function | undefined): number | undefined {
  if (!effect) { return undefined; }
  if (!effects.has(effect)) { effects.set(effect, ++nextEffectId); }
  return effects.get(effect);
}

/** Ignore print/artwork metadata while preserving differences in rules and effects. */
export function handCardKey(card: Card): string {
  const pokemon = card as PokemonCard;
  const trainer = card as TrainerCard;
  const energy = card as EnergyCard;
  return JSON.stringify([
    card.superType, card.name, card.tags.filter(tag => tag !== 'Holo'),
    pokemon.cardType, pokemon.additionalCardTypes, pokemon.pokemonType, pokemon.stage, pokemon.hp,
    pokemon.evolvesFrom, pokemon.evolvesTo, pokemon.evolvesFromBase, pokemon.evolvesToStage,
    card.retreat, pokemon.weakness, pokemon.resistance, card.attacks, card.powers,
    trainer.trainerType, trainer.text, trainer.firstTurn, trainer.putIntoPlay,
    energy.energyType, energy.provides, energy.blendedEnergies, energy.blendedEnergyCount,
    effectId(card.reduceEffect), effectId(card.canPlay)
  ], (_key, value) => typeof value === 'function' ? value.toString() : value);
}

function compareCards(a: Card, b: Card): number {
  if (a.superType !== b.superType) { return a.superType - b.superType; }
  if (a.superType === SuperType.TRAINER) {
    const order = trainerOrder.indexOf((a as TrainerCard).trainerType)
      - trainerOrder.indexOf((b as TrainerCard).trainerType);
    if (order) { return order; }
  }
  if (a.superType === SuperType.ENERGY && a.energyType !== b.energyType) {
    return a.energyType - b.energyType;
  }
  return a.name.localeCompare(b.name);
}

/** Presentation order never changes the engine's hand indices. */
export function buildHandStacks(items: HandItem[], playableIds: number[], faceDown: boolean): HandStack[] {
  const groups = new Map<string, HandItem[]>();
  const playable = new Set(playableIds);
  items.forEach(item => {
    // Hidden hands must not reveal duplicate counts or category ordering.
    const key = faceDown ? `hidden-${item.index}` : handCardKey(item.card);
    if (!groups.has(key)) { groups.set(key, []); }
    groups.get(key).push(item);
  });
  const stacks = Array.from(groups, ([key, copies]) => {
    const front = copies.find(item => playable.has(item.card.id)) || copies[0];
    return {
      ...front, key, copies,
      backingCards: copies.filter(item => item !== front).slice(0, 2).reverse(),
      playable: !faceDown && playable.has(front.card.id)
    };
  });
  return faceDown ? stacks : stacks.sort((a, b) => compareCards(a.card, b.card) || a.index - b.index);
}

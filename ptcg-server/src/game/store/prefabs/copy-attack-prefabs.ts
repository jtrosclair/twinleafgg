import {
  Card,
  ChooseAttackPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  State,
  StateUtils,
  StoreLike,
} from '../..';
import { PokemonCard } from '../card/pokemon-card';
import { Attack } from '../card/pokemon-types';
import { CheckProvidedEnergyEffect } from '../effects/check-effects';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../effects/game-effects';
import { PokemonCardList } from '../state/pokemon-card-list';
import { checkCopiedAttackCost, runDelegatedCopiedAttackGenerator } from './copy-attack-delegation';

export function findPokemonCardForAttack(
  cards: Card[],
  attack: Attack,
): PokemonCard | undefined {
  const pokemonCards = cards.filter((card): card is PokemonCard => card instanceof PokemonCard);
  // Preserve reference identity across all cards before falling back to legacy name matching.
  return pokemonCards.find(card => card.attacks.includes(attack))
    || pokemonCards.find(card => card.attacks.some(a => a.name === attack.name));
}

export interface BuildAttackListOptions {
  /** Only include Pokémon matching this predicate. */
  filter?: (cardList: PokemonCardList, card: PokemonCard) => boolean;
  /** Also scan the opponent's in-play Pokémon. */
  includeOpponent?: boolean;
  /** Pokémon not in play (discard pile, Lost Zone, evolution stack, etc.). */
  extraCards?: PokemonCard[];
  /** Card whose own cost modifiers apply to the copied attack. Defaults to Active. */
  copycatCard?: PokemonCard;
}

/**
 * Build attack prompt data with energy-cost blocking for ability-based copy effects.
 */
export function buildAttackListWithEnergyBlocking(
  state: State,
  store: StoreLike,
  player: Player,
  options: BuildAttackListOptions = {},
): { pokemonCards: PokemonCard[]; blocked: { index: number; attack: string }[] } {
  const copycatSlot = options.copycatCard
    ? StateUtils.findPokemonSlot(state, options.copycatCard) ?? player.active
    : player.active;
  const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, copycatSlot);
  store.reduceEffect(state, checkProvidedEnergyEffect);
  const energyMap = checkProvidedEnergyEffect.energyMap;

  const pokemonCards: PokemonCard[] = [];
  const blocked: { index: number; attack: string }[] = [];

  const addCardWithBlocking = (card: PokemonCard) => {
    if (copycatSlot !== player.active && !card.attacks.some(attack => attack.useOnBench)) return;

    const index = pokemonCards.length;
    pokemonCards.push(card);
    for (const attack of card.attacks) {
      if ((copycatSlot !== player.active && !attack.useOnBench)
        || copycatSlot.cannotUseAttacksNextTurn.includes(attack.name)) {
        blocked.push({ index, attack: attack.name });
        continue;
      }

      const checked = checkCopiedAttackCost(store, state, player, card, attack, options.copycatCard, copycatSlot);
      state = checked.state;
      if (!StateUtils.checkEnoughEnergy(energyMap, checked.effect.cost)) {
        blocked.push({ index, attack: attack.name });
      }
    }
  };

  const scanInPlay = (scanPlayer: Player) => {
    scanPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      const card = cardList.getPokemonCard();
      if (card === undefined) {
        return;
      }
      if (options.filter && !options.filter(cardList, card)) {
        return;
      }
      addCardWithBlocking(card);
    });
  };

  scanInPlay(player);

  if (options.includeOpponent) {
    scanInPlay(StateUtils.getOpponent(state, player));
  }

  if (options.extraCards) {
    for (const card of options.extraCards) {
      addCardWithBlocking(card);
    }
  }

  return { pokemonCards, blocked };
}

export interface CopyAttackViaAbilityOptions extends BuildAttackListOptions {
  copycatCard: PokemonCard;
  allowCancel?: boolean;
  /** When false, the copycat may use attacks that can be used from the Bench. */
  requireActiveCopycat?: boolean;
}

interface CopyAttackFromListOptions {
  allowCancel?: boolean;
  promptPlayerId?: number;
  disallowCopycatAttack?: boolean;
  preserveInPlaySource?: boolean;
}

/** Resolve another attack's text as part of the attack already in progress. */
export function* copyAttackFromPokemonList(
  next: () => void,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  pokemonCards: PokemonCard[],
  { allowCancel = true, promptPlayerId = effect.player.id, disallowCopycatAttack = false, preserveInPlaySource }: CopyAttackFromListOptions,
): IterableIterator<State> {
  const copycatCard = effect.source.getPokemonCard();
  if (!copycatCard || !pokemonCards.some(card => card.attacks.length)) return state;

  let selected: Attack | null = null;
  yield store.prompt(state, new ChooseAttackPrompt(
    promptPlayerId, GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, { allowCancel },
  ), attack => {
    selected = attack;
    next();
  });

  const selectedAttack = selected as Attack | null;
  if (!selectedAttack || (disallowCopycatAttack && selectedAttack.copycatAttack)) return state;
  const sourceCard = findPokemonCardForAttack(pokemonCards, selectedAttack);
  if (!sourceCard) return state;

  return yield* runDelegatedCopiedAttackGenerator(next, {
    store, state, copycatCard, sourceCard, selectedAttack, sourceSlot: effect.source,
    player: effect.player, opponent: effect.opponent, retainDeclaredAttack: true, preserveInPlaySource,
  });
}

export function COPY_ATTACK_FROM_POKEMON_LIST(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  pokemonCards: PokemonCard[],
  options: CopyAttackFromListOptions = {},
): State {
  const generator = copyAttackFromPokemonList(() => generator.next(), store, state, effect, pokemonCards, options);
  return generator.next().value;
}

/**
 * Ability: choose an attack from in-play Pokémon (with energy blocking) and use it.
 * Runs through UseAttackEffect with delegateFrom so energy/status checks apply.
 */
export function COPY_ATTACK_VIA_ABILITY(
  store: StoreLike,
  state: State,
  effect: PowerEffect,
  options: CopyAttackViaAbilityOptions,
): State {
  const player = effect.player;
  const { copycatCard, allowCancel = true, requireActiveCopycat = true } = options;

  const copycatSlot = player.getPokemonInPlay().find(slot => slot.getPokemonCard() === copycatCard);
  if (!copycatSlot || (requireActiveCopycat && copycatSlot !== player.active)) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const { pokemonCards, blocked } = buildAttackListWithEnergyBlocking(
    state, store, player, options,
  );

  if (pokemonCards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  return store.prompt(
    state,
    new ChooseAttackPrompt(
      player.id,
      GameMessage.CHOOSE_ATTACK_TO_COPY,
      pokemonCards,
      { allowCancel, blocked },
    ),
    attack => {
      if (attack === null) {
        return state;
      }
      if (copycatSlot.cannotUseAttacksNextTurn.includes(attack.name)) {
        return state;
      }
      const sourceCard = findPokemonCardForAttack(pokemonCards, attack);
      if (sourceCard === undefined) {
        return state;
      }
      const useAttackEffect = new UseAttackEffect(player, attack);
      useAttackEffect.delegateFrom = sourceCard;
      useAttackEffect.source = copycatSlot;
      return store.reduceEffect(state, useAttackEffect);
    },
  );
}

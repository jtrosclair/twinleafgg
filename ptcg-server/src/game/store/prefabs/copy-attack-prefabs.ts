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
import { CardType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Attack } from '../card/pokemon-types';
import { CheckProvidedEnergyEffect } from '../effects/check-effects';
import { PowerEffect, UseAttackEffect } from '../effects/game-effects';
import { PokemonCardList } from '../state/pokemon-card-list';
import { checkCopiedAttackCost } from './copy-attack-delegation';

export function findPokemonCardForAttack(
  cards: Card[],
  attack: Attack,
): PokemonCard | undefined {
  const pokemonCards = cards.filter((card): card is PokemonCard => card instanceof PokemonCard);
  // Preserve reference identity across all cards before falling back to legacy name matching.
  return pokemonCards.find(card => card.attacks.includes(attack))
    || pokemonCards.find(card => card.attacks.some(a => a.name === attack.name));
}

function isAttackLockedNextTurn(player: Player, attack: Attack): boolean {
  return (player.active.cannotUseAttacksNextTurn || []).includes(attack.name);
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
  const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
  store.reduceEffect(state, checkProvidedEnergyEffect);
  const energyMap = checkProvidedEnergyEffect.energyMap;

  const pokemonCards: PokemonCard[] = [];
  const blocked: { index: number; attack: string }[] = [];

  const addCardWithBlocking = (card: PokemonCard) => {
    const affordableAttacks = card.attacks.filter(attack => {
      const checked = checkCopiedAttackCost(store, state, player, card, attack, options.copycatCard);
      state = checked.state;
      const checkAttackCost = checked.effect;
      return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost as CardType[]);
    });

    const index = pokemonCards.length;
    pokemonCards.push(card);
    const locked = new Set(player.active.cannotUseAttacksNextTurn || []);
    card.attacks.forEach(attack => {
      if (!affordableAttacks.includes(attack) || locked.has(attack.name)) {
        blocked.push({ index, attack: attack.name });
      }
    });
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
  /** When false, the copycat may be on the Bench while another Pokémon is Active. Default true. */
  requireActiveCopycat?: boolean;
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

  if (requireActiveCopycat && player.active.getPokemonCard() !== copycatCard) {
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
      if (isAttackLockedNextTurn(player, attack)) {
        return state;
      }
      const sourceCard = findPokemonCardForAttack(pokemonCards, attack);
      if (sourceCard === undefined) {
        return state;
      }
      const useAttackEffect = new UseAttackEffect(player, attack);
      useAttackEffect.delegateFrom = sourceCard;
      useAttackEffect.source = player.active;
      return store.reduceEffect(state, useAttackEffect);
    },
  );
}
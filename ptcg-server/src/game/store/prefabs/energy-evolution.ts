import { CardType, EnergyType, Stage, SuperType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { EvolveEffect } from '../effects/game-effects';
import type { AfterAttachEnergyEffect, AfterAttachEnergyFromHandEffect } from '../effects/play-card-effects';
import { GameMessage } from '../../game-message';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import type { State } from '../state/state';
import type { StoreLike } from '../store-like';
import { queuePokemonEnergyReaction } from './hand-energy-reactions';
import { CONFIRMATION_PROMPT, SHUFFLE_DECK } from './prefabs';

export function searchEnergyEvolution(
  store: StoreLike, state: State, effect: AfterAttachEnergyEffect, eevee: PokemonCard, types: CardType[],
): State {
  const { player, target } = effect;
  if (target.getPokemonCard() !== eevee || player.deck.cards.length === 0 || types.length === 0) return state;

  const matchingType = types.length === 1 && types[0] !== CardType.ANY ? types[0] : undefined;
  const blocked = matchingType !== undefined || types.includes(CardType.ANY) ? []
    : player.deck.cards.flatMap((card, index) =>
      card instanceof PokemonCard && !types.includes(card.cardType) ? [index] : []);
  return store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, {
    superType: SuperType.POKEMON, stage: Stage.STAGE_1, evolvesFrom: eevee.name,
    ...(matchingType === undefined ? {} : { cardType: matchingType }),
  }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
    const evolution = selected[0];
    if (evolution instanceof PokemonCard && target.getPokemonCard() === eevee && player.deck.cards.includes(evolution)) {
      store.reduceEffect(state, new EvolveEffect(player, target, evolution, player.deck));
    }
    SHUFFLE_DECK(store, state, player);
  });
}

export function queueBasicEnergyEvolution(
  store: StoreLike, state: State, effect: AfterAttachEnergyFromHandEffect, eevee: PokemonCard,
): void {
  if (effect.recipientAtAttachment !== eevee || effect.energyCard.energyType !== EnergyType.BASIC) return;

  const { player, target, energyCard } = effect;
  const canSearch = () => target.getPokemonCard() === eevee && player.deck.cards.length > 0
    && target.cards.includes(energyCard);
  queuePokemonEnergyReaction(store, state, effect, eevee, () => {
    CONFIRMATION_PROMPT(store, state, player, accepted => {
      if (accepted && canSearch()) searchEnergyEvolution(store, state, effect, eevee, energyCard.provides);
    });
  }, canSearch, energyCard.name);
}

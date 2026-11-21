import { GameMessage } from '../../game-message';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { Card } from '../card/card';
import { EnergyType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { TrainerEffect } from '../effects/play-card-effects';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { CardList } from '../state/card-list';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StateUtils } from '../state-utils';
import { StoreLike } from '../store-like';
import { getPhysicalAttachedEnergy } from './attack-effects';
import { MOVE_CARDS, TRAINER_TARGET_BLOCKED } from './prefabs';

export function getAttachedSpecialEnergy(slot: PokemonCardList): Card[] {
  return getPhysicalAttachedEnergy(slot).filter(card =>
    (card as EnergyCard).energyType === EnergyType.SPECIAL);
}

type Attachments = (target: PokemonCardList) => readonly Card[];

export function chooseTrainerAttachmentTarget(
  store: StoreLike, state: State, effect: TrainerEffect, playerType: PlayerType, attachments: Attachments,
  resolve: (target: PokemonCardList) => void,
): State {
  const { player } = effect;
  const opponent = StateUtils.getOpponent(state, player);
  const blocked: CardTarget[] = [];
  const blockEmpty = (slot: PokemonCardList, _card: Card, target: CardTarget): void => {
    if (attachments(slot).length === 0) blocked.push(target);
  };
  if (playerType !== PlayerType.TOP_PLAYER) player.forEachPokemon(PlayerType.BOTTOM_PLAYER, blockEmpty);
  if (playerType !== PlayerType.BOTTOM_PLAYER) opponent.forEachPokemon(PlayerType.TOP_PLAYER, blockEmpty);

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id, GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, playerType, [SlotType.ACTIVE, SlotType.BENCH],
    { min: 1, max: 1, allowCancel: false, blocked }
  ), ([target]) => {
    if (target?.getPokemonCard() && attachments(target).length > 0) resolve(target);
  });
}

export function chooseTrainerAttachment(
  store: StoreLike, state: State, effect: TrainerEffect, target: PokemonCardList, attachments: Attachments,
  message: GameMessage, resolve: (card?: Card) => void, useOnlyChoice = false,
): State {
  const cards = attachments(target);
  if (cards.length === 0 || TRAINER_TARGET_BLOCKED(store, state, effect, target)) {
    resolve();
    return state;
  }
  if (useOnlyChoice && cards.length === 1) {
    resolve(cards[0]);
    return state;
  }
  const choices = new CardList();
  choices.cards = [...cards];
  return store.prompt(state, new ChooseCardsPrompt(effect.player, message, choices, {},
    { min: 1, max: 1, allowCancel: false }
  ), ([card]) => resolve(attachments(target).includes(card) ? card : undefined));
}

/** Reconcile old Tool mirrors only after the chosen cards reach their destination. */
export function moveTrainerAttachments(
  store: StoreLike, state: State, effect: TrainerEffect, source: PokemonCardList, destination: CardList, cards: Card[],
): void {
  const mirroredTools = cards.filter(card => source.tools.includes(card) && source.cards.includes(card));
  const countAtDestination = (card: Card): number => destination.cards.filter(existing => existing === card).length;
  const previous = new Map(mirroredTools.map(card => [card, countAtDestination(card)]));
  MOVE_CARDS(store, state, source, destination, { cards, sourceCard: effect.trainerCard, sourceEffect: effect });
  for (const [card, count] of previous) {
    if (!source.cards.includes(card) && countAtDestination(card) > count) {
      source.tools = source.tools.filter(tool => tool !== card);
    }
  }
}

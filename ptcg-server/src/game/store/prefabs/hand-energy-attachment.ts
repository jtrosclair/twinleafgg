import { CardTarget, PlayerType, SlotType } from '../actions/play-card-action';
import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { EnergyCard } from '../card/energy-card';
import {
  AfterAttachEnergyFromHandEffect, AttachEnergyEffect, AttachEnergyFromHandEffect,
  CheckEnergyAttachmentEffect, CheckHandEnergyInterceptionEffect, CoinFlipEffect, QueuedHandEnergyReaction,
} from '../effects/play-card-effects';
import { MoveCardsEffect, PayHandEnergyAttachmentCostEffect } from '../effects/game-effects';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { CardList } from '../state/card-list';
import { Player } from '../state/player';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { resolveHandEnergyReactions, waitForHandEnergyPrompts } from './hand-energy-reactions';

/** Check the recipients before an optional Basic Energy effect asks the player to choose. */
export function checkBasicHandEnergyRecipients(
  store: StoreLike, state: State, player: Player, energy: EnergyCard, slots: SlotType[],
): { hasRecipient: boolean, blockedTo: CardTarget[] } {
  let hasRecipient = false;
  const blockedTo: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (target, _card, location) => {
    if (!slots.includes(location.slot)) return;
    try {
      store.reduceEffect(state, new CheckEnergyAttachmentEffect(new AttachEnergyEffect(player, energy, target)));
      hasRecipient = true;
    } catch (error) {
      if (!(error instanceof GameError)) throw error;
      blockedTo.push(location);
    }
  });
  return { hasRecipient, blockedTo };
}

function discardCost(attachments: AttachEnergyEffect[]): number {
  return attachments.reduce((count, attachment) => count + (attachment.energyCard.discardCostToAttachFromHand ?? 0), 0);
}

export function attachWithOptionalSecondEnergy(
  store: StoreLike, state: State, first: AttachEnergyEffect, candidates: EnergyCard[], useTurnAttachment: boolean,
): State {
  const { player, target, energyCard } = first;
  const commit = (attachments: AttachEnergyEffect[]) =>
    store.reduceEffect(state, new AttachEnergyFromHandEffect(player, attachments, useTurnAttachment));
  if (candidates.length === 0) return commit([first]);

  store.reduceEffect(state, new CheckEnergyAttachmentEffect(first));
  const extras = new Map<EnergyCard, AttachEnergyEffect>();
  for (const card of candidates) {
    if (card === energyCard) continue;
    const extra = new AttachEnergyEffect(player, card, target);
    if (discardCost([first, extra]) > player.hand.cards.length - 2) continue;
    try {
      store.reduceEffect(state, new CheckEnergyAttachmentEffect(extra));
      extras.set(card, extra);
    } catch (error) {
      if (!(error instanceof GameError)) throw error;
    }
  }
  if (extras.size === 0) return commit([first]);

  const currentPokemon = target.getPokemonCard();
  const list = new CardList();
  list.cards = [...extras.keys()];
  return store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_ATTACH,
    list, {}, { min: 0, max: 1, allowCancel: false }), selected => {
    if (!player.hand.cards.includes(energyCard) || target.getPokemonCard() !== currentPokemon
      || !player.getPokemonInPlay().includes(target)) return;
    const extra = selected.length === 1 ? extras.get(selected[0] as EnergyCard) : undefined;
    if (extra && !player.hand.cards.includes(extra.energyCard)) return;
    commit(extra ? [first, extra] : [first]);
  });
}

export function resolveHandEnergyAttachments(store: StoreLike, state: State, request: AttachEnergyFromHandEffect): State {
  const { player, attachments } = request;
  if (attachments.length === 0) return state;
  const turn = state.turn;
  const previous = attachments.map(attachment => attachment.target.getPokemonCard());
  const current = (attachment: AttachEnergyEffect) => attachment.player === player && attachment.sourceZone === undefined
    && player.hand.cards.includes(attachment.energyCard) && turn === state.turn
    && attachment.target.getPokemonCard() === previous[attachments.indexOf(attachment)]
    && state.players.some(owner => owner.getPokemonInPlay().includes(attachment.target));
  if (!attachments.every(current) || new Set(attachments.map(a => a.energyCard)).size !== attachments.length) {
    throw new GameError(GameMessage.INVALID_TARGET);
  }

  const spendsAttachment = request.useTurnAttachment && !player.usedDragonsWish && !state.rules.unlimitedEnergyAttachments;
  if (spendsAttachment && player.energyPlayedTurn === turn) throw new GameError(GameMessage.ENERGY_ALREADY_ATTACHED);
  const paymentChoices = () => player.hand.cards.filter(card => !attachments.some(a => a.energyCard === card));
  if (discardCost(attachments) > paymentChoices().length) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

  const interception = new CheckHandEnergyInterceptionEffect(player);
  state = store.reduceEffect(state, interception);
  const deferred = attachments.length > 1 || discardCost(attachments) > 0 || interception.requiresHeads;
  const check = (attempts: AttachEnergyEffect[]) => attempts.forEach(attachment =>
    store.reduceEffect(state, new CheckEnergyAttachmentEffect(attachment)));
  if (deferred) check(attachments);

  const commit = (permitted: AttachEnergyEffect[], payment: Card[]): State => {
    if (permitted.length === 0 || !permitted.every(current)) return state;
    if (spendsAttachment && player.energyPlayedTurn === turn) return state;
    if (deferred) check(permitted);
    if (payment.length > 0) {
      const payingEnergy = permitted.find(attachment => (attachment.energyCard.discardCostToAttachFromHand ?? 0) > 0)?.energyCard;
      state = store.reduceEffect(state, new PayHandEnergyAttachmentCostEffect(player, payment, payingEnergy));
      if (!payment.every(card => player.discard.cards.includes(card) || player.lostzone.cards.includes(card))) return state;
      for (const card of payment) store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
    }

    const completions: AfterAttachEnergyFromHandEffect[] = [];
    for (const attachment of permitted) {
      attachment.handAttachmentPrepared = true;
      attachment.completionBatch = completions;
      state = store.reduceEffect(state, attachment);
    }
    const attached = permitted.filter(attachment => attachment.target.cards.includes(attachment.energyCard));
    if (attached.length > 0) {
      if (spendsAttachment) player.energyPlayedTurn = turn;
      request.onAttached?.(state, attached);
    }
    const reactions: QueuedHandEnergyReaction[] = [];
    const complete = (index: number): void => {
      const completion = completions[index];
      if (!completion) {
        const chooser = state.players[state.activePlayer] ?? player;
        resolveHandEnergyReactions(store, state, chooser, reactions);
        return;
      }
      completion.reactionBatch = reactions;
      state = store.reduceEffect(state, completion);
      waitForHandEnergyPrompts(store, state, () => complete(index + 1));
    };
    complete(0);
    return state;
  };

  const payCost = (permitted: AttachEnergyEffect[]): State => {
    const needed = discardCost(permitted);
    if (needed === 0) return commit(permitted, []);
    const choices = paymentChoices();
    if (choices.length < needed) return state;
    const list = new CardList();
    list.cards = choices;
    return store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_DISCARD,
      list, {}, { min: needed, max: needed, allowCancel: false }), chosen => {
      const available = paymentChoices();
      if (chosen?.length === needed && new Set(chosen).size === needed && chosen.every(card => available.includes(card))) {
        commit(permitted, chosen);
      } else if (permitted.every(current)) {
        payCost(permitted);
      }
    });
  };

  if (!interception.requiresHeads) return payCost(attachments);
  const flip = (index: number, permitted: AttachEnergyEffect[]): State => {
    if (index >= attachments.length) return payCost(permitted);
    const attachment = attachments[index];
    if (!current(attachment)) return state;
    const coin = new CoinFlipEffect(player, heads => {
      if (!current(attachment)) return;
      if (heads) permitted.push(attachment);
      else state = store.reduceEffect(state, new MoveCardsEffect(player.hand, player.discard, { cards: [attachment.energyCard] }));
      flip(index + 1, permitted);
    });
    // Slimy Room belongs to the opposing Pokémon even if an attack caused the attachment.
    coin.skipReflipStadium = true;
    return store.reduceEffect(state, coin);
  };
  return flip(0, []);
}

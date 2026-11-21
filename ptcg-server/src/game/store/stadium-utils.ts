import { Card } from './card/card';
import { CardTag } from './card/card-types';
import { StateUtils } from './state-utils';
import { Player } from './state/player';
import { State } from './state/state';

export const pendingBenchStadiumDeparture = new WeakMap<State, Player>();

export function recordBenchStadiumDeparture(state: State, owner: Player, stadium: Card | undefined): void {
  if (stadium?.name === 'Sky Field' || stadium?.name === 'Area Zero Underdepths') {
    pendingBenchStadiumDeparture.set(state, owner);
  }
}

export function discardStadiumSlot(state: State, owner: Player, replacement = false): void {
  const stadium = owner.stadium;
  recordBenchStadiumDeparture(state, owner, stadium.cards[0]);
  const returning = stadium.cards.filter(card => card.returnsToHandWhenDiscardedAsStadium);
  stadium.moveCardsTo(returning, owner.hand);
  if (replacement && stadium.cards.some(card => card.tags.includes(CardTag.PRISM_STAR))) {
    stadium.moveTo(owner.lostzone);
  } else {
    stadium.moveTo(owner.discard);
  }
}

export function DISCARD_A_STADIUM_CARD_IN_PLAY(state: State): void {
  const stadium = StateUtils.getStadiumCard(state);
  if (!stadium) return;
  discardStadiumSlot(state, StateUtils.findOwner(state, StateUtils.findCardList(state, stadium)));
}

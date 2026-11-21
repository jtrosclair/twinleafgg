import { CardTag } from './card/card-types';
import { StateUtils } from './state-utils';
import { Player } from './state/player';
import { State } from './state/state';

export function discardStadiumSlot(owner: Player, replacement = false): void {
  const stadium = owner.stadium;
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
  discardStadiumSlot(StateUtils.findOwner(state, StateUtils.findCardList(state, stadium)));
}

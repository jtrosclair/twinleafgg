import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { EnergyCard, StateUtils } from '../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

function playCard(store: StoreLike, state: State, effect: TrainerEffect): State {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const uniqueBasicEnergies = player.deck.cards
    .filter(c => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC)
    .map(e => (e as EnergyCard).provides[0])
    .filter((value, index, self) => self.indexOf(value) === index)
    .length;

  // Ref: set-silver-tempest/durant.ts (select, move, reveal, then shuffle)
  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { min: 0, max: uniqueBasicEnergies, allowCancel: false, differentTypes: true }
  ), selected => {
    const cards = selected || [];
    if (cards.length === 0) {
      SHUFFLE_DECK(store, state, player);
      return;
    }
    // Ref: set-silver-tempest/durant.ts (reveal searched cards and shuffle).
    // Queue the move only after the reveal finishes, so it cannot be reordered.
    store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => {
      MOVE_CARDS(store, state, player.deck, player.hand, {
        cards, sourceCard: effect.trainerCard, sourceEffect: effect
      });
      SHUFFLE_DECK(store, state, player);
    });
  });
}

export class EnergySearchPro extends TrainerCard {

  public tags = [CardTag.ACE_SPEC];

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'H';

  public setNumber = '176';

  public set: string = 'SSP';

  public name: string = 'Energy Search Pro';

  public fullName: string = 'Energy Search Pro SSP';

  public cardImage: string = 'assets/cardback.png';

  public text: string =
    'Search your deck for any number of Basic Energy cards of different types, reveal them, and put them into your hand. Then, shuffle your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return playCard(store, state, effect);
    }

    return state;
  }

}
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt } from '../../game';
import { StoreLike, State, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Durant extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Energy Digging',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Bite',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '13';

  public name: string = 'Durant';

  public fullName: string = 'Durant SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Copied from Gimmighoul SSP's Minor Errand-Running
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      if (player.deck.cards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this, sourceEffect: effect });
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}

import { flipLegacyCoinsUntilTails } from '../../game/store/prefabs/attack-coin-reflip';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CardList, ChooseCardsPrompt, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Moltres extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 80;

  public weakness = [];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Dry Up',
      cost: [R, R],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Pokémon and flip a coin until you get tails. For each heads, discard 1 Water Energy card attached to that Pokémon, if any.'
    },
    {
      name: 'Fire Wing',
      cost: [R, R, R, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'VS2';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '14';

  public name: string = 'Moltres';

  public fullName: string = 'Moltres VS2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-platinum/dialga-g-lv-x.ts (select exactly the final number of cards).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const { player, opponent } = effect;
      return store.prompt(state, new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.TOP_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], { allowCancel: false }), ([target]) => {
        flipLegacyCoinsUntilTails(store, state, player, heads => {
          if (heads === 0) return;
          const provided = new CheckProvidedEnergyEffect(opponent, target);
          store.reduceEffect(state, provided);
          const water = new CardList();
          water.cards = [...new Set(provided.energyMap.filter(entry =>
            entry.provides.includes(CardType.WATER) || entry.provides.includes(CardType.ANY)).map(entry => entry.card))];
          const count = Math.min(heads, water.cards.length);
          if (count === 0) return;

          store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_ENERGIES_TO_DISCARD, water, {},
            { min: count, max: count, allowCancel: false }), cards => {
            const discard = new DiscardCardsEffect(effect, cards);
            discard.target = target;
            store.reduceEffect(state, discard);
          });
        });
      });
    }
    return state;
  }
}

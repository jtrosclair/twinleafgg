import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, SlotType, PlayerType } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { ATTACH_ENERGY_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class VictiniVMAX extends PokemonCard {

  public tags = [CardTag.POKEMON_VMAX];

  public regulationMark = 'E';

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Victini V';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 310;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Spreading Flames',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Attach up to 3 [R] Energy cards from your discard pile to ' +
        'your Pokémon in any way you like.'
    },
    {
      name: 'Max Victory',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: 100,
      text: 'If your opponent\'s Active Pokémon is a Pokémon V, this ' +
        'attack does 120 more damage.'
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '22';

  public name: string = 'Victini VMAX';

  public fullName: string = 'Victini VMAX BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return ATTACH_ENERGY_PROMPT(store, state, player, PlayerType.BOTTOM_PLAYER, SlotType.DISCARD,
        [SlotType.BENCH, SlotType.ACTIVE], { energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: true, min: 0, max: 3 });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const defending = opponent.active.getPokemonCard();
      if (defending && (defending.tags.includes(CardTag.POKEMON_V) ||
        defending.tags.includes(CardTag.POKEMON_VMAX) ||
        defending.tags.includes(CardTag.POKEMON_VSTAR))) {
        effect.damage += 120;
      }
    }

    return state;
  }

}

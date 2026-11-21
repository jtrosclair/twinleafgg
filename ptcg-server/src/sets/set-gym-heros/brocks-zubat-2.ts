import { FLIP_COIN_TO_APPLY_ATTACK_CONDITION } from '../../game/store/prefabs/attack-effects';
import { State, StoreLike } from '../../game';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class BrocksZubat2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.BROCKS];
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: P }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Wing Attack',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Poison Fang',
    cost: [G, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Brock\'s Zubat';
  public fullName: string = 'Brock\'s Zubat G1 74';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_COIN_TO_APPLY_ATTACK_CONDITION(state, effect, SpecialCondition.POISONED);
    }

    return state;
  }
}
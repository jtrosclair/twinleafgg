import { SpecialCondition } from '../../game/store/card/card-types';
import { coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Nidoran extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = P;
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for Nidoran ♂ or Nidoran ♀ and put it onto your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Poison Sting',
    cost: [P, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Nidoran ♀';
  public fullName: string = 'Nidoran ♀ MT';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: game/store/prefabs/search-basic-to-bench.ts (private search and public Bench placement).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (store, next) => searchBasicsToBench(store, next, effect, 1, ['Nidoran ♀', 'Nidoran ♂']));
    // Ref: set-great-encounters/ekans.ts (coin and original-defender condition).
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.POISONED);
    return state;
  }
}

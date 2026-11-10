import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';
import { SpecialCondition } from '../../game/store/card/card-types';
import { coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Girafarig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = C;
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Crane Neck',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Trainer card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Psybeam',
    cost: [C, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Girafarig';
  public fullName: string = 'Girafarig MT';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-secret-wonders/stantler.ts (private search and public reveal).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (store, next) =>
      SEARCH_DECK_REVEAL_AND_MOVE(store, next, effect, effect.source.getPokemonCard() || this, { superType: SuperType.TRAINER }, 1));
    // Ref: set-great-encounters/ekans.ts (coin and original-defender condition).
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.CONFUSED);
    return state;
  }
}

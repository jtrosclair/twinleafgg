import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SuperType, TrainerType, SpecialCondition } from '../../game/store/card/card-types';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Stantler extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = C;
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Lead',
    cost: [],
    damage: 0,
    text: 'Search your deck for a Supporter card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Frighten Horn',
    cost: [C, C],
    damage: 20,
    text: 'If the Defending Pokémon isn\'t an Evolved Pokémon, that Pokémon is now Confused.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '113';
  public name: string = 'Stantler';
  public fullName: string = 'Stantler SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-astral-radiance/combee.ts (private search, reveal then shuffle).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const attackingCard = effect.source.getPokemonCard() || this;
      afterAttackDamage(state, effect, (postStore, nextState) => SEARCH_DECK_REVEAL_AND_MOVE(postStore, nextState, effect, attackingCard, { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER }, 1));
    }
    // Ref: set-great-encounters/drowzee.ts (condition on original defender).
    if (WAS_ATTACK_USED(effect, 1, this)) afterAttackDamageForOriginalDefender(state, effect, (postStore, nextState, target) => {
      if (target.isEvolved()) return nextState;
      const confused = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]); confused.target = target; return postStore.reduceEffect(nextState, confused);
    });
    return state;
  }
}

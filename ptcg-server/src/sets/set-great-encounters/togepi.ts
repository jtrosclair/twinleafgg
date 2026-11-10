import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';
import { conditionAfterDamage } from './ge-attack-effects';
import { State, StoreLike } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';

export class Togepi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = C;
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Yawn',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Find a Friend',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, search your deck for a Pokémon, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Togepi';
  public fullName: string = 'Togepi GE';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/ge-attack-effects.ts (original defender condition).
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    // Ref: set-secret-wonders/stantler.ts (private search and public reveal).
    if (WAS_ATTACK_USED(effect, 1, this)) afterAttackDamage(state, effect, (store, next) =>
      COIN_FLIP_PROMPT(store, next, effect.player, heads => {
        if (heads) SEARCH_DECK_REVEAL_AND_MOVE(store, next, effect, effect.source.getPokemonCard() || this, { superType: SuperType.POKEMON }, 1);
      }));
    return state;
  }
}

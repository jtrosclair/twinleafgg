import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition, SuperType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';
import { coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Treecko extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 50;

  public cardType: CardType = G;

  public weakness = [{ type: R, value: +10 }];

  public resistance = [{ type: W, value: -20 }];

  public retreat = [C];

  public attacks = [{
    name: 'Call for Friends',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Poison Breath',
    cost: [G],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'SF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '79';

  public name: string = 'Treecko';

  public fullName: string = 'Treecko SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Treecko.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => { SEARCH_DECK_FOR_CARDS_TO_HAND(s, next, effect.player, effect.source.getPokemonCard() || this, { superType: SuperType.POKEMON, stage: Stage.BASIC } as Partial<PokemonCard>, { min: 0, max: 1, allowCancel: false }, effect); return next; });
    // Ref: set-great-encounters/ge-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.POISONED);
    return state;
  }
}

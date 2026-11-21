import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike, State, PowerType } from '../../game';
import { applyDamp } from '../../game/store/prefabs/ability-lock';

export class Psyduck extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Damp',
    powerType: PowerType.ABILITY,
    text: 'Pokémon in play (both yours and your opponent\'s) lose any Ability that requires the Pokémon using it to Knock Out itself.'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'MEP';
  public setNumber = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Psyduck';
  public fullName: string = 'Psyduck SVP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    applyDamp(store, state, effect, this);
    return state;
  }

  /** Its printed attack has no additional effects; its Ability is not copied. */
  public reduceCopiedAttackEffect(_store: StoreLike, state: State, _effect: Effect, _attackIndex: number): State {
    return state;
  }

}

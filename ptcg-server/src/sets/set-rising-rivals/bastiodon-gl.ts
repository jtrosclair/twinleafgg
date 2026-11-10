import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class BastiodonGL extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_SP];

  public hp: number = 90;

  public cardType: CardType = M;

  public weakness = [{ type: R }];

  public resistance = [{ type: P, value: -20 }];

  public retreat = [C, C, C];

  public attacks = [{
    name: 'Bounce Back',
    cost: [M, C, C],
    damage: 30,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  }, {
    name: 'Smack Attack',
    cost: [M, C, C, C],
    damage: 60,
    text: 'Remove 1 damage counter from Bastiodon GL.'
  }];

  public set: string = 'RR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name: string = 'Bastiodon GL';

  public fullName: string = 'Bastiodon GL RR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return BastiodonGL.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/opponent-switch-after-attack.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) opponentSwitchAfterAttack(state, effect, effect.source.getPokemonCard() || this);
    // Ref: set-great-encounters/ge-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) healAttackerAfterDamage(state, effect, 10);
    return state;
  }
}

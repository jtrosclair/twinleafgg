import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';

export class Staravia extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Starly';
  public hp = 70;
  public cardType: CardType = C;
  public weakness = [{ type: L, value: 20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat: CardType[] = [];
  public attacks = [{
    name: 'Whirlwind', cost: [C, C], damage: 20,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  }, {
    name: 'Clutch', cost: [C, C], damage: 20,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];
  public set = 'DP';
  public setNumber = '64';
  public cardImage = 'assets/cardback.png';
  public name = 'Staravia';
  public fullName = 'Staravia DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Staravia.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-diamond-and-pearl/heracross.ts (post-damage opponent switch).
    if (WAS_ATTACK_USED(effect, 0, this)) opponentSwitchAfterAttack(state, effect, this);
    // Ref: game/store/prefabs/post-damage-identity.ts (original defender).
    if (WAS_ATTACK_USED(effect, 1, this)) retreatLockAfterDamage(state, effect);
    return state;
  }
}

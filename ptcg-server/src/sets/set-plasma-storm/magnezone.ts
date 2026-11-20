import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckSupporterLimitEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Magnezone extends PokemonCard implements CopiedAttackOwnershipContract {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Magneton';
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [  {
    name: 'Dual Brains',
    powerType: PowerType.ABILITY,
    text: 'During your turn, you may play 2 Supporter cards.'
  }];

  public attacks = [
    {
      name: 'Gyro Ball',
      cost: [L, L, C],
      damage: 80,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon. Then, your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
    }
  ];

  public set: string = 'PLS';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magnezone';
  public fullName: string = 'Magnezone PLS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: Pokémon TCG ruling 8838. The limit applies to the player for
    // the whole turn, even if a different Magnezone supplies the Ability.
    if (effect instanceof CheckSupporterLimitEffect
      && StateUtils.isPokemonInPlay(effect.player, this)
      && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      effect.limit = Math.max(effect.limit, 2);
    }

    return this.reduceCopiedAttackEffect(store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(_store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-secret-wonders/donphan.ts uses the same switch effects.
    // Gyro Ball requires the attacker's switch to succeed first.
    if (WAS_ATTACK_USED(effect, 0, this)) {
      let switched = false;
      selfSwitchAfterAttack(state, effect, () => { switched = true; });
      opponentSwitchAfterAttack(state, effect, effect.source.getPokemonCard() || this, () => switched);
    }

    return state;
  }
}

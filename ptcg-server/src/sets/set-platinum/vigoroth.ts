import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { targetDamageAfter, optionalSelfSwitchAfter, healTeamAfter, coinRecoilAfter } from './round24-attack-helpers';

export class Vigoroth extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Slakoth";
  public cardType: CardType = CardType.COLORLESS;
  public hp = 80;
  public weakness = [{ type: CardType.FIGHTING, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Reckless Charge", cost: [CardType.COLORLESS], damage: 30, text: "Flip a coin. If tails, Vigoroth does 10 damage to itself." },
    { name: "Fight Back", cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 50, damageCalculation: "+", text: "If Vigoroth has any damage counters on it, this attack does 50 damage plus 20 more damage." }
  ];
  public set = 'PL';
  public setNumber = "64";
  public cardImage = 'assets/cardback.png';
  public name = "Vigoroth";
  public fullName = "Vigoroth PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Vigoroth.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinRecoilAfter(state,effect,10);
    if (WAS_ATTACK_USED(effect, 1, this) && effect.source.damage>0) effect.damage+=20;
    return state;
  }
}

import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Kricketune extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Kricketot";
  public cardType: CardType = CardType.GRASS;
  public hp = 90;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Revenge Melody", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, damageCalculation: "x", text: "Does 20 damage times the number of Kricketot and Kricketune in your discard pile." },
    { name: "Bug Buzz", cost: [CardType.GRASS, CardType.GRASS], damage: 50, damageCalculation: "+", text: "If the Defending Pokémon is Asleep, this attack does 50 damage plus 30 more damage. Remove the Special Condition Asleep from the Defending Pokémon." }
  ];
  public set = 'PL';
  public setNumber = "32";
  public cardImage = 'assets/cardback.png';
  public name = "Kricketune";
  public fullName = "Kricketune PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Kricketune.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) { const n=effect.player.discard.cards.filter(c=>c.name==='Kricketot'||c.name==='Kricketune').length; effect.damage=n?Math.max(0,effect.damage+20*n-effect.attack.damage):0; }
    if (WAS_ATTACK_USED(effect, 1, this) && effect.opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
      effect.damage+=30; afterAttackDamageForOriginalDefender(state,effect,(s,next,target)=>{const remove=new RemoveSpecialConditionsEffect(effect,[SpecialCondition.ASLEEP]);remove.target=target;return s.reduceEffect(next,remove);});
    }
    return state;
  }
}

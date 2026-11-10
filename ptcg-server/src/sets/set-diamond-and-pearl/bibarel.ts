import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect, HealTargetEffect, RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Bibarel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bidoof';
  public hp: number = 100;
  public cardType: CardType = C;
  public weakness = [{ type: F, value: 20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rest',
    cost: [C],
    damage: 0,
    text: 'Remove all Special Conditions and 4 damage counters from Bibarel. Bibarel is now Asleep.'
  },
  {
    name: 'Take Down',
    cost: [C, C, C],
    damage: 60,
    text: 'Bibarel does 10 damage to itself.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Bibarel';
  public fullName: string = 'Bibarel DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/goldeen.ts (original attacker after damage).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source = effect.source;
      const attacker = source.getPokemonCard();
      afterAttackDamage(state, effect, (postStore, postState) => {
        if (!attacker || source.getPokemonCard() !== attacker ||
          !postState.players.some(player => player.active === source || player.bench.includes(source))) return postState;
        const remove = new RemoveSpecialConditionsEffect(effect, undefined);
        remove.target = source;
        postState = postStore.reduceEffect(postState, remove);
        const heal = new HealTargetEffect(effect, 40);
        heal.target = source;
        postState = postStore.reduceEffect(postState, heal);
        if (effect.player.active !== source || source.getPokemonCard() !== attacker) return postState;
        const sleep = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
        sleep.target = source;
        return postStore.reduceEffect(postState, sleep);
      });
    }

    // Ref: set-diamond-and-pearl/goldeen.ts (post-damage recoil).
    // Take Down
    if (WAS_ATTACK_USED(effect, 1, this)) {
      recoilAfterAttack(state, effect, 10);
    }

    return state;
  }
}

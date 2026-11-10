import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealTargetEffect, RemoveSpecialConditionsEffect, AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

export class Teddiursa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = C;
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rest',
    cost: [C],
    damage: 0,
    text: 'Remove all Special Conditions and 2 damage counters from Teddiursa. Teddiursa is now Asleep.'
  },
  {
    name: 'Sweet Palm',
    cost: [C, C],
    damage: 30,
    text: 'Before doing damage, remove 1 damage counter from the Defending Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Teddiursa';
  public fullName: string = 'Teddiursa MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-mysterious-treasures/status-after-damage.ts (self condition timing).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source = effect.source, attacker = source.getPokemonCard();
      afterAttackDamage(state, effect, (effectStore, resultState) => {
        const inPlay = resultState.players.some(p => p.active === source || p.bench.includes(source));
        if (!attacker || !inPlay || source.getPokemonCard() !== attacker) return resultState;
        const clear = new RemoveSpecialConditionsEffect(effect, undefined); clear.target = source;
        resultState = effectStore.reduceEffect(resultState, clear);
        const heal = new HealTargetEffect(effect, 20); heal.target = source;
        resultState = effectStore.reduceEffect(resultState, heal);
        if (effect.player.active === source && source.getPokemonCard() === attacker) {
          const sleep = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]); sleep.target = source;
          resultState = effectStore.reduceEffect(resultState, sleep);
        }
        return resultState;
      });
    }

    // Ref: game/store/effect-reducers/attack-effect.ts (healing the defending target).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const healTargetEffect = new HealTargetEffect(effect, 10);
      healTargetEffect.target = opponent.active;
      store.reduceEffect(state, healTargetEffect);
    }

    return state;
  }
}

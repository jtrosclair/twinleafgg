import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Slakoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = C;
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Drowsy',
    cost: [C],
    damage: 0,
    text: 'Both Slakoth and the Defending Pokémon are now Asleep.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Slakoth';
  public fullName: string = 'Slakoth MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-mysterious-treasures/status-after-damage.ts (Special Conditions).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source = effect.source, attacker = source.getPokemonCard();
      const target = effect.opponent.active, defender = target.getPokemonCard();
      afterAttackDamage(state, effect, (effectStore, resultState) => {
        if (defender && effect.opponent.active === target && target.getPokemonCard() === defender) {
          const theirs = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
          theirs.target = target; resultState = effectStore.reduceEffect(resultState, theirs);
        }
        if (attacker && effect.player.active === source && source.getPokemonCard() === attacker) {
          const ours = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
          ours.target = source; resultState = effectStore.reduceEffect(resultState, ours);
        }
        return resultState;
      });
    }

    return state;
  }
}

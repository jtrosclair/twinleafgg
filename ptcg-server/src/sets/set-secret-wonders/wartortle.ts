import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';


export class Wartortle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Squirtle';
  public hp: number = 80;
  public cardType: CardType = W;
  public weakness = [{ type: L, value: 20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Giant Wave',
    cost: [W, W],
    damage: 40,
    text: 'Wartortle can\'t use Giant Wave during your next turn.'
  },
{
    name: 'Shell Attack',
    cost: [C, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Wartortle';
  public fullName: string = 'Wartortle SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Refs: set-battle-styles/single-strike-urshifu-v.ts (restriction), set-great-encounters/ekans.ts (original attacker identity).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source = effect.source, attacker = source.getPokemonCard(), attackName = effect.attack.name;
      afterAttackDamage(state, effect, (_store, nextState) => {
        const inPlay = nextState.players.some(player => player.active === source || player.bench.includes(source));
        if (attacker && inPlay && source.getPokemonCard() === attacker && !source.cannotUseAttacksNextTurnPending.includes(attackName)) {
          source.cannotUseAttacksNextTurnPending.push(attackName);
        }
        return nextState;
      });
    }
    return state;
  }
}

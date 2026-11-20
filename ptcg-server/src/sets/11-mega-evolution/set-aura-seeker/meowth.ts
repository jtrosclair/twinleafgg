import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { afterAttackDamage } from '../../../game/store/prefabs/attack-after-damage';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Meowth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Pay Day',
    cost: [C],
    damage: 10,
    text: 'Draw a card.'
  }, {
    name: 'Scratch',
    cost: [C, C, C],
    damage: 40,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Meowth';
  public fullName: string = 'Meowth FLO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: attack-after-damage.ts (apply the draw after Pay Day’s damage).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamage(state, effect, (_store, currentState) => {
        DRAW_CARDS(effect.player, 1);
        return currentState;
      });
    }

    return state;
  }
}

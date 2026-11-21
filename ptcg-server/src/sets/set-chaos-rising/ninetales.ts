import { CardType, Stage, PokemonCard, State, StoreLike, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { moveBenchedDamageCountersToDefender } from '../../game/store/prefabs/damage-counter-movement';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ninetales extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Vulpix';
  public hp: number = 120;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Nine-tailed Reflect',
    cost: [R],
    damage: 0,
    text: 'Move all damage counters from 1 of your Benched Pokémon to your opponent\'s Active Pokémon.'
  },
  {
    name: 'Will-o-Wisp',
    cost: [R, R],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public usSetNumber = 'CRI 9';
  public name: string = 'Ninetales';
  public fullName: string = 'Ninetales M4';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-twilight-masquerade/munkidori.ts (separate removal from counter placement).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      moveBenchedDamageCountersToDefender(state, effect, GameMessage.CHOOSE_POKEMON, () => true);
    }
    return state;
  }
}

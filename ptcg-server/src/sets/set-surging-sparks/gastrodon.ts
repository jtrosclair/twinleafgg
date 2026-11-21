import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { applyScopedAbilityLock } from '../../game/store/prefabs/ability-lock';

export class Gastrodon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shellos';
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Sticky Bind',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, Benched Stage 2 Pokémon (both yours and your opponent\'s) have no Abilities.'
  }];

  public attacks = [{
    name: 'Mud Shot',
    cost: [F, C, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'SSP';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Gastrodon';
  public fullName: string = 'Gastrodon SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    applyScopedAbilityLock(store, state, effect, this, {
      sourceOnBench: true,
      affects: (_power, target, benched) => benched && target.stage === Stage.STAGE_2,
    });
    return state;
  }
}

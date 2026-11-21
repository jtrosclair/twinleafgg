import { CardType, PokemonCard, Stage, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { reduceBufferAndMiraclePowder } from './hoppip';

export class Skiploom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hoppip';
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [];

  public powers = [{
    name: 'Buffer',
    powerType: PowerType.POKEBODY,
    text: 'If Skiploom would be Knocked Out by an opponent\'s attack, flip a coin. If heads, Skiploom is not Knocked Out and its remaining HP becomes 10 instead.'
  }];

  public attacks = [{
    name: 'Miracle Powder',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, choose 1 Special Condition. The Defending Pokémon is now affected by that Special Condition.'
  }];

  public set: string = 'TRR';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Skiploom';
  public fullName: string = 'Skiploom TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return reduceBufferAndMiraclePowder(store, state, effect, this);
  }
}

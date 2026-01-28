import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';

export class Timburr extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Low Kick',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Strength',
    cost: [F, C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Timburr';
  public fullName: string = 'Timburr SV11B';
}

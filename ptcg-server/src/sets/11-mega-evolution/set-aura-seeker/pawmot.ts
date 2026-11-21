import { CardType, PokemonCard, PowerType, Stage } from '../../../game';

export class Pawmot extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Pawmo';
  public hp: number = 130;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Double Strike',
    powerType: PowerType.ABILITY,
    barrage: true,
    text: 'This Pokémon can use an attack two times in a row. (If your opponent\'s Active Pokémon is Knocked Out by the first attack, use the second attack after the new Active Pokémon is moved to the Active Spot.)'
  }];

  public attacks = [{
    name: 'Mach Bolt',
    cost: [L, L],
    damage: 100,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Pawmot';
  public fullName: string = 'Pawmot FLO';
}

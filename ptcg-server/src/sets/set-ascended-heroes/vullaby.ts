import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Vullaby extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp = 70;
  public cardType: CardType = D;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];
  public attacks = [{ name: 'Flap', cost: [C, C], damage: 20, text: '' }];
  public regulationMark = 'J';
  public set = 'ASC';
  public cardImage = 'assets/cardback.png';
  public setNumber = '138';
  public name = 'Vullaby';
  public fullName = 'Vullaby ASC';
}

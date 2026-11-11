import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, CardTag } from '../../game/store/card/card-types';

// Upstream: ptcg-server/src/sets/07-x-and-y/set-double-crisis/team-aquas-spheal.ts
export class Round32TeamAquasSphealDCR extends PokemonCard {
  public stage = Stage.BASIC;
  public tags = [CardTag.TEAM_AQUA];
  public hp = 60;
  public cardType = CardType.WATER;
  public weakness = [{ type: CardType.METAL }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Water Gun", cost: [CardType.WATER], damage: 10, text: '' }
  ];
  public set = "DCR";
  public setNumber = "3";
  public cardImage = 'assets/cardback.png';
  public name = "Team Aqua's Spheal";
  public fullName = "Team Aqua's Spheal DCR";
}

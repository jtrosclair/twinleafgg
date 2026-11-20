import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Rockruff extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public regulationMark = 'I';
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public attacks = [
    {
      name: 'Dig It Up',
      cost: [C],
      damage: 0,
      text: 'Look at the top card of your deck. You may discard that card.'
    },
    { name: 'Stampede', cost: [C, C], damage: 20, text: '' },
  ];

  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Rockruff';
  public fullName: string = 'Rockruff JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      // Ref: set-fusion-strike/sandshrew.ts (Dig It Up).
      return LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store, state, player, player);
    }
    return state;
  }
}
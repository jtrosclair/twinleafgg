import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bisharp extends PokemonCard {
  public stage = Stage.STAGE_1; public evolvesFrom = 'Pawniard'; public hp = 120;
  public cardType: CardType = M; public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }]; public retreat = [C];
  public attacks = [{ name: 'Rapid Draw', cost: [M], damage: 50, text: 'Draw 2 cards.' }];
  public regulationMark = 'I'; public set = 'ASC'; public setNumber = '147';
  public cardImage = 'assets/cardback.png'; public name = 'Bisharp'; public fullName = 'Bisharp ASC';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-30th-celebration/zeraora.ts (Rapid Draw).
    if (WAS_ATTACK_USED(effect, 0, this)) DRAW_CARDS(effect.player, 2);
    return state;
  }
}

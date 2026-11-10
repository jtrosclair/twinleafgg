import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsExeggcute extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags: CardTag[] = [CardTag.TEAM_ROCKET];
  public hp = 60;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];
  public attacks = [{
    name: 'Focused Wish', cost: [P], damage: 10, damageCalculation: '+' as '+',
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];
  public regulationMark = 'I';
  public set = 'ASC';
  public cardImage = 'assets/cardback.png';
  public setNumber = '77';
  public name = 'Team Rocket\'s Exeggcute';
  public fullName = 'Team Rocket\'s Exeggcute ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-battle-styles/espurr.ts (Focused Wish)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }
    return state;
  }
}

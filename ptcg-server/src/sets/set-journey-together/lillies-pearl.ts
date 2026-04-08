import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { GamePhase } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';


export class LilliesPearl extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'I';

  public set: string = 'JTG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public name: string = 'Lillie\'s Pearl';

  public fullName: string = 'Lillie\'s Pearl JTG';

  public text: string = 'If the Lillie\'s Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 fewer Prize card.';

  // public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.tools.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Pearl only works if knocked out by attack damage, not by other effects like damage counters
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      if (IS_TOOL_BLOCKED(store, state, player, this)) { return state; }

      if (effect.target.isLillies()) {
        effect.prizeCount -= 1;
      }

      return state;
    }
    return state;
  }
}




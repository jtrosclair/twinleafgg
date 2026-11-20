import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';

export class ToolJammer extends TrainerCard {

  public regulationMark = 'E';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '136';

  public name: string = 'Tool Jammer';

  public fullName: string = 'Tool Jammer BST';

  public text: string =
    'As long as the Pokémon this card is attached to is in the Active Spot, Pokémon Tools attached to your opponent\'s Active Pokémon have no effect, except for Tool Jammer.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof ToolEffect && effect.card.name !== this.name) {
      const owner = state.players.find(player => player.active.getPokemonCard() && player.active.tools.includes(this));
      if (owner && StateUtils.getOpponent(state, owner).active.tools.includes(effect.card)
        && !IS_TOOL_BLOCKED(store, state, owner, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }
    return state;
  }
}

import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError, TrainerType } from '../../game';
import { CardTag } from '../../game/store/card/card-types';
import { choosePokemonToReturn } from '../../game/store/prefabs/choose-pokemon-to-return';

export class ProfessorTurosScenario extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public tags = [CardTag.FUTURE];
  public regulationMark = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '171';
  public name: string = 'Professor Turo\'s Scenario';
  public fullName: string = 'Professor Turo\'s Scenario PAR';

  public text: string =
    'Put 1 of your Pokémon in play into your hand. (Discard all cards attached to that Pokémon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      if (effect.player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }
      return choosePokemonToReturn(store, state, effect.player, false);
    }
    return state;
  }
}

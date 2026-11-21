import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError, Player } from '../../game';
import { choosePokemonToReturn } from '../../game/store/prefabs/choose-pokemon-to-return';

export class Penny extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '183';

  public name: string = 'Penny';

  public fullName: string = 'Penny SVI';

  public text: string =
    'Put 1 of your Basic Pokémon and all attached cards into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.supporterTurn <= 0
      && player.getPokemonInPlay().some(slot => slot.isStage(Stage.BASIC));
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      if (effect.player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }
      return choosePokemonToReturn(store, state, effect.player, true, card => card.stage === Stage.BASIC);
    }
    return state;
  }
}

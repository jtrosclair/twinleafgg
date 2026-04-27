import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { SlotType } from '../../game/store/actions/play-card-action';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class PokemonCenterLady extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'MEG';
  public setNumber: string = '123';
  public regulationMark = 'I';
  public name: string = 'Pokémon Center Lady';
  public fullName: string = 'Pokémon Center Lady M1S';
  public text: string = 'Heal 60 damage from 1 of your Pokémon, and it recovers from all Special Conditions.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          const target = targets[0];

          const healEffect = new HealEffect(player, target, 60);
          store.reduceEffect(state, healEffect);

          target.specialConditions = [];
        }
      });
    }

    return state;
  }
}

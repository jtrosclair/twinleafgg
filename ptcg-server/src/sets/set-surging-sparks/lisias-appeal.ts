import { CardTarget, GameError, PlayerType, SlotType, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { SpecialCondition, Stage } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { CopiedSupporterEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class LisiasAppeal extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '179';

  public name: string = 'Lisia\'s Appeal';

  public fullName: string = 'Lisia\'s Appeal SSP';

  public text: string =
    'Switch in 1 of your opponent\'s Benched Basic Pokémon to the Active Spot. The new Active Pokémon is now Confused.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;
    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (!opponent.bench.some(slot => slot.isStage(Stage.BASIC))) {
      if (effect instanceof CopiedSupporterEffect) return state;
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    const blocked: CardTarget[] = [];
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (slot, _card, target) => {
      if (target.slot === SlotType.BENCH && !slot.isStage(Stage.BASIC)) blocked.push(target);
    });

    return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, {
      sourceEffect: effect, blocked,
      onSwitched: target => {
        if (effect instanceof CopiedSupporterEffect && effect.attackSource) {
          const confusion = new AddSpecialConditionsEffect(effect.attackSource, [SpecialCondition.CONFUSED]);
          confusion.target = target;
          store.reduceEffect(state, confusion);
        } else {
          store.reduceEffect(state, new AddSpecialConditionsPowerEffect(player, this, target, [SpecialCondition.CONFUSED]));
        }
      },
    });
  }
}

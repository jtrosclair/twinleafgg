import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_TOOL_BLOCKED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { registerKnockOutEnergyTransfer, wasActiveWhenDamaged } from '../../game/store/prefabs/knock-out-effects';

export class ExpShare extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '174';

  public name: string = 'Exp. Share';

  public fullName: string = 'Exp. Share SVI';

  public text: string =
    'When your Active Pokemon is Knocked Out by damage from an opponent\'s ' +
    'attack, you may move 1 basic Energy card that was attached to that ' +
    'Pokemon to the Pokemon this card is attached to.';

  public readonly EXP_SHARE_MARKER: string = 'EXP_SHARE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard
      && wasActiveWhenDamaged(effect)) {
      const { player, target } = effect;
      const recipient = [player.active, ...player.bench].find(slot => slot !== target && slot.tools.includes(this));
      if (recipient && !IS_TOOL_BLOCKED(store, state, player, this)) {
        registerKnockOutEnergyTransfer(store, state, effect, this, { max: 1, optional: true, recipient });
      }
    }
    return state;
  }
}

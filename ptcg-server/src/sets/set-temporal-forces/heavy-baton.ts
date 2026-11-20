import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_TOOL_BLOCKED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { registerKnockOutEnergyTransfer, wasActiveWhenDamaged } from '../../game/store/prefabs/knock-out-effects';
import { getAttackDamagePosition } from '../../game/store/state/pokemon-card-list';

export class HeavyBaton extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'TEF';

  public name: string = 'Heavy Baton';

  public fullName: string = 'Heavy Baton PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public text: string =
    'If the Pokémon this card is attached to has a Retreat Cost of exactly 4, is in the Active Spot, and is Knocked Out by damage from an attack from your opponent\'s Pokémon, move up to 3 Basic Energy cards from that Pokémon to your Benched Pokémon in any way you like.';

  public readonly HEAVY_BATON_MARKER = 'HEAVY_BATON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard
      && wasActiveWhenDamaged(effect) && effect.target.tools.includes(this)
      && !IS_TOOL_BLOCKED(store, state, effect.player, this)) {
      let retreatCost = getAttackDamagePosition(effect.target)?.retreatCostBeforeSwitch;
      if (retreatCost === undefined) {
        const check = new CheckRetreatCostEffect(effect.player);
        store.reduceEffect(state, check);
        retreatCost = check.cost.length;
      }
      if (retreatCost === 4) {
        registerKnockOutEnergyTransfer(store, state, effect, this, { max: 3 });
      }
    }
    return state;
  }
}

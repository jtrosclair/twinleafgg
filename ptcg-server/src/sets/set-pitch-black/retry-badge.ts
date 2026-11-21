import { CheckAttackCoinReflipEffect } from '../../game/store/effects/play-card-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

export class RetryBadge extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'PBL';
  public setNumber: string = '74';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Retry Badge';
  public fullName: string = 'Retry Badge M5';
  public text: string = 'Once during your turn, after you flip any coins for an attack of the [C] Pokémon this card is attached to, you may ignore the results of those coin flips and begin flipping those coins again.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-phantom-forces/trick-coin.ts (reflip Tool attached to the attacker).
    if (effect instanceof CheckAttackCoinReflipEffect && effect.playerFlipped && effect.attacker.tools.includes(this)
      && !IS_TOOL_BLOCKED(store, state, effect.player, this)) {
      const types = new CheckPokemonTypeEffect(effect.attacker);
      store.reduceEffect(state, types);
      if (types.cardTypes.includes(CardType.COLORLESS)) effect.sources.set(this.name, this);
    }
    return state;
  }
}

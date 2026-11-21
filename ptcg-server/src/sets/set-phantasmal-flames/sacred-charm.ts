import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PowerType, StateUtils } from '../../game';

export class SacredCharm extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public regulationMark = 'I';
  public set: string = 'PFL';
  public name: string = 'Sacred Charm';
  public fullName: string = 'Sacred Charm M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public text: string = 'The Pokémon this card is attached to takes 30 less damage from attacks from your opponent\'s Pokémon that have any Abilities.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.tools.includes(this)) {
      const attacker = effect.source.getPokemonCard();
      const owner = StateUtils.findOwner(state, effect.target);
      if (attacker && owner !== effect.player && !IS_TOOL_BLOCKED(store, state, owner, this)) {
        const powers = new CheckPokemonPowersEffect(effect.player, attacker);
        state = store.reduceEffect(state, powers);
        if (powers.powers.some(power => power.powerType === PowerType.ABILITY)) {
          effect.reduceDamageAfterWeakness(30, this.fullName + ':' + this.id);
        }
      }
    }

    return state;
  }
}

import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { ToolEffect } from '../../game/store/effects/play-card-effects';


export class PunkHelmet extends TrainerCard {

  public regulationMark = 'I';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'PFL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '92';

  public name = 'Punk Helmet';

  public fullName = 'Punk Helmet PFL';

  public text: string =
    'If the {D} Pokemon this card is attached to is in the Active Spot and is ' +
    'damaged by an attack from your opponent\'s Pokemon (even if this Pokemon is ' +
    'Knocked Out), place 4 damage counters on the Attacking Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.tools.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      // Check if the attached Pokemon is a Dark-type
      const pokemonCard = effect.target.getPokemonCard();
      if (!pokemonCard || pokemonCard.cardType !== CardType.DARK) {
        return state;
      }

      // Try to reduce ToolEffect, to check if something is blocking the tool from working
      try {
        const stub = new ToolEffect(effect.player, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        effect.source.damage += 40;
      }
    }

    return state;
  }

}

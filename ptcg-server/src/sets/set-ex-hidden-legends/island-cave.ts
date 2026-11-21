import { State, StateUtils, StoreLike } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';

export class IslandCave extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public trainerType = TrainerType.STADIUM;
  public set = 'HL';
  public name = 'Island Cave';
  public fullName = 'Island Cave HL';

  public text = 'Whenever any player attaches an Energy card from his or hand to [W] Pokémon, [F] Pokémon, or [M] Pokémon, remove any Special Conditions from that Pokémon.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterAttachEnergyFromHandEffect && StateUtils.getStadiumCard(state) === this) {
      const { player, target } = effect;
      const canResolve = () => {
        if (StateUtils.getStadiumCard(state) !== this || !player.getPokemonInPlay().includes(target)
          || IS_STADIUM_EFFECT_BLOCKED(store, state, player, target, this)) return false;
        const type = new CheckPokemonTypeEffect(target);
        store.reduceEffect(state, type);
        return [CardType.WATER, CardType.FIGHTING, CardType.METAL].some(eligible => type.cardTypes.includes(eligible));
      };
      if (canResolve()) effect.reactions.set(this.name, {
        label: this.name,
        canResolve,
        resolve: () => {
          target.clearAllSpecialConditions();
        },
      });
    }

    return state;
  }

}

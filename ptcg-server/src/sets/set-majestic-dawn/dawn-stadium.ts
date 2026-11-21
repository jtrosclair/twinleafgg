import { TrainerCard } from '../../game';
import { TrainerType } from '../../game';
import { State } from '../../game';
import { StateUtils } from '../../game';
import { StoreLike } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';

export class DawnStadium extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Dawn Stadium';
  public fullName: string = 'Dawn Stadium MD';
  public text: string = 'This card stays in play when you play it. Discard this card if another Stadium card comes into play. If another card with the same name is in play, you can\'t play this card. Whenever any player attaches an Energy card from his or her hand to Grass Pokémon or Water Pokémon, remove 1 damage counter and all Special Conditions from that Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterAttachEnergyFromHandEffect && StateUtils.getStadiumCard(state) === this) {
      const { player, target } = effect;
      const canResolve = () => {
        if (StateUtils.getStadiumCard(state) !== this || !player.getPokemonInPlay().includes(target)
          || IS_STADIUM_EFFECT_BLOCKED(store, state, player, target, this)) return false;
        const type = new CheckPokemonTypeEffect(target);
        store.reduceEffect(state, type);
        return [G, W].some(eligible => type.cardTypes.includes(eligible));
      };
      if (canResolve()) effect.reactions.set(this.name, {
        label: this.name,
        canResolve,
        resolve: () => {
          store.reduceEffect(state, new HealEffect(player, target, 10));
          target.clearAllSpecialConditions();
        },
      });
    }

    return state;
  }
}

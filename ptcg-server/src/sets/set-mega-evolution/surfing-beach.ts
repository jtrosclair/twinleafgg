import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';
import { GameMessage } from '../../game/game-message';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CardTarget, ChoosePokemonPrompt, GameError, PlayerType, SlotType } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class SurfingBeach extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public trainerType = TrainerType.STADIUM;
  public set = 'MEG';
  public name = 'Surfing Beach';
  public fullName = 'Surfing Beach M1S';
  public regulationMark = 'I';

  public text = 'Once during each player\'s turn, that player may switch their Active [W] Pokémon with 1 of their Benched [W] Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      const isEligible = (slot: typeof player.active) => {
        const type = new CheckPokemonTypeEffect(slot);
        store.reduceEffect(state, type);
        return type.cardTypes.includes(CardType.WATER)
          && !IS_STADIUM_EFFECT_BLOCKED(store, state, player, slot, this);
      };
      const blocked: CardTarget[] = [];
      let hasEligibleBench = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, _card, target) => {
        if (slot !== player.active && isEligible(slot)) hasEligibleBench = true;
        else blocked.push(target);
      });
      if (!hasEligibleBench || !isEligible(player.active)) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false, blocked },
      ), selected => {
        if (!selected || selected.length === 0)
          return state;
        const target = selected[0];
        player.switchPokemon(target, store, state);
      });
    }
    return state;
  }
}

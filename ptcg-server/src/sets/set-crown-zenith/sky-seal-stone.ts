import { GameError, GameMessage, PowerType, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { APPLY_ONCE_PER_CARD, IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class SkySealStone extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'CRZ';
  public setNumber: string = '143';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sky Seal Stone';
  public fullName: string = 'Sky Seal Stone CRZ';

  public text: string = 'The Pokémon V this card is attached to can use the VSTAR Power on this card.';

  public extraPrizes = false;

  public powers = [
    {
      name: 'Star Order',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      exemptFromAbilityLock: true,
      text: 'During your turn, you may use this Ability. During this turn, if your opponent\'s Active Pokémon VSTAR or Active Pokémon VMAX is Knocked Out by damage from an attack from your Basic Pokémon V, take 1 more Prize card. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckPokemonPowersEffect) {
      const slot = StateUtils.findPokemonSlot(state, effect.target);
      if (slot?.tools.includes(this) && slot.vPokemon()
        && !IS_TOOL_BLOCKED(store, state, effect.player, this)
        && !effect.powers.some(power => power.name === this.powers[0].name)) {
        effect.powers = [...effect.powers, this.powers[0]];
      }
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]
      && APPLY_ONCE_PER_CARD(effect, this)) {
      const player = effect.player;
      const slot = StateUtils.findPokemonSlot(state, effect.card);
      if (!slot?.tools.includes(this) || !slot.vPokemon()
        || StateUtils.findOwner(state, slot) !== player || IS_TOOL_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.usedVSTAR) throw new GameError(GameMessage.LABEL_VSTAR_USED);
      player.usedVSTAR = true;
      player.starOrderTurn = state.turn;
    }
    return state;
  }
}

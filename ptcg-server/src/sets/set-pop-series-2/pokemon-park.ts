import { TrainerCard, TrainerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';

export class PokemonPark extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'P2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Pokémon Park';
  public fullName: string = 'Pokémon Park P2';
  public text: string = 'Once during each player\'s turn, when that player attaches an Energy card from his or her hand to 1 of his or her Benched Pokémon, he or she removes 1 damage counter from that Pokémon.';

  private readonly PARK_USED_MARKER = 'POKEMON_PARK_USED';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PARK_USED_MARKER, this);
    }
    if (effect instanceof AfterAttachEnergyFromHandEffect && StateUtils.getStadiumCard(state) === this
      && effect.activePokemonAtAttachment !== effect.target.getPokemonCard()) {
      const { player, target } = effect;
      const canResolve = () => state.players[state.activePlayer] === player
        && StateUtils.getStadiumCard(state) === this && player.getPokemonInPlay().includes(target)
        && !player.marker.hasMarker(this.PARK_USED_MARKER, this)
        && !IS_STADIUM_EFFECT_BLOCKED(store, state, player, target, this);
      if (canResolve()) effect.reactions.set(this.name, {
        label: this.name,
        canResolve,
        resolve: () => {
          player.marker.addMarker(this.PARK_USED_MARKER, this);
          store.reduceEffect(state, new HealEffect(player, target, 10));
        },
      });
    }
    return state;
  }
}

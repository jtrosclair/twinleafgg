import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { PlayerType, StateUtils } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';
import type { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class REnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name = 'R Energy';
  public fullName = 'R Energy TRR';

  public text =
    'R Energy can be attached only to a Pokémon that has Dark or Rocket\'s in its name. While in play, R Energy provides 2 [D] Energy. (Doesn\'t count as a basic Energy card.) If the Pokémon R Energy is attached to attacks, the attack does 10 more damage to the Active Pokémon (before applying Weakness and Resistance). When your turn ends, discard R Energy.';

  public R_MARKER = 'R_MARKER';

  private canStayAttached(target: PokemonCardList): boolean {
    const name = target.getPokemonCard()?.name ?? '';
    return name.startsWith('Dark ') || name.includes("Rocket's ");
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this,
      target => this.canStayAttached(target));

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const attachedTo = effect.source.getPokemonCard();
      if (attachedTo instanceof PokemonCard && this.canStayAttached(effect.source)) {
        effect.energyMap.push({ card: this, provides: [CardType.DARK, CardType.DARK] });
      }

      return state;
    }

    if (effect instanceof BetweenTurnsEffect && effect.player === state.players[state.activePlayer]) {
      const player = effect.player;
      player.marker.removeMarker(this.R_MARKER, this);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.cards.includes(this) && !IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
          cardList.moveCardTo(this, player.discard);
        }
      });
    }


    if (effect instanceof DealDamageEffect) {
      if (effect.source.cards.includes(this) && this.canStayAttached(effect.source)
        && !IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.source)) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        if (effect.target !== opponent.active) {
          return state;
        }

        effect.damage += 10;
      }
    }

    return state;
  }
}

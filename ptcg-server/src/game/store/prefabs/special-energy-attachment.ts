import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { PlayerType } from '../actions/play-card-action';
import { CardType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { CheckPokemonTypeEffect, CheckTableStateEffect } from '../effects/check-effects';
import { Effect } from '../effects/effect';
import { MoveCardsEffect } from '../effects/game-effects';
import { AfterAttachEnergyEffect, AttachEnergyEffect } from '../effects/play-card-effects';
import { StateUtils } from '../state-utils';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { IS_SPECIAL_ENERGY_BLOCKED } from './prefabs';

/** An effect can put the Energy on an incompatible Pokémon. Its own discard rule still applies. */
export function RESTRICT_SPECIAL_ENERGY_ATTACHMENT(
  store: StoreLike, state: State, effect: Effect, energy: EnergyCard,
  restriction: CardType | ((target: PokemonCardList) => boolean),
  invalidTarget = GameMessage.CANNOT_PLAY_THIS_CARD,
): void {
  if (!(effect instanceof CheckTableStateEffect)
    && (!(effect instanceof AttachEnergyEffect || effect instanceof AfterAttachEnergyEffect) || effect.energyCard !== energy)) return;

  const canStayAttached = (target: PokemonCardList): boolean => {
    if (typeof restriction === 'function') return restriction(target);
    const type = new CheckPokemonTypeEffect(target);
    store.reduceEffect(state, type);
    return type.cardTypes.includes(restriction);
  };

  if (effect instanceof AttachEnergyEffect && effect.isManual) {
    if (!canStayAttached(effect.target)) throw new GameError(invalidTarget);
  }
  if (effect instanceof AfterAttachEnergyEffect && effect.target.cards.includes(energy)) {
    const owner = StateUtils.findOwner(state, effect.target);
    if (!canStayAttached(effect.target) && !IS_SPECIAL_ENERGY_BLOCKED(store, state, owner, energy, effect.target)) {
      // Leave the Energy in place until continuous effects have observed the attachment.
      effect.discardEnergy = true;
    }
  }
  if (effect instanceof CheckTableStateEffect) {
    const checkSlot = (owner: Player, slot: PokemonCardList) => {
      const source = slot.cards.includes(energy) ? slot : slot.energies.cards.includes(energy) ? slot.energies : undefined;
      if (source && !canStayAttached(slot) && !IS_SPECIAL_ENERGY_BLOCKED(store, state, owner, energy, slot)) {
        store.reduceEffect(state, new MoveCardsEffect(source, owner.discard, { cards: [energy], sourceCard: energy }));
      }
    };
    for (const player of state.players) player.forEachPokemon(PlayerType.BOTTOM_PLAYER, slot => checkSlot(player, slot));
  }
}

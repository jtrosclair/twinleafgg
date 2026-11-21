import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { CardType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { PokemonCard } from '../card/pokemon-card';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { CheckPokemonTypeEffect } from '../effects/check-effects';
import { SelfKnockOutEffect } from '../effects/game-effects';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';

export function knockOutAndAttachAsEnergy(
  store: StoreLike, state: State, player: Player, card: PokemonCard & EnergyCard,
  provides: CardType[], recipientType?: CardType,
): State {
  const candidates: PokemonCardList[] = [];
  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, pokemon, target) => {
    if (pokemon === card) {
      blocked.push(target);
      return;
    }
    if (recipientType !== undefined) {
      const type = new CheckPokemonTypeEffect(slot);
      store.reduceEffect(state, type);
      if (!type.cardTypes.includes(recipientType)) {
        blocked.push(target);
        return;
      }
    }
    candidates.push(slot);
  });
  if (candidates.length === 0) throw new GameError(GameMessage.CANNOT_USE_POWER);

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id, GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH], { allowCancel: false, blocked },
  ), (targets: PokemonCardList[] | null) => {
    const target = targets?.[0];
    if (targets?.length !== 1 || !target || !candidates.includes(target)) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    store.reduceEffect(state, new SelfKnockOutEffect(player, card, {
      energyAttachment: { card, target, provides },
    }));
  });
}

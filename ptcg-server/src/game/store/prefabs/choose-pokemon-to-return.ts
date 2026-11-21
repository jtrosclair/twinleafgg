import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { CardTarget, PlayerType, SlotType } from '../actions/play-card-action';
import { PokemonCard } from '../card/pokemon-card';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { Player } from '../state/player';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { canReturnPokemonToHand, returnPokemonToHand } from './pokemon-replacement';

export function choosePokemonToReturn(store: StoreLike, state: State, player: Player,
  returnAttachments: boolean, eligible: (card: PokemonCard) => boolean = () => true): State {
  const blocked: CardTarget[] = [];
  let hasTarget = false;
  let hasReturnableTarget = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card, target) => {
    if (eligible(card)) {
      hasTarget = true;
      if (canReturnPokemonToHand(store, state, player, slot)) {
        hasReturnableTarget = true;
        return;
      }
    }
    blocked.push(target);
  });
  if (!hasTarget) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  if (!hasReturnableTarget) return state;

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id, GameMessage.CHOOSE_POKEMON_TO_PICK_UP, PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH], { allowCancel: false, blocked }
  ), ([target]) => {
    const card = target?.getPokemonCard();
    if (card && eligible(card)) {
      returnPokemonToHand(store, state, player, target, returnAttachments);
    }
  });
}

import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

function playCard(store: StoreLike, state: State, effect: TrainerEffect): State {
  const player = effect.player;

  // Create list of non - Pokemon SP slots
  const blocked: CardTarget[] = [];
  let hasPokemonSp = false;

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    const isPokemonSp = card.tags.includes(CardTag.POKEMON_SP);
    hasPokemonSp = hasPokemonSp || isPokemonSp;
    if (!isPokemonSp) {
      blocked.push(target);
    }
  });

  if (!hasPokemonSp) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { allowCancel: true, blocked }
  ), targets => {
    const target = targets?.[0];
    if (!target) return;
    const cards = [...new Set([...target.cards, ...target.energies.cards, ...target.tools])];
    MOVE_CARDS(store, state, target, player.hand, { cards, sourceCard: effect.trainerCard });
    // Older slots can store the same Tool in both cards and tools.
    target.tools = target.tools.filter(tool => !player.hand.cards.includes(tool));
    target.damage = 0;
    target.clearEffects();
  });
}

export class PokeTurn extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'PL';

  public name: string = 'Team Galactic\'s Invention G-105 Poke Turn';

  public fullName: string = 'Poke Turn PL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '118';

  public text: string =
    'Return 1 of your Pokemon SP and all cards attached to it to your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return playCard(store, state, effect);
    }

    return state;
  }

}

import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { DrawPrizesEffect } from '../../game/store/effects/game-effects';
import { StoreLike, State, PokemonCard, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, GET_PLAYER_BENCH_SLOTS } from '../../game/store/prefabs/prefabs';
import { takePrizeTo } from '../../game/store/prefabs/prize-reactions';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class DreamBall extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'E';

  public set: string = 'EVS';

  public setNumber: string = '146';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Dream Ball';

  public fullName: string = 'Dream Ball EVS';

  public text: string =
    'You can play this card only if you took it as a face-down Prize card, before you put it into your hand. ' +
    `
    ` +
    'Search your deck for a Pokémon and put it onto your Bench. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    // Ref: set-steam-siege/greedy-dice.ts (use the selected Prize before it enters the hand).
    if (effect instanceof DrawPrizesEffect) {
      const { player } = effect;
      effect.offer(this, GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES,
        () => GET_PLAYER_BENCH_SLOTS(player).length > 0 && player.deck.cards.length > 0,
        prize => {
          takePrizeTo(player, prize, player.discard);
          const blocked = player.deck.cards.flatMap((card, index) => card instanceof PokemonCard
            && [CardTag.POKEMON_LV_X, CardTag.LEGEND, CardTag.BREAK, CardTag.POKEMON_VUNION].some(tag => card.tags.includes(tag))
            ? [index] : []);
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, {},
            { min: 0, max: 1, allowCancel: false, blocked });
        });
    }
    return state;
  }
}

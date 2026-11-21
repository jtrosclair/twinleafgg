import { CardTag, GameError, GameMessage, PokemonCard, Stage, State, StoreLike, SuperType, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';

export class TeamRocketsGreatBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '175';

  public regulationMark = 'I';

  public name: string = 'Team Rocket\'s Great Ball';

  public fullName: string = 'Team Rocket\'s Great Ball DRI';

  public text: string = 'Flip a coin. If heads, search your deck for an Evolution Team Rocket Pokémon, reveal it, and put it into your hand. If tails, search your deck for a Basic Team Rocket Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const player = effect.player;
    if (player.deck.cards.length === 0) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    // Ref: set-scarlet-and-violet/pokeball.ts (optional private search after the flip).
    return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), heads => {
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard)) return;
        const stageMatches = heads ? card.stage === Stage.STAGE_1 || card.stage === Stage.STAGE_2
          : card.stage === Stage.BASIC;
        if (!stageMatches || !card.tags.includes(CardTag.TEAM_ROCKET)) blocked.push(index);
      });
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: false, blocked }, effect);
    });
  }
}

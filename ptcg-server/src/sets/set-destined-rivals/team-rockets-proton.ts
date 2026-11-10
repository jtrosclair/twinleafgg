import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, PokemonCard, StateUtils } from '../../game';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class TeamRocketsProton extends TrainerCard {
  public regulationMark = 'I';
  public tags = [CardTag.TEAM_ROCKET];
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '177';
  public name: string = 'Team Rocket\'s Proton';
  public fullName: string = 'Team Rocket\'s Proton DRI';
  public firstTurn = true;

  public text: string =
    `If you go first, you may use this card during your first turn.

Search your deck for up to 3 Basic Team Rocket's Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.rocketSupporter = true;
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      const blocked = player.deck.cards
        .filter(c => !c.tags.includes(CardTag.TEAM_ROCKET))
        .map(c => player.deck.cards.indexOf(c));

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max: 3, allowCancel: false, blocked: blocked }
      ), selectedCards => {
        if (!Array.isArray(selectedCards) || selectedCards.length > 3 ||
          new Set(selectedCards).size !== selectedCards.length || selectedCards.some((card: Card) =>
            !(card instanceof PokemonCard) || card.stage !== Stage.BASIC ||
            !card.tags.includes(CardTag.TEAM_ROCKET) || !player.deck.cards.includes(card))) {
          throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        if (selectedCards.length === 0) {
          SHUFFLE_DECK(store, state, player);
          return;
        }
        // Preserve the printed reveal → move → shuffle order across prompts.
        store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selectedCards), () => {
          MOVE_CARDS(store, state, player.deck, player.hand, { cards: selectedCards, sourceCard: this, sourceEffect: effect });
          SHUFFLE_DECK(store, state, player);
        });
      });
    }

    if (effect instanceof EndTurnEffect && effect.player.rocketSupporter) {
      effect.player.rocketSupporter = false;
    }

    return state;
  }

}

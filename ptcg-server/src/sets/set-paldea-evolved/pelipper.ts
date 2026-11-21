import { ChooseCardsPrompt, GameMessage, PokemonCard, PowerType, SelectOptionPrompt, Stage, CardType, State, StoreLike, SuperType, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardToHandEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, JUST_EVOLVED_FROM_HAND, MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class Pelipper extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wingull';
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 120;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Hearsay',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may choose 1: put a Supporter card from your discard pile into your hand; or search your deck for a Supporter card, reveal it, put it into your hand, and then shuffle your deck. '
  }];

  public attacks = [{
    name: 'Wing Attack',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: ''
  }];

  public set: string = 'PAL';
  public setNumber: string = '159';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pelipper';
  public fullName: string = 'Pelipper PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-destined-rivals/team-rockets-golbat.ts (trigger after the hand evolution completes).
    if (!JUST_EVOLVED_FROM_HAND(effect, state, this)) return state;
    const player = effect.player;
    if (IS_ABILITY_BLOCKED(store, state, player, this)) return state;

    const filter = { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER };
    const recover = new DiscardToHandEffect(player, this);
    state = store.reduceEffect(state, recover);
    const canRecover = !recover.preventDefault
      && player.discard.cards.some(card => card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER);
    const canSearch = player.deck.cards.length > 0;
    if (!canRecover && !canSearch) return state;

    return store.prompt(state, new SelectOptionPrompt(player.id, GameMessage.CHOOSE_OPTION,
      [GameMessage.CHOOSE_SUPPORTER_FROM_DISCARD, GameMessage.CHOOSE_SUPPORTER_FROM_DECK],
      { allowCancel: true, disabled: [!canRecover, !canSearch] },
    ), choice => {
      if (choice === 0 && canRecover) {
        store.prompt(state, new ChooseCardsPrompt(
          player, GameMessage.CHOOSE_CARD_TO_HAND, player.discard, filter,
          { min: 1, max: 1, allowCancel: false },
        ), selected => {
          MOVE_CARDS(store, state, player.discard, player.hand, {
            cards: selected ?? [], sourceCard: this, sourceEffect: effect,
          });
        });
      } else if (choice === 1 && canSearch) {
        SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, filter, { min: 0, max: 1, allowCancel: false }, effect);
      }
    });
  }
}

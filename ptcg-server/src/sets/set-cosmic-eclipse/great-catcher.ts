import { CardList, CardTag, CardTarget, ChooseCardsPrompt, GameError, GameMessage, PlayerType, PokemonCardList, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

function isGreatCatcherTarget(slot: PokemonCardList): boolean {
  const pokemon = slot.getPokemonCard();
  return !!pokemon && (pokemon.tags.includes(CardTag.POKEMON_GX) || pokemon.tags.includes(CardTag.POKEMON_EX));
}

export class GreatCatcher extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'CEC';

  public setNumber = '192';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Great Catcher';

  public fullName: string = 'Great Catcher CEC';

  public text: string =
    'You can play this card only if you discard two other cards. Switch 1 of your opponent\'s Benched Pokemon-GX or Pokemon-EX ' +
    'with their Active Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;

    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    const cards = player.hand.cards.filter(card => card !== this);
    if (!opponent.bench.some(isGreatCatcherTarget) || cards.length < 2) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    const hand = new CardList();
    hand.cards = cards;
    effect.preventDefault = true;
    return store.prompt(state, new ChooseCardsPrompt(
      player, GameMessage.CHOOSE_CARD_TO_DISCARD, hand, {}, { min: 2, max: 2, allowCancel: true }
    ), selected => {
      if (selected?.length !== 2 || !selected.every(card => player.hand.cards.includes(card))) {
        player.supporter.moveCardTo(this, player.hand);
        return;
      }
      const discard = new MoveCardsEffect(player.hand, player.discard, { cards: selected, sourceCard: this });
      store.reduceEffect(state, discard);
      if (!selected.every(card => player.discard.cards.includes(card) || player.lostzone.cards.includes(card))) {
        player.supporter.moveCardTo(this, player.hand);
        return;
      }

      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (slot, _card, target) => {
        if (!isGreatCatcherTarget(slot)) blocked.push(target);
      });
      SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { blocked, sourceEffect: effect });
    });
  }
}

import { CardType, StoreLike, State, EnergyCard, EnergyType, TrainerCard, TrainerType, GameError, GameMessage, StateUtils, ChooseCardsPrompt, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect, MoveCardsEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';

export class MoonlightHill extends TrainerCard {

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '81';

  public trainerType = TrainerType.STADIUM;

  public set = 'PAF';

  public name = 'Moonlit Hill';

  public fullName = 'Moonlit Hill PAF';

  public text = 'Once during each player\'s turn, that player may discard a Basic [P] Energy from their hand. If they do, they may heal 30 damage from each of their Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof UseStadiumEffect) || StateUtils.getStadiumCard(state) !== this) return state;

    const { player } = effect;
    const eligible = player.getPokemonInPlay().filter(slot => slot.damage > 0
      && !IS_STADIUM_EFFECT_BLOCKED(store, state, player, slot, this));
    const hasPayment = player.hand.cards.some(card => card instanceof EnergyCard
      && card.energyType === EnergyType.BASIC && card.name === 'Psychic Energy');
    if (!hasPayment || eligible.length === 0) throw new GameError(GameMessage.CANNOT_USE_STADIUM);

    const previousUse = player.stadiumUsedTurn;
    return store.prompt(state, new ChooseCardsPrompt(
      player, GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
      { allowCancel: true, min: 1, max: 1 },
    ), cards => {
      if (!cards?.length) {
        player.stadiumUsedTurn = previousUse;
        return;
      }
      const move = new MoveCardsEffect(player.hand, player.discard, { cards, sourceCard: this });
      state = store.reduceEffect(state, move);
      if (move.preventDefault || !player.discard.cards.includes(cards[0])) return;
      for (const slot of eligible) {
        state = store.reduceEffect(state, new HealEffect(player, slot, 30));
      }
    });
  }
}

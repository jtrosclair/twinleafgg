import { AttachEnergyPrompt, CardTarget, EnergyCard, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BeastRing extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [];
  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Beast Ring';
  public fullName: string = 'Beast Ring FLI';

  public text: string =
    `You can play this card only if your opponent has exactly 3 or 4 Prize cards remaining.

Search your deck for up to 2 basic Energy cards and attach them to 1 of your Ultra Beasts. Then, shuffle your deck.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;

    const { player } = effect;
    const opponentPrizes = StateUtils.getOpponent(state, player).getPrizeLeft();
    if ((opponentPrizes !== 3 && opponentPrizes !== 4) || player.deck.cards.length === 0) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    let hasUltraBeast = false;
    const blockedTo: CardTarget[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_slot, card, target) => {
      if (card.tags.includes(CardTag.ULTRA_BEAST)) hasUltraBeast = true;
      else blockedTo.push(target);
    });
    if (!hasUltraBeast) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    return store.prompt(state, new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_CARDS,
      player.deck,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { allowCancel: false, min: 0, max: 2, blockedTo, sameTarget: true }
    ), transfers => {
      for (const { card, to } of transfers ?? []) {
        const target = StateUtils.getTarget(state, player, to);
        store.reduceEffect(state, new AttachEnergyEffect(player, card as EnergyCard, target, 'deck'));
      }
      SHUFFLE_DECK(store, state, player);
    });
  }
}

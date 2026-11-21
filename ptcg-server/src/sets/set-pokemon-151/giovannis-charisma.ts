import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyPrompt, GameError, Player, PlayerType, SlotType, StateUtils } from '../../game';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { CardList } from '../../game/store/state/card-list';
import { State } from '../../game/store/state/state';
import { AttachEnergyEffect, CheckEnergyAttachmentEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { getPhysicalAttachedEnergy } from '../../game/store/prefabs/attack-effects';
import { canReturnPokemonToHand } from '../../game/store/prefabs/pokemon-replacement';
import { MOVE_CARDS, TRAINER_TARGET_BLOCKED } from '../../game/store/prefabs/prefabs';

function attachEnergy(store: StoreLike, state: State, player: Player): void {
  const blocked: number[] = [];
  const target = player.active;
  player.hand.cards.forEach((card, index) => {
    if (card instanceof EnergyCard && (card.discardCostToAttachFromHand ?? 0) < player.hand.cards.length) {
      try {
        store.reduceEffect(state, new CheckEnergyAttachmentEffect(new AttachEnergyEffect(player, card, target)));
        return;
      } catch (error) {
        if (!(error instanceof GameError)) throw error;
      }
    }
    blocked.push(index);
  });
  if (blocked.length === player.hand.cards.length) return;

  store.prompt(state, new AttachEnergyPrompt(
    player.id, GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE], { superType: SuperType.ENERGY },
    { allowCancel: false, min: 1, max: 1, blocked }
  ), ([choice]) => {
    if (choice?.card instanceof EnergyCard && player.active === target && player.hand.cards.includes(choice.card)) {
      store.reduceEffect(state, new AttachEnergyEffect(player, choice.card, target));
    }
  });
}

export class GiovannisCharisma extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '161';

  public name: string = 'Giovanni\'s Charisma';

  public fullName: string = 'Giovanni\'s Charisma MEW';

  public text: string =
    'Put an Energy attached to your opponent\'s Active Pokémon into their hand. If you do, attach an Energy card from your hand to your Active Pokémon.';

  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    return getPhysicalAttachedEnergy(StateUtils.getOpponent(state, player).active).length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);
    const target = opponent.active;
    const attached = getPhysicalAttachedEnergy(target);
    if (attached.length === 0) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    // Ref: set-paradox-rift/professor-turos-scenario.ts (check return prevention before moving).
    if (TRAINER_TARGET_BLOCKED(store, state, effect, target)
      || !canReturnPokemonToHand(store, state, opponent, target)) return state;

    const choices = new CardList();
    choices.cards = attached;
    return store.prompt(state, new ChooseCardsPrompt(
      player, GameMessage.CHOOSE_CARD_TO_HAND, choices, {}, { min: 1, max: 1, allowCancel: false }
    ), ([selected]) => {
      if (!selected || target !== opponent.active || !getPhysicalAttachedEnergy(target).includes(selected)) return;
      MOVE_CARDS(store, state, target, opponent.hand, { cards: [selected], sourceCard: this, sourceEffect: effect });
      if (opponent.hand.cards.includes(selected)) attachEnergy(store, state, player);
    });
  }
}

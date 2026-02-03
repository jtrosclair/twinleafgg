import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, EnergyType, SpecialCondition, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt, EnergyCard, GameError, StateUtils, ChooseCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class JaninesSecretArt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'H';

  public set: string = 'PRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '112';

  public name: string = 'Janine\'s Secret Art';

  public fullName: string = 'Janine\'s Secret Art PRE';

  public text: string =
    'Choose up to 2 of your [D] Pokémon. For each of those Pokémon, search your deck for a Basic [D] Energy card and attach it to that Pokémon. Then, shuffle your deck. If you attached Energy to your Active Pokémon in this way, it is now Poisoned.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // Count Dark Pokemon and ensure we have energy in deck
      const hasDarkEnergy = player.deck.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.cardType === CardType.DARK;
      });

      if (!hasDarkEnergy) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      }

      // Only allow selecting Dark Pokemon
      const blockedTargets: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.cardType !== CardType.DARK) {
          blockedTargets.push(target);
        }
      });

      let attachedToActive = false;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, cardType: CardType.DARK },
        { allowCancel: false, min: 0, max: 2, blockedTo: blockedTargets, differentTargets: true }
      ), transfers => {
        transfers = transfers || [];

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);

          // Check if we attached to active
          if (target === player.active) {
            attachedToActive = true;
          }
        }

        // Shuffle deck
        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          return state;
        });

        // Apply poison if we attached to active
        if (attachedToActive) {
          const addSpecialConditionsEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          addSpecialConditionsEffect.target = player.active;
          store.reduceEffect(state, addSpecialConditionsEffect);
        }

        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      });
    }
    return state;
  }
}

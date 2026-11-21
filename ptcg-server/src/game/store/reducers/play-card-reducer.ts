import { Action } from '../actions/action';
import {
  AttachEnergyEffect, CheckManualEnergyAttachmentCountEffect, PlayPokemonEffect, PlayStadiumEffect,
  PlaySupporterEffect, AttachPokemonToolEffect, PlayItemEffect
} from '../effects/play-card-effects';
import { CardList } from '../state/card-list';
import { EnergyCard } from '../card/energy-card';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { PlayCardAction, PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { hasAlphaGrowth, PokemonCard } from '../card/pokemon-card';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State, GamePhase } from '../state/state';
import { StoreLike } from '../store-like';
import { TrainerCard } from '../card/trainer-card';
import { CardTag, Stage, TrainerType } from '../card/card-types';
import { Effect } from '../effects/effect';
import { StateUtils } from '../state-utils';
import { UsePowerEffect } from '../effects/game-effects';
import { HAS_SUPPORTER_PLAY_AVAILABLE } from '../prefabs/prefabs';
import { recordActiveAbilityLockOrder } from '../state/active-ability-lock-order';
import { resolveBasicBenchPlay } from '../prefabs/active-ability-lock';
import { attachWithOptionalSecondEnergy } from '../prefabs/hand-energy-attachment';

function findCardList(state: State, target: CardTarget): CardList | undefined {
  const player = target.player === PlayerType.BOTTOM_PLAYER
    ? state.players[state.activePlayer]
    : state.players[state.activePlayer ? 0 : 1];

  switch (target.slot) {
    case SlotType.ACTIVE:
      return player.active;
    case SlotType.BENCH:
      return player.bench[target.index];
  }
}

export function playCardReducer(store: StoreLike, state: State, action: Action): State {
  const player = state.players[state.activePlayer];

  if (state.phase === GamePhase.PLAYER_TURN) {
    recordActiveAbilityLockOrder(state);

    if (action instanceof PlayCardAction) {
      if (player === undefined || player.id !== action.id) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      const handCard = player.hand.cards[action.handIndex];

      if (handCard === undefined) {
        throw new GameError(GameMessage.UNKNOWN_CARD);
      }

      if (handCard instanceof EnergyCard) {
        const target = findCardList(state, action.target);
        if (action.target.player !== PlayerType.BOTTOM_PLAYER || !(target instanceof PokemonCardList) || !target.getPokemonCard()) {
          throw new GameError(GameMessage.INVALID_TARGET);
        }
        if (!player.usedDragonsWish && !state.rules.unlimitedEnergyAttachments && player.energyPlayedTurn === state.turn) {
          throw new GameError(GameMessage.ENERGY_ALREADY_ATTACHED);
        }
        const extras = player.hand.cards.filter((card): card is EnergyCard => card instanceof EnergyCard && card !== handCard);
        const allowance = new CheckManualEnergyAttachmentCountEffect(player, target);
        if (extras.length > 0) {
          allowance.allowSecond = hasAlphaGrowth(target.getPokemonCard());
          state = store.reduceEffect(state, allowance);
        }
        return attachWithOptionalSecondEnergy(store, state, new AttachEnergyEffect(player, handCard, target),
          allowance.allowSecond ? extras : [], true);
      }

      if (handCard instanceof PokemonCard) {
        const target = findCardList(state, action.target);
        if (action.target.player !== PlayerType.BOTTOM_PLAYER || !(target instanceof PokemonCardList)) {
          throw new GameError(GameMessage.INVALID_TARGET);
        }

        // Some hand Abilities place an Evolution Pokémon directly on the Bench.
        // An occupied target still follows the normal evolution path.
        if (action.target.slot === SlotType.BENCH && target.cards.length === 0) {
          const power = handCard.powers.find(item => item.useFromHand && item.useFromHandToBench);
          if (power) {
            const handTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: action.handIndex };
            return store.reduceEffect(state, new UsePowerEffect(player, power, handCard, handTarget, target));
          }
        }
        const effect = new PlayPokemonEffect(player, handCard, target, action.target.slot, action.target.index);
        if (handCard.stage === Stage.BASIC && player.bench.includes(target) && target.cards.length === 0) {
          return resolveBasicBenchPlay(store, state, effect);
        }
        return store.reduceEffect(state, effect);
      }

      if (handCard instanceof TrainerCard) {
        const target = findCardList(state, action.target);
        let effect: Effect;
        switch (handCard.trainerType) {
          case TrainerType.SUPPORTER:
            if (state.turn === 1 && handCard.firstTurn !== true) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (!HAS_SUPPORTER_PLAY_AVAILABLE(store, state, player)) {
              throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (handCard.paySupporterCost && handCard.canPlay?.(store, state, player) === false) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect = new PlaySupporterEffect(player, handCard, target);
            break;
          case TrainerType.STADIUM: {
            // A dual Stadium is played as one card. Validate before other Stadium
            // effects (such as Chaotic Swell) can consume either half.
            if (handCard.tags.includes(CardTag.DUAL_STADIUM) && !player.hand.cards.some(card =>
              card !== handCard && card.name === handCard.name && card.set === handCard.set
              && card.tags.includes(CardTag.DUAL_STADIUM) && card.setNumber !== handCard.setNumber)) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const stadium = StateUtils.getStadiumCard(state);
            const isHyperrogueOverPrismTower = handCard.name === 'Hyperrogue Ange Floette' && stadium?.name === 'Prism Tower';
            if (state.rules.oneStadiumPerTurn !== false && player.stadiumPlayedTurn === state.turn && !isHyperrogueOverPrismTower) {
              throw new GameError(GameMessage.STADIUM_ALREADY_PLAYED);
            }
            if (state.rules.allowSameNameStadium !== true && stadium && stadium.name === handCard.name) {
              throw new GameError(GameMessage.SAME_STADIUM_ALREADY_IN_PLAY);
            }
            // Commit the allowance only after Trainer cancellation has allowed the play.
            effect = new PlayStadiumEffect(player, handCard);
            break;
          }
          case TrainerType.TOOL:
            if (!(target instanceof PokemonCardList)) {
              throw new GameError(GameMessage.INVALID_TARGET);
            }
            effect = new AttachPokemonToolEffect(player, handCard, target);
            break;
          default:
            effect = new PlayItemEffect(player, handCard, target);
            break;
        }
        return store.reduceEffect(state, effect);
      }
      player.hand.moveCardTo(handCard, player.supporter);
    }

  }

  return state;
}

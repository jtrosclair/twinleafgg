import { ChooseEnergyPrompt } from '../prompts/choose-energy-prompt';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { RetreatEffect, RetreatStartEffect } from '../effects/game-effects';
import { StateUtils } from '../state-utils';
import { CheckRetreatCostEffect, CheckProvidedEnergyEffect, CheckRetreatPaymentEffect } from '../effects/check-effects';
import { SpecialCondition } from '../card/card-types';
import { PokemonCard } from '../..';
import { Player } from '../state/player';
import { PlayerType, SlotType } from '../actions/play-card-action';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Card } from '../card/card';
import { CardList } from '../state/card-list';
import { COIN_FLIP_PROMPT } from '../prefabs/prefabs';


function retreatPokemon(store: StoreLike, state: State, effect: RetreatEffect) {
  const player = effect.player;
  const activePokemon = player.active.getPokemonCard();
  const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
  if (activePokemon === undefined || benchedPokemon === undefined) {
    return;
  }

  store.log(state, GameLog.LOG_PLAYER_RETREATS, {
    name: player.name,
    active: activePokemon.name,
    benched: benchedPokemon.name
  });

  player.retreatedTurn = state.turn;
  player.switchPokemon(player.bench[effect.benchIndex], store, state);
}

function flatMap<T, U>(array: T[], fn: (item: T) => U[]): U[] {
  return array.reduce((acc, item) => acc.concat(fn(item)), [] as U[]);
}

function promptBenchAndRetreat(store: StoreLike, state: State, player: Player): State {
  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH],
    { min: 1, max: 1, allowCancel: false, blocked: [] }
  ), (benchResult: PokemonCardList[] | null) => {
    if (benchResult === null) {
      return;
    }
    const benchIndex = player.bench.indexOf(benchResult[0]);
    if (benchIndex < 0) {
      return;
    }
    const effect = new RetreatEffect(player, benchIndex);
    retreatPokemon(store, state, effect);
    const activePokemonCard = player.active.getPokemonCard() as PokemonCard;
    if (activePokemonCard && !player.movedToActiveThisTurn.includes(activePokemonCard.id)) {
      player.movedToActiveThisTurn.push(activePokemonCard.id);
    }
    if (activePokemonCard) {
      activePokemonCard.movedToActiveThisTurn = true;
    }
  });
}

export function retreatReducer(store: StoreLike, state: State, effect: Effect): State {
  if (!(effect instanceof RetreatStartEffect) && !(effect instanceof RetreatEffect)) return state;

  const player = effect.player;
  const direct = effect instanceof RetreatEffect ? effect : undefined;
  if (player.active.cannotRetreatNextTurn) {
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  }

  const hasReplacement = direct
    ? !!player.bench[direct.benchIndex]?.getPokemonCard()
    : player.bench.some(slot => slot.getPokemonCard());
  if (!hasReplacement) {
    throw new GameError(GameMessage.INVALID_TARGET);
  }

  const { specialConditions } = player.active;
  if (!effect.ignoreStatusConditions
    && (specialConditions.includes(SpecialCondition.PARALYZED) || specialConditions.includes(SpecialCondition.ASLEEP))) {
    throw new GameError(GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
  }
  if (state.rules.oneRetreatPerTurn !== false && player.retreatedTurn === state.turn) {
    throw new GameError(GameMessage.RETREAT_ALREADY_USED);
  }

  const retreatCost = new CheckRetreatCostEffect(player);
  state = store.reduceEffect(state, retreatCost);
  const destination: CardList = direct?.moveRetreatCostTo ?? player.discard;
  const finishPayment = (cards: Card[]) => {
    if (!player.active.getPokemonCard() || (direct && !player.bench[direct.benchIndex]?.getPokemonCard())) {
      return state;
    }
    const payAndRetreat = () => {
      player.active.clearEffects();
      player.active.moveCardsTo(cards, destination);
      if (!direct) return promptBenchAndRetreat(store, state, player);

      retreatPokemon(store, state, direct);
      player.active.clearEffects();
      if (cards.length > 0) {
        const active = player.active.getPokemonCard()!;
        if (!player.movedToActiveThisTurn.includes(active.id)) player.movedToActiveThisTurn.push(active.id);
        active.movedToActiveThisTurn = true;
      }
      return state;
    };

    const check = new CheckRetreatPaymentEffect(player);
    store.reduceEffect(state, check);
    if (check.requiresCoinFlip) {
      return COIN_FLIP_PROMPT(store, state, player, heads => {
        if (heads) payAndRetreat();
        else player.retreatedTurn = state.turn;
      });
    }
    return payAndRetreat();
  };

  const { cost } = retreatCost;
  if (cost.length === 0) return finishPayment([]);

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);
  const { energyMap } = checkProvidedEnergy;

  if (!StateUtils.checkEnoughEnergy(energyMap, cost)) {
    throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
  }
  if (StateUtils.checkExactEnergy(energyMap, cost)) {
    return finishPayment(flatMap(energyMap, entry => Array.from({ length: entry.provides.length }, () => entry.card)));
  }
  if (StateUtils.allEnergyProvidesIdentical(energyMap)) {
    const selection = StateUtils.selectMinimalEnergyForCost(energyMap, cost);
    if (selection?.length) return finishPayment(selection.map(entry => entry.card));
  }

  return store.prompt(state, new ChooseEnergyPrompt(
    player.id, GameMessage.CHOOSE_ENERGY_TO_PAY_RETREAT_COST, energyMap, cost
  ), energy => {
    if (energy) return finishPayment(energy.map(entry => entry.card));
  });
}

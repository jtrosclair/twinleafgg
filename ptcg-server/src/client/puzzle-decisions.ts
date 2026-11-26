import { Action } from '../game/store/actions/action';
import { CardTarget, PlayerType, PlayCardAction, SlotType } from '../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../game/store/actions/resolve-prompt-action';
import { AttackAction, RetreatAction, UseAbilityAction, UseEnergyAbilityAction, UseTrainerAbilityAction } from '../game/store/actions/game-actions';
import { Card } from '../game/store/card/card';
import { EnergyCard } from '../game/store/card/energy-card';
import { PokemonCard } from '../game/store/card/pokemon-card';
import { TrainerCard } from '../game/store/card/trainer-card';
import { PokemonCardList } from '../game/store/state/pokemon-card-list';
import { State } from '../game/store/state/state';

type DecisionValue = string | number | boolean | null | DecisionValue[] | { [key: string]: DecisionValue };

export interface PuzzleDecision {
  type: string;
  details: { [key: string]: DecisionValue };
}

export function describePuzzleDecision(state: State, action: Action): PuzzleDecision | undefined {
  const player = state.players[0];
  const target = (value: CardTarget): DecisionValue => {
    const side = value.player === PlayerType.TOP_PLAYER ? 'opponent' : 'player';
    const slot = SlotType[value.slot] || 'unknown';
    const owner = side === 'opponent' ? state.players[1] : player;
    const pokemon = value.slot === SlotType.ACTIVE ? owner?.active
      : value.slot === SlotType.BENCH ? owner?.bench[value.index] : undefined;
    const card = pokemon?.getPokemonCard()?.fullName;
    return { side, slot, index: value.index, ...(card ? { card } : {}) };
  };
  const describe = (value: unknown, depth = 0): DecisionValue => {
    if (value == null || depth >= 5) return null;
    if (value instanceof Card) return value.fullName;
    if (value instanceof PokemonCardList) return value.getPokemonCard()?.fullName || null;
    if (Array.isArray(value)) return value.slice(0, 32).map(item => describe(item, depth + 1));
    if (typeof value !== 'object') {
      return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' ? value : null;
    }
    if ('player' in value && 'slot' in value && 'index' in value) return target(value as CardTarget);
    return Object.fromEntries(Object.entries(value).slice(0, 12).map(([key, item]) => [key, describe(item, depth + 1)]));
  };

  let details: PuzzleDecision['details'] = {};
  if (action instanceof ResolvePromptAction) {
    const prompt = state.prompts.find(item => item.id === action.id);
    details = { prompt: prompt?.type || '', choice: describe(action.result) };
    if (prompt && 'message' in prompt) details.message = describe(prompt.message);
  } else if (action instanceof PlayCardAction) {
    details = { card: player.hand.cards[action.handIndex]?.fullName || '', target: target(action.target) };
  } else if (action instanceof AttackAction) {
    details = { attack: action.name, card: player.active.getPokemonCard()?.fullName || '' };
  } else if (action instanceof UseAbilityAction || action instanceof UseTrainerAbilityAction || action instanceof UseEnergyAbilityAction) {
    details = { ability: action.name, source: target(action.target) };
  } else if (action instanceof RetreatAction) {
    details = { to: player.bench[action.benchIndex]?.getPokemonCard()?.fullName || '', benchIndex: action.benchIndex };
  } else if (action.type !== 'PASS_TURN' && action.type !== 'USE_STADIUM_ACTION' && action.type !== 'RETREAT_START_ACTION') {
    return undefined;
  }
  return { type: action.type, details };
}

export function describePuzzleCardRules(state: State) {
  const [player, opponent] = state.players;
  const cards = [
    ...player.hand.cards,
    ...state.players.flatMap(owner => [owner.active, ...owner.bench].flatMap(slot => [...slot.cards, ...slot.tools])),
    ...player.stadium.cards, ...opponent.stadium.cards,
  ];
  const byName = new Map(cards.map(card => [card.fullName, card]));
  return [...byName.values()].slice(0, 30).map(card => ({
    name: card.fullName,
    ...(card instanceof TrainerCard || card instanceof EnergyCard ? { text: card.text } : {}),
    ...(card instanceof PokemonCard ? {
      hp: card.hp, evolvesFrom: card.evolvesFrom,
      type: card.cardType, weakness: card.weakness, resistance: card.resistance, retreat: card.retreat,
      powers: card.powers.map(({ name, text }) => ({ name, text })),
      attacks: card.attacks.map(({ name, damage, cost, text }) => ({ name, damage, cost, text })),
    } : {}),
  }));
}

import { Serialized, SerializedState } from './serializer.interface';

type WireDefault = string | number | boolean | null | readonly [];
const EMPTY: readonly [] = Object.freeze([]) as readonly [];

const CARD_LIST_DEFAULTS = Object.freeze({
  isPublic: false, isSecret: false, faceUpPrize: false,
  stadiumDirection: 'up', markedAsNotSecret: false
});

/**
 * Optional fields in the existing JSON snapshot schema, pinned to these wire
 * values. Never derive this table from constructors at runtime: deserialization
 * restores the same values even if a future constructor changes its defaults.
 *
 * Keep structural fields, State headers/logs/prompts, player names, rules,
 * settings, and unknown fields. In particular, PokemonCardList.tools stays
 * explicit: injecting [] would overwrite the legacy `tool` alias during load.
 */
export const COMPACT_STATE_DEFAULTS: Readonly<Record<string, Readonly<Record<string, WireDefault>>>> = Object.freeze({
  State: Object.freeze({ skipOpponentTurn: false, lastAttack: null, benchSizeChangeHandled: false }),
  Player: Object.freeze({
    coinFlipCancelTrainerPlayTurnsRemaining: 0,
    pokemonKnockedOutDuringOpponentsLastTurn: false,
    pokemonKnockedOutByAttackDuringOpponentsLastTurn: false,
    supporterTurn: 0, ancientSupporter: false, rocketSupporter: false,
    retreatedTurn: 0, energyPlayedTurn: 0, stadiumPlayedTurn: 0, stadiumUsedTurn: 0,
    avatarName: '', usedVSTAR: false, usedGX: false, assembledVUNIONs: EMPTY,
    showAllStageAbilities: false, legacyEnergyUsed: false,
    DAMAGE_DEALT_MARKER: 'DAMAGE_DEALT_MARKER',
    ATTACK_USED_MARKER: 'ATTACK_USED_MARKER',
    ATTACK_USED_2_MARKER: 'ATTACK_USED_2_MARKER',
    CLEAR_KNOCKOUT_MARKER: 'CLEAR_KNOCKOUT_MARKER',
    KNOCKOUT_MARKER: 'KNOCKOUT_MARKER',
    OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER: 'OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER',
    DEFENDING_POKEMON_CANNOT_RETREAT_MARKER: 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER',
    PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER: 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER',
    DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER: 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER',
    CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER: 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER',
    DEFENDING_POKEMON_CANNOT_ATTACK_MARKER: 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER',
    DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER: 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER',
    CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER: 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER',
    DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER: 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER',
    CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER: 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER',
    PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER',
    CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER',
    PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES: 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES',
    PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER: 'PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER',
    CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER: 'CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER',
    ATTACK_EFFECT_SUPPORTER_LOCK: 'ATTACK_EFFECT_SUPPORTER_LOCK',
    ATTACK_EFFECT_ITEM_LOCK: 'ATTACK_EFFECT_ITEM_LOCK',
    ATTACK_EFFECT_TOOL_LOCK: 'ATTACK_EFFECT_TOOL_LOCK',
    ATTACK_EFFECT_STADIUM_LOCK: 'ATTACK_EFFECT_STADIUM_LOCK',
    ATTACK_EFFECT_SPECIAL_ENERGY_LOCK: 'ATTACK_EFFECT_SPECIAL_ENERGY_LOCK',
    UNRELENTING_ONSLAUGHT_MARKER: 'UNRELENTING_ONSLAUGHT_MARKER',
    UNRELENTING_ONSLAUGHT_2_MARKER: 'UNRELENTING_ONSLAUGHT_2_MARKER',
    movedToActiveThisTurn: EMPTY, usedDragonsWish: false, pecharuntexIsInPlay: false,
    usedFanCall: false, canEvolve: false,
    usedAlteredCreation: false, alteredCreationDamage: false, usedFullMetalWall: false,
    prizesTaken: 0, prizesTakenThisTurn: 0, prizesTakenLastTurn: 0, playableCardIds: EMPTY
  }),
  CardList: CARD_LIST_DEFAULTS,
  PokemonCardList: Object.freeze({
    ...CARD_LIST_DEFAULTS,
    damage: 0, hp: 0, specialConditions: EMPTY,
    poisonDamage: 10, burnDamage: 20, confusionDamage: 30,
    pokemonPlayedTurn: 0, sleepFlips: 1, boardEffect: EMPTY, hpBonus: 0,
    isActivatingCard: false, showAllStageAbilities: false,
    triggerEvolutionAnimation: false, showBasicAnimation: false, triggerAttackAnimation: false,
    damageReductionNextTurn: 0, preventDamageUpToNextTurn: 0, coinFlipCancelAttackNextTurn: 0,
    surviveOnTenHpNextTurn: null, surviveOnTenHpNextTurnPending: null, attackDamageReductionNextTurn: 0,
    preventDamageNextTurnPending: false, preventDamageNextTurn: false,
    preventEffectsOfAttacksNextTurnPending: false, preventEffectsOfAttacksNextTurn: false,
    weaknessOverrideClearArmed: false, defendingPokemonExtraDamageNextTurn: 0,
    defendingPokemonExtraDamagePending: false, defendingPokemonExtraDamageRearmAfterAttack: false,
    cannotAttackNextTurn: false, cannotAttackNextTurnPending: false,
    cannotUseAttacksNextTurn: EMPTY, cannotUseAttacksNextTurnPending: EMPTY
  }),
  Marker: Object.freeze({ markers: EMPTY })
});

/** Fill only omitted optional wire fields; every array belongs to its own node. */
export function restoreCompactDefaults(data: Serialized, type: string): void {
  const defaults = Object.prototype.hasOwnProperty.call(COMPACT_STATE_DEFAULTS, type)
    ? COMPACT_STATE_DEFAULTS[type] : undefined;
  if (!defaults) { return; }
  for (const key of Object.keys(defaults)) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      const value = defaults[key];
      data[key] = Array.isArray(value) ? [] : value;
    }
  }
}

/**
 * Omit reviewed default properties without changing the JSON envelope or any
 * array position. Ref targets and all ancestors remain explicitly addressable.
 * Full StateSerializer.serialize remains the canonical, untrimmed oracle.
 */
export function compactSerializedState(serializedState: SerializedState): SerializedState {
  const parsed = JSON.parse(serializedState);
  if (!Array.isArray(parsed) || !Array.isArray(parsed[0]) || !parsed[1]
    || typeof parsed[1] !== 'object' || Array.isArray(parsed[1])) {
    throw new Error('Expected a serialized [players, state] snapshot.');
  }
  const protectedPaths = new Set<string>();
  const nodes: { value: any, path: string }[] = [];
  const collect = (value: any, path: string): void => {
    if (!value || typeof value !== 'object') { return; }
    nodes.push({ value, path });
    if (value._type === 'Ref' && typeof value.path === 'string') {
      const parts = value.path.split('.');
      while (parts.length > 0) {
        protectedPaths.add(parts.join('.'));
        parts.pop();
      }
    }
    for (const key of Object.keys(value)) {
      collect(value[key], path ? path + '.' + key : key);
    }
  };
  collect(parsed, '');
  for (const { value, path } of nodes) {
    if (Array.isArray(value) || !Object.prototype.hasOwnProperty.call(COMPACT_STATE_DEFAULTS, value._type)) { continue; }
    const defaults = COMPACT_STATE_DEFAULTS[value._type];
    for (const key of Object.keys(defaults)) {
      const current = value[key], expected = defaults[key];
      if (Object.prototype.hasOwnProperty.call(value, key)
        && !protectedPaths.has(path + '.' + key)
        && (Array.isArray(expected) ? Array.isArray(current) && current.length === 0 : current === expected)) {
        delete value[key];
      }
    }
  }
  return JSON.stringify(parsed);
}

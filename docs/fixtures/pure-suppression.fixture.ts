import { CardTag } from './card/card-types';
import { PowerType } from './card/pokemon-types';

/**
 * Experimental, non-integrated suppression evaluator.
 *
 * This accepts data only. It never dispatches an Effect or receives a Store,
 * card instance, callback, or mutable State. A caller may set `coverage` to
 * complete only after every relevant in-play, zone and marker participant and
 * every applicable protection effect is covered by audited rules. There is no
 * production adapter or fallback yet: incomplete input is always unsupported.
 */
export type SuppressionDecision = 'blocked' | 'allowed' | 'unsupported';
export type SuppressionRuleKind = 'weezing' | 'empoleon' | 'iron-thorns' | 'victreebel' | 'arbok';
export interface SuppressionMarker { readonly name: string; readonly source: string; }
export interface SuppressionSlot {
  readonly cards: readonly string[];
  readonly topPokemon?: string;
  readonly hasRuleBox: boolean;
  readonly markers: readonly SuppressionMarker[];
}
export interface SuppressionPlayer {
  readonly active: SuppressionSlot;
  readonly bench: readonly SuppressionSlot[];
}
export interface SuppressionCard { readonly id: string; readonly tags: readonly string[]; }
export interface SuppressionRule {
  readonly kind: SuppressionRuleKind;
  readonly source: string;
  readonly owner: 0 | 1;
  /** The current source power, including any runtime modifications. */
  readonly sourcePower?: SuppressionPower;
}
export interface SuppressionPower {
  readonly name: string;
  readonly powerType: PowerType;
  readonly useFromHand?: boolean;
  readonly useFromDiscard?: boolean;
  readonly exemptFromAbilityLock?: boolean;
}
export interface SuppressionProtection {
  readonly source: string;
  readonly target: string;
  readonly result: 'clear' | 'target-removed' | 'unknown';
}
export interface SuppressionView {
  readonly coverage: 'complete' | 'partial';
  readonly players: readonly [SuppressionPlayer, SuppressionPlayer];
  readonly cards: readonly SuppressionCard[];
  readonly rules: readonly SuppressionRule[];
  readonly protections: readonly SuppressionProtection[];
}
export interface SuppressionRequest {
  readonly player: 0 | 1;
  readonly card: string;
  readonly power: SuppressionPower;
}

const OWN_POWER: Readonly<Partial<Record<SuppressionRuleKind, string>>> = Object.freeze({
  weezing: 'Neutralizing Gas', empoleon: "Emperor's Eyes", 'iron-thorns': 'Initialization'
});
const RULE_BOX_TAGS: readonly string[] = [CardTag.POKEMON_ex, CardTag.POKEMON_V, CardTag.POKEMON_VSTAR, CardTag.POKEMON_VMAX, CardTag.RADIANT];
const VICTREEBEL_MARKER = 'VICTREEBEL_UNB_GASTRO_ACID';
const ARBOK_MARKER = 'GASTRO_ACID_MARKER';

function findSlot(view: SuppressionView, card: string): SuppressionSlot | undefined {
  for (const player of view.players) {
    for (const slot of [player.active, ...player.bench]) if (slot.cards.includes(card)) return slot;
  }
  return undefined;
}
function hasMarker(slot: SuppressionSlot | undefined, name: string, source: string): boolean {
  return !!slot && slot.markers.some(marker => marker.name === name && marker.source === source);
}

export function evaluatePureSuppression(view: SuppressionView, request: SuppressionRequest): SuppressionDecision {
  // Unknown participants may themselves suppress a known suppressor. Do not
  // return either blocked or allowed until the caller can prove full coverage.
  if (view.coverage !== 'complete') return 'unsupported';
  const target = view.cards.find(card => card.id === request.card);
  if (!target || !view.players[request.player]) return 'unsupported';
  const visiting = new Set<string>();
  const evaluate = (query: SuppressionRequest): SuppressionDecision => {
    const key = `${query.player}:${query.card}:${query.power.powerType}:${query.power.name}`;
    if (visiting.has(key)) return 'unsupported';
    visiting.add(key);
    try {
      const player = view.players[query.player];
      const opponent = view.players[query.player === 0 ? 1 : 0];
      const targetCard = view.cards.find(card => card.id === query.card);
      if (!targetCard) return 'unsupported';
      for (const rule of view.rules) {
        if (!view.cards.some(card => card.id === rule.source)) return 'unsupported';
        const ownName = OWN_POWER[rule.kind];
        const isAbility = query.power.powerType === PowerType.ABILITY;
        let candidate = false;
        if (rule.kind === 'weezing') {
          candidate = isAbility && query.power.name !== ownName &&
            (player.active.cards.includes(rule.source) || opponent.active.cards.includes(rule.source)) &&
            rule.owner !== query.player && !query.power.useFromDiscard && !query.power.useFromHand &&
            !query.power.exemptFromAbilityLock;
        } else if (rule.kind === 'empoleon') {
          candidate = isAbility && query.power.name !== ownName &&
            view.players[rule.owner].active.topPokemon === rule.source && rule.owner !== query.player &&
            player.active.topPokemon === query.card && !player.active.hasRuleBox && !opponent.active.hasRuleBox &&
            !query.power.useFromDiscard && !query.power.useFromHand && !query.power.exemptFromAbilityLock;
        } else if (rule.kind === 'iron-thorns') {
          candidate = isAbility && query.power.name !== ownName &&
            (player.active.topPokemon === rule.source || opponent.active.topPokemon === rule.source) &&
            targetCard.tags.some(tag => RULE_BOX_TAGS.includes(tag)) &&
            !query.power.useFromDiscard && !query.power.useFromHand && !query.power.exemptFromAbilityLock;
        } else if (rule.kind === 'victreebel') {
          if (isAbility && !query.power.exemptFromAbilityLock && hasMarker(findSlot(view, query.card), VICTREEBEL_MARKER, rule.source)) return 'blocked';
        } else if (rule.kind === 'arbok') {
          if (isAbility && hasMarker(player.active, ARBOK_MARKER, rule.source)) return 'blocked';
        } else {
          return 'unsupported';
        }
        if (!candidate || !ownName) continue;
        // The legacy reducers probe their own Ability with the original
        // PowerEffect player, even when that player is not the source owner.
        if (!rule.sourcePower) return 'unsupported';
        const sourceDecision = evaluate({player: query.player, card: rule.source, power: rule.sourcePower});
        if (sourceDecision === 'unsupported') return sourceDecision;
        if (sourceDecision === 'blocked') continue;
        if (rule.kind === 'iron-thorns' && findSlot(view, query.card)) {
          const protection = view.protections.find(entry => entry.source === rule.source && entry.target === query.card);
          if (!protection || protection.result === 'unknown') return 'unsupported';
          if (protection.result === 'target-removed') continue;
        }
        return 'blocked';
      }
      return 'allowed';
    } finally {
      visiting.delete(key);
    }
  };
  return evaluate(request);
}

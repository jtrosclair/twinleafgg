import { Card } from '../store/card/card';

/** Explicit additions whose aliases must not change legacy fallback resolution. */
export interface PrintContract { fullName: string; name: string; set: string; number: string; setAliases?: string[]; }
export const printContracts: PrintContract[] = [
  { fullName: "Iono's Kilowattrel182 SVP", name: "Iono's Kilowattrel", set: 'SVP', number: '182', setAliases: ['PR-SV'] },
  { fullName: "Lillie's Ribombee183 SVP", name: "Lillie's Ribombee", set: 'SVP', number: '183', setAliases: ['PR-SV'] },
  { fullName: "Professor's Research221 SVP", name: "Professor's Research", set: 'SVP', number: '221', setAliases: ['PR-SV'] },
  { fullName: "Professor's Research222 SVP", name: "Professor's Research", set: 'SVP', number: '222', setAliases: ['PR-SV'] },
  { fullName: "Professor's Research223 SVP", name: "Professor's Research", set: 'SVP', number: '223', setAliases: ['PR-SV'] }
];
const fold = (s: string) => s.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035`]/g, "'").replace(/-/g, ' ').toLowerCase().trim().replace(/\s+/g, ' ');
const num = (s: string) => /^\d+$/.test(s) ? s.replace(/^0+(?=\d)/, '') : s.toLowerCase();

const internalToken = Symbol('validated print catalogue');
type InternalIndex = { token: typeof internalToken; index: ReadonlyMap<string, Card> };

function buildPrintCatalogueIndex(cards: readonly Card[], contracts: readonly PrintContract[]): Map<string, Card> {
  const canonical = new Set(contracts.map(c => c.fullName));
  const index = new Map<string, Card>();
  for (const card of cards) {
    const identity = (card as any).printCompatibilityIdentity;
    if (identity !== undefined && canonical.has(identity) && identity !== card.fullName) throw new Error(`Mismatched print compatibility identity: ${identity}`);
    if (canonical.has(card.fullName) && index.has(card.fullName)) throw new Error(`Ambiguous canonical card identity: ${card.fullName}`);
    index.set(card.fullName, card);
  }
  return index;
}

/** Build the serializer index and resolver atomically from one catalogue snapshot. */
export function buildPrintCatalogue(cards: readonly Card[], contracts: readonly PrintContract[] = printContracts): {
  index: ReadonlyMap<string, Card>; compatibility: PrintCompatibility;
} {
  const snapshot = contracts.length ? cards.slice() : cards;
  const index = buildPrintCatalogueIndex(snapshot, contracts);
  const compatibility = new PrintCompatibility(snapshot, contracts, { token: internalToken, index });
  return { index, compatibility };
}

/** No singleton mutation: a resolver is scoped to an explicit ordered catalogue. */
export class PrintCompatibility {
  private legacyCache?: Card[];
  private readonly sourceCards: readonly Card[];
  private readonly excludedCards = new Set<Card>();
  get legacyCards(): Card[] {
    if (!this.legacyCache) this.legacyCache = this.sourceCards.filter(card => !this.excludedCards.has(card));
    return this.legacyCache;
  }
  private readonly exact = new Map<string, Card | undefined>();
  private readonly canonical = new Set<string>();
  private readonly legacyCanonical = new Set<string>();
  private readonly canonicalAliases = new Map<string, PrintContract>();
  private readonly numberedAliases = new Map<string, PrintContract>();
  private readonly identifierPattern: RegExp;
  constructor(cards: readonly Card[], private readonly contracts: readonly PrintContract[] = printContracts,
    internal?: InternalIndex) {
    if (internal && internal.token !== internalToken) throw new Error('Untrusted print catalogue index');
    // Both the fullName index and lazy view refer to this same snapshot.
    this.sourceCards = internal || !contracts.length ? cards : cards.slice();
    if (contracts.length === 0) {
      this.legacyCache = cards as Card[];
      this.identifierPattern = /$a/;
      return;
    }
    const sets = [...new Set(contracts.flatMap(c => [c.set, ...(c.setAliases || [])]))]
      .sort((a, b) => b.length - a.length).map(set => set.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    this.identifierPattern = new RegExp(`^(.*?)\\s+(${sets})(?:\\s+(\\w+))?$`, 'i');
    for (const c of contracts) {
      if (this.canonical.has(c.fullName)) throw new Error(`Duplicate print contract: ${c.fullName}`);
      this.canonical.add(c.fullName);
      const internal = c.fullName.slice(0, -(c.set.length + 1));
      for (const set of [c.set, ...(c.setAliases || [])]) {
        const prefix = (name: string) => `${fold(name)}\0${fold(set)}`;
        const canonKey = prefix(internal), canonPrior = this.canonicalAliases.get(canonKey);
        if (canonPrior && canonPrior !== c) throw new Error(`Ambiguous canonical alias: ${c.fullName}`);
        this.canonicalAliases.set(canonKey, c);
        for (const name of [internal, c.name]) {
          const key = `${prefix(name)}\0${num(c.number)}`, prior = this.numberedAliases.get(key);
          if (prior && prior !== c) throw new Error(`Ambiguous printed identity: ${c.fullName}`);
          this.numberedAliases.set(key, c);
        }
      }
    }
    // StateSerializer's factory supplies the index built from this snapshot.
    const candidates = internal?.index || buildPrintCatalogueIndex(this.sourceCards, contracts);
    for (const c of contracts) {
      const match = candidates.get(c.fullName);
      if (match && (match as any).printCompatibilityIdentity === c.fullName) this.excludedCards.add(match);
      if (match && (match as any).printCompatibilityIdentity === undefined) this.legacyCanonical.add(c.fullName);
      this.exact.set(c.fullName, match && (match as any).printCompatibilityIdentity === c.fullName
        && typeof match.name === 'string' && typeof match.set === 'string' && typeof match.setNumber === 'string'
        && fold(match.name) === fold(c.name) && match.set.toUpperCase() === c.set.toUpperCase()
        && num(match.setNumber) === num(c.number) ? match : undefined);
    }
  }
  isCanonical(input: string): boolean { return this.canonical.has(input); }
  hasLegacyCanonical(input: string): boolean { return this.legacyCanonical.has(input); }
  resolveIdentifier(input: string): { recognized: boolean; card?: Card } {
    const match = input.trim().match(this.identifierPattern);
    return match ? this.resolve(match[1], match[2], match[3]) : { recognized: false };
  }
  /** Recognized missing prints never fall through to a different card. */
  resolve(name: string, set: string, number?: string): { recognized: boolean; card?: Card } {
    const prefix = `${fold(name)}\0${fold(set)}`;
    const contract = number === undefined ? this.canonicalAliases.get(prefix)
      : this.numberedAliases.get(`${prefix}\0${num(number)}`);
    if (!contract) return { recognized: false };
    const card = this.exact.get(contract.fullName);
    if (number === undefined && !card && this.legacyCanonical.has(contract.fullName)) return { recognized: false };
    return { recognized: true, card };
  }
}

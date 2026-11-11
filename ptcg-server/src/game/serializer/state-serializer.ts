import { buildPrintCatalogue, PrintCompatibility } from '../cards/print-compatibility';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { Serializer, SerializerContext, SerializedState, Serialized } from './serializer.interface';
import { State } from '../store/state/state';
import { Card } from '../store/card/card';
import { GenericSerializer } from './generic.serializer';
import { Rules } from '../store/state/rules';
import { Player } from '../store/state/player';
import { CardSerializer } from './card.serializer';
import { CardListSerializer } from './card-list.serializer';
import { Marker } from '../store/state/card-marker';
import { StateLogSerializer } from './state-log.serializer';
import { PromptSerializer } from './prompt.serializer';
import { PathBuilder } from './path-builder';
import { deepClone } from '../../utils/utils';
import { JsonPatch } from './json-patch';
import { JsonDiff } from './json-patch.interface';
import { GameSettings } from '../core/game-settings';
import { cardReplacementMap, stripNumericSuffix } from './card-replacements';
import { restoreCompactDefaults } from './compact-state';
import { restorePokemonEnergyRoles } from '../store/card/pokemon-energy-role';

export class StateSerializer {

  public serializers: Serializer<any>[];
  public static knownCards: Card[] = [];
  private static knownCardsByFullName: ReadonlyMap<string, Card> = new Map();
  private static printCompatibility = new PrintCompatibility([]);

  constructor() {
    this.serializers = [
      new GenericSerializer(State, 'State'),
      new GenericSerializer(Rules, 'Rules'),
      new GenericSerializer(Player, 'Player'),
      new GenericSerializer(Marker, 'Marker'),
      new GenericSerializer(GameSettings, 'GameSettings'),
      new CardSerializer(),
      new CardListSerializer(),
      new StateLogSerializer(),
      new PromptSerializer()
    ];
  }

  public static normalizeCardName(name: string): string {
    const index = StateSerializer.printCompatibility;
    const exact = index.resolveIdentifier(name);
    if (exact.recognized) return exact.card?.fullName || '';
    return StateSerializer.normalizeCardNameLegacy(name, index.legacyCards);
  }

  private static normalizeCardNameLegacy(name: string, cards: Card[]): string {
    // PBL full-art Trainers have upstream internal FA aliases. Resolve only
    // the exact printed collector numbers before generic number stripping.
    const pblPlain = name.match(/^(Crushing Hammer|Energy Switch)\s+PBL$/i);
    if (pblPlain) return cards.find(candidate => candidate.name === pblPlain[1]
      && candidate.set !== 'PBL')?.fullName || '';
    const pblItem = name.match(/^(Crushing Hammer|Energy Switch)( FA)?\s+PBL\s+(\d+)$/i);
    if (pblItem) {
      const printed = pblItem[1].toLowerCase(), number = String(Number(pblItem[3]));
      if ((printed === 'crushing hammer' && number === '105') || (printed === 'energy switch' && number === '107')) {
        const card = cards.find(candidate => candidate.name.toLowerCase() === printed
          && candidate.set === 'PBL' && candidate.setNumber === number);
        return card?.fullName || '';
      } else {
        // Preserve the pre-existing generic fallback rather than resolving a
        // wrong collector number to one of these new full-art printings.
        if (pblItem[2]) return '';
        return cards.find(candidate => candidate.name === pblItem[1]
          && candidate.set !== 'PBL')?.fullName || '';
      }
    }
    // New DPP promo identities use the fork's existing numeric collector IDs,
    // while external exports may spell them DP01, DP04, and so on.
    const dppPromo = name.match(/^(Turtwig|Pachirisu|Buneary|Buizel|Chatot|Shinx)\s+DPP\s+(?:DP)?0*(\d+)$/i);
    if (dppPromo) {
      const numbers: { [key: string]: string } = { turtwig: '1', pachirisu: '4', buneary: '6', buizel: '13', chatot: '14', shinx: '15' };
      const cardName = dppPromo[1].toLowerCase(), number = String(Number(dppPromo[2]));
      if (numbers[cardName] !== number) return '';
      const card = cards.find(candidate => candidate.name.toLowerCase() === cardName
        && candidate.set === 'DPP' && candidate.setNumber === number);
      return card?.fullName || '';
    }
    // New Arceus printings share names with already registered printings.
    // Preserve legacy unnumbered resolution while resolving these numbers
    // exactly, even if card registration order changes.
    const round27 = name.match(/^(Electrike|Tangela|Treecko|Manectric|Ponyta)\s+AR\s+0*(\d+)$/i);
    if (round27) {
      const expected: { [key: string]: string[] } = {
        electrike: ['62', '63'], tangela: ['76', '77'], treecko: ['78', '79'],
        manectric: ['44'], ponyta: ['72']
      };
      const cardName = round27[1].toLowerCase();
      const number = String(Number(round27[2]));
      if (expected[cardName]?.includes(number)) {
        const card = cards.find(candidate => candidate.name.toLowerCase() === cardName
          && candidate.set === 'AR' && candidate.setNumber === number);
        return card?.fullName || '';
      }
    }
    // These two Unleashed cards share a printed name but have different attacks.
    // Never resolve an unavailable print to its same-named counterpart.
    const unleashedLarvitar = name.match(/^Larvitar\s+UL\s+0*(50|51)$/i);
    if (unleashedLarvitar) {
      const card = cards.find(candidate => candidate.set === 'UL'
        && candidate.name === 'Larvitar' && candidate.setNumber === unleashedLarvitar[1]);
      return card?.fullName || '';
    }
    // Majestic Dawn has two Aipom prints with distinct attacks. Resolve the
    // numbered print before generic set suffix stripping, independent of
    // catalogue registration order.
    const aipomMd = name.match(/^Aipom\s+MD\s+0*(50|51)$/i);
    if (aipomMd) {
      const card = cards.find(candidate => candidate.set === 'MD'
        && candidate.name === 'Aipom' && candidate.setNumber === aipomMd[1]);
      return card?.fullName || '';
    }
    // Unleashed also has two similarly named Fighting-type prints with
    // different attacks. Resolve the numbered records before generic suffix stripping.
    const unleashedNumbered = name.match(/^(Pupitar\s+UL\s+0*39|Onix\s+UL\s+0*57)$/i);
    if (unleashedNumbered) {
      const [, printed] = unleashedNumbered;
      const match = printed.match(/^(Pupitar|Onix)\s+UL\s+0*(39|57)$/i)!;
      const expectedNumber = match[1].toLowerCase() === 'pupitar' ? '39' : '57';
      const card = cards.find(candidate => candidate.set === 'UL'
        && candidate.name.toLowerCase() === match[1].toLowerCase()
        && candidate.setNumber === expectedNumber);
      return card?.fullName || '';
    }
    // Preserve existing canonical identities while resolving these distinct new prints.
    const reviewedPrint = name.match(/^(Inkay)\s+(LOR)\s+0*(77)$|^(Duskull)\s+(SF)\s+0*(60)$|^(Crobat)\s+(UL)\s+0*(14)$/i);
    if (reviewedPrint) {
      const cardName = (reviewedPrint[1] || reviewedPrint[4] || reviewedPrint[7]).toLowerCase();
      const set = (reviewedPrint[2] || reviewedPrint[5] || reviewedPrint[8]).toUpperCase();
      const number = reviewedPrint[3] || reviewedPrint[6] || reviewedPrint[9];
      const card = cards.find(candidate => candidate.name.toLowerCase() === cardName
        && candidate.set === set && candidate.setNumber === number);
      return card?.fullName || '';
    }
    // Delta Reign contains pairs of distinct Stadium cards with the same name.
    // Resolve numbered prints before generic normalization discards the number.
    const deltaReign = name.match(/^(.*?)\s+DLR\s+(\d+)$/i);
    if (deltaReign) {
      const fold = (value: string) => value.replace(/♀/g, 'f').replace(/♂/g, 'm').normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const expectedName = fold(deltaReign[1]);
      const number = String(Number(deltaReign[2]));
      const printedEnergyAliases: { [number: string]: string[] } = {
        '132': ['Bubbly Water Energy', 'Bubble Water Energy'],
        '133': ['Growing Grass Energy', 'Growing G Energy', 'Grow Grass Energy', 'Grow G Energy'],
      };
      const card = cards.find(candidate => candidate.set === 'DLR'
        && String(Number(candidate.setNumber)) === number
        && (fold(candidate.name) === expectedName || (printedEnergyAliases[number] || []).some(alias => fold(alias) === expectedName)));
      if (card) {
        return card.fullName;
      }
    }
    // Preserve the upstream Japanese identifier for the same Rayquaza rules.
    // The Japanese full-art print has no corresponding DLR print; the base
    // implementation is a safe rules fallback for an unnumbered M6 name.
    const rayquazaM6 = name.match(/^Mega Rayquaza ex M6(?:\s+(\d+))?$/i);
    if (rayquazaM6) {
      const printNumbers: { [key: string]: string } = { '58': '84', '110': '138', '113': '141' };
      const targetNumber = rayquazaM6[1] ? printNumbers[String(Number(rayquazaM6[1]))] : '84';
      if (targetNumber) {
        const card = cards.find(candidate => candidate.set === 'DLR'
          && candidate.setNumber === targetNumber && candidate.name === 'Mega Rayquaza ex');
        if (card) return card.fullName;
      }
    }
    name = name.replace("é", 'e')

    // Apply card replacements (with numeric suffixes stripped for matching)
    const strippedName = stripNumericSuffix(name);
    const replacement = cardReplacementMap.get(strippedName);
    if (replacement) {
      name = replacement;
    }

    if (name == 'Zekrom ex BLK 34') {
      name = 'Zekrom ex SV11B 169';
    }

    if (name.includes('Vital A')) {
      name = 'PokéVital A SFA';
    }

    name = name.replace('Pok�', 'Poke');

    if (name.includes("Energy XXX")) { //prevent vintage energy misnaming
      name = name.replace("Energy XXX", "Energy SVE");
    }

    // if last word in card name is a number, remove it and trim the resulting string
    let cardWithoutSetId = name;
    const lastWord = cardWithoutSetId.split(' ').pop() || '';
    if (/^\d+$/.test(lastWord)) {
      cardWithoutSetId = cardWithoutSetId.split(' ').slice(0, -1).join(' ').trim();
    }
    cardWithoutSetId = cardWithoutSetId.replace('SV6a', 'SFA');

    if (cardWithoutSetId == 'Slakoth PAL') {
      cardWithoutSetId = 'Slakoth SSP';
    }

    if (cardWithoutSetId == 'Vigoroth PAL') {
      cardWithoutSetId = 'Vigoroth SSP';
    }

    if (cardWithoutSetId == 'Glass Trumpewt PRE') {
      cardWithoutSetId = 'Glass Trumpet PRE';
    }


    if (cardWithoutSetId.endsWith(' SV6')) {
      cardWithoutSetId = cardWithoutSetId.replace('SV6', 'TWM');
    }

    // card name is card without last word, trimmed
    const cardName = cardWithoutSetId.split(' ').slice(0, -1).join(' ').trim();


    let card: Card | undefined = cards.find(c => {
      if (cardWithoutSetId === c?.fullName || cardWithoutSetId === c?.fullName.replace('é', 'e')) {
        return true;
      }
      return false;
    });

    if (!card) {
      card = cards.find(c => {
      //try using alternate set abbreviations

      if (cardWithoutSetId == c?.name.replace('é', 'e') + ' ' + c?.set) {
        return true;
      }

      return false;
      });
    }

    if (!card) {
      card = cards.find(c => {
        if (cardName === c?.name?.replace('é', 'e')) {
          return true;
        }
        return false;
      });

    }

    return card?.fullName || '';
  }

  public serialize(state: State): SerializedState {
    const serializers = this.serializers;
    const refs: { node: Object, path: string }[] = [];
    const pathBuilder = new PathBuilder();

    const replacer: any = function (this: any, key: string, value: any) {
      pathBuilder.goTo(this, key);
      const path = pathBuilder.getPath();

      // Follow JSON.stringify's native handling: omit function-valued object
      // properties and serialize function-valued array entries as null. Attack
      // callbacks are executable card code, never part of a puzzle snapshot.
      if (typeof value === 'function') {
        return undefined;
      }
      if (value instanceof Array) {
        return value;
      }
      if (value instanceof Object && value._type !== 'Ref') {
        const ref = refs.find(r => r.node === value);
        if (ref !== undefined) {
          return { _type: 'Ref', path: ref.path };
        }
        refs.push({ node: value, path });
        const name = value.constructor.name;
        if (name === 'Object') {
          return value;
        }
        const serializer = serializers.find(s => s.classes.some(c => value instanceof c));
        if (serializer !== undefined) {
          return serializer.serialize(value);
        }
        throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown serializer for '${name}'.`);
      }
      return value;
    };
    return JSON.stringify([state.players, state], replacer);
  }

  public deserialize(serializedState: SerializedState): State {
    const serializers = this.serializers;
    const context = this.restoreContext(serializedState);
    const refs: { holder: any, key: string, path: string, node: Object }[] = [];
    const restored = new Map<Object, Object>();
    const parents = new Map<Object, { holder: any, key: string }>();

    const reviver: any = function (this: any, key: string, value: any) {
      if (value instanceof Object) { parents.set(value, { holder: this, key }); }
      if (value instanceof Array) {
        return value;
      }
      if (value instanceof Object) {
        const name = (value as Serialized)._type;
        if (typeof name === 'string') {
          if (name === 'Ref') {
            refs.push({ holder: this, key, path: value.path, node: value });
            return value;
          }
          const serializer = serializers.find(s => s.types.includes(name));
          if (serializer !== undefined) {
            restoreCompactDefaults(value, name);
            const instance = serializer.deserialize(value, context);
            restored.set(value, instance);
            return instance;
          }
          throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown deserializer for '${name}'.`);
        }
      }
      return value;
    };

    const parsed = JSON.parse(serializedState, reviver);

    // The reviver records only references, avoiding a second walk through every
    // hydrated card. Typed serializers replace their raw holders with instances.
    const pathBuilder = new PathBuilder();
    const survives = (node: Object): boolean => {
      const parent = parents.get(node);
      if (!parent) { return true; }
      const holder = restored.get(parent.holder) || parent.holder;
      const child = restored.get(node) || node;
      return holder[parent.key] === child && survives(parent.holder);
    };
    for (const ref of refs) {
      // Card hydration discards extra fields and their entire nested subtrees.
      if (!survives(ref.node)) { continue; }
      const reference = pathBuilder.getValue(parsed, ref.path);
      if (reference === undefined) {
        throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown reference '${ref.path}'.`);
      }
      const holder = restored.get(ref.holder) || ref.holder;
      holder[ref.key] = reference;
    }

    const state = parsed[1];
    restorePokemonEnergyRoles(state);
    return state;
  }

  public serializeDiff(base: SerializedState | undefined, state: State): SerializedState {
    if (base === undefined) {
      return this.serialize(state);
    }
    const parsedBase = JSON.parse(base);

    const players1 = parsedBase[0];
    const state1 = parsedBase[1];

    const serialized2 = this.serialize(state);
    const parsed2 = JSON.parse(serialized2);
    const players2 = parsed2[0];
    const state2 = parsed2[1];

    const jsonPatch = new JsonPatch();
    const diff = jsonPatch.diff([players1, state1], [players2, state2]);
    return JSON.stringify([diff]);
  }

  public deserializeDiff(base: SerializedState | undefined, data: SerializedState): State {
    const updatedData = this.applyDiff(base, data);
    return this.deserialize(updatedData);
  }

  public applyDiff(base: SerializedState | undefined, data: SerializedState): SerializedState {
    if (base === undefined) {
      return data;
    }

    const parsed = JSON.parse(data);
    if (parsed.length > 1) {
      return data;
    }

    let [players, state] = JSON.parse(base);
    const diff: JsonDiff[] = parsed[0];

    const jsonPatch = new JsonPatch();
    [players, state] = jsonPatch.apply([players, state], diff);

    return JSON.stringify([players, state]);
  }

  public static setKnownCards(cards: Card[]) {
    const { index, compatibility } = buildPrintCatalogue(cards);
    StateSerializer.knownCards = cards;
    StateSerializer.knownCardsByFullName = index;
    StateSerializer.printCompatibility = compatibility;
    console.log("cards set")
  }

  public static hasKnownCard(fullName: string): boolean {
    if (StateSerializer.printCompatibility.isCanonical(fullName) && !StateSerializer.printCompatibility.hasLegacyCanonical(fullName)) {
      return !!StateSerializer.printCompatibility.resolveIdentifier(fullName).card;
    }
    return StateSerializer.knownCardsByFullName.has(fullName);
  }

  private restoreContext(serializedState: SerializedState): SerializerContext {
    const parsed = JSON.parse(serializedState);
    const names: string[] = parsed[1].cardNames;
    const cards: Card[] = names.map((name, index) => {
      const fixedName = name?.replace("�", "é")
      const card = StateSerializer.printCompatibility.isCanonical(fixedName) && !StateSerializer.printCompatibility.hasLegacyCanonical(fixedName)
        ? StateSerializer.printCompatibility.resolveIdentifier(fixedName).card
        : StateSerializer.knownCardsByFullName.get(fixedName);
      if (card === undefined) {
        throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown cards '${fixedName}'.`);
      }
      const clonedCard = deepClone(card) as Card;
      clonedCard.id = index;
      return clonedCard;
    });
    return { cards };
  }


}

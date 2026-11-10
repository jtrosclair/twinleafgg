/** Immutable gz2 field dictionary. Never add, remove or reassign a code here.
 * A future dictionary requires a new transport version. Unknown keys use '~'.
 * Letter-only codes preserve property insertion order through JSON.stringify.
 */
export const PUZZLE_FIELD_CODES_V2: ReadonlyArray<readonly [string, string]> = Object.freeze([
  Object.freeze(["_type","a"]) as readonly [string, string],
  Object.freeze(["cards","b"]) as readonly [string, string],
  Object.freeze(["isPublic","c"]) as readonly [string, string],
  Object.freeze(["marker","d"]) as readonly [string, string],
  Object.freeze(["energies","e"]) as readonly [string, string],
  Object.freeze(["energyCards","f"]) as readonly [string, string],
  Object.freeze(["tools","g"]) as readonly [string, string],
  Object.freeze(["name","h"]) as readonly [string, string],
  Object.freeze(["superType","i"]) as readonly [string, string],
  Object.freeze(["path","j"]) as readonly [string, string],
  Object.freeze(["active","k"]) as readonly [string, string],
  Object.freeze(["bench","l"]) as readonly [string, string],
  Object.freeze(["deck","m"]) as readonly [string, string],
  Object.freeze(["deckId","n"]) as readonly [string, string],
  Object.freeze(["discard","o"]) as readonly [string, string],
  Object.freeze(["gameStats","p"]) as readonly [string, string],
  Object.freeze(["hand","q"]) as readonly [string, string],
  Object.freeze(["id","r"]) as readonly [string, string],
  Object.freeze(["lostzone","s"]) as readonly [string, string],
  Object.freeze(["markedAsNotSecret","t"]) as readonly [string, string],
  Object.freeze(["pokemonDamageStats","u"]) as readonly [string, string],
  Object.freeze(["prizes","v"]) as readonly [string, string],
  Object.freeze(["prizesTakenCount","w"]) as readonly [string, string],
  Object.freeze(["rules","x"]) as readonly [string, string],
  Object.freeze(["stadium","y"]) as readonly [string, string],
  Object.freeze(["supporter","z"]) as readonly [string, string],
  Object.freeze(["supportersForDetour","A"]) as readonly [string, string],
  Object.freeze(["topPokemon","B"]) as readonly [string, string],
  Object.freeze(["totalDamageDealt","C"]) as readonly [string, string],
  Object.freeze(["usedSquawkAndSeizeThisTurn","D"]) as readonly [string, string],
  Object.freeze(["damage","E"]) as readonly [string, string],
  Object.freeze(["prizesTaken","F"]) as readonly [string, string],
  Object.freeze(["pokemonPlayedTurn","G"]) as readonly [string, string],
  Object.freeze(["activePlayer","H"]) as readonly [string, string],
  Object.freeze(["alternativeSetup","I"]) as readonly [string, string],
  Object.freeze(["attackFirstTurn","J"]) as readonly [string, string],
  Object.freeze(["cardNames","K"]) as readonly [string, string],
  Object.freeze(["firstTurnDrawCard","L"]) as readonly [string, string],
  Object.freeze(["firstTurnUseSupporter","M"]) as readonly [string, string],
  Object.freeze(["format","N"]) as readonly [string, string],
  Object.freeze(["gameSettings","O"]) as readonly [string, string],
  Object.freeze(["logs","P"]) as readonly [string, string],
  Object.freeze(["phase","Q"]) as readonly [string, string],
  Object.freeze(["playerLastAttack","R"]) as readonly [string, string],
  Object.freeze(["players","S"]) as readonly [string, string],
  Object.freeze(["prompts","T"]) as readonly [string, string],
  Object.freeze(["recordingEnabled","U"]) as readonly [string, string],
  Object.freeze(["sandboxMode","V"]) as readonly [string, string],
  Object.freeze(["timeLimit","W"]) as readonly [string, string],
  Object.freeze(["turn","X"]) as readonly [string, string],
  Object.freeze(["unlimitedEnergyAttachments","Y"]) as readonly [string, string],
  Object.freeze(["winner","Z"]) as readonly [string, string],
  Object.freeze(["index","aa"]) as readonly [string, string],
  Object.freeze(["markers","ab"]) as readonly [string, string],
  Object.freeze(["specialConditions","ac"]) as readonly [string, string],
  Object.freeze(["boardEffect","ad"]) as readonly [string, string],
  Object.freeze(["energyPlayedTurn","ae"]) as readonly [string, string],
  Object.freeze(["stadiumPlayedTurn","af"]) as readonly [string, string],
  Object.freeze(["source","ag"]) as readonly [string, string],
  Object.freeze(["retreatedTurn","ah"]) as readonly [string, string],
  Object.freeze(["supporterTurn","ai"]) as readonly [string, string],
  Object.freeze(["stadiumUsedTurn","aj"]) as readonly [string, string],
  Object.freeze(["usedVSTAR","ak"]) as readonly [string, string],
  Object.freeze(["usedGX","al"]) as readonly [string, string],
  Object.freeze(["ancientSupporter","am"]) as readonly [string, string],
  Object.freeze(["winConditions","an"]) as readonly [string, string],
  Object.freeze(["mustLose","ao"]) as readonly [string, string],
  Object.freeze(["rocketSupporter","ap"]) as readonly [string, string],
  Object.freeze(["cardsInDeck","aq"]) as readonly [string, string],
]);

export const MAX_FIELD_CODE_JSON_BYTES = 8 * 1024 * 1024;
export const MAX_FIELD_CODE_DEPTH = 128;
export const MAX_FIELD_CODE_NODES = 250000;

const fieldToCode = new Map(PUZZLE_FIELD_CODES_V2);
const codeToField = new Map(PUZZLE_FIELD_CODES_V2.map(([field, code]) => [code, field]));

function transformJson(json: string, encode: boolean): string {
  if (new TextEncoder().encode(json).length > MAX_FIELD_CODE_JSON_BYTES) {
    throw new Error('Expanded puzzle is too large.');
  }
  const source = JSON.parse(json);
  let nodes = 0;
  const visit = (value: any, depth: number): any => {
    if (depth > MAX_FIELD_CODE_DEPTH) throw new Error('Puzzle field-code nesting is too deep.');
    if (++nodes > MAX_FIELD_CODE_NODES) throw new Error('Puzzle field-code structure is too large.');
    if (Array.isArray(value)) return value.map(item => visit(item, depth + 1));
    if (value === null || typeof value !== 'object') return value;
    // Own '__proto__' and other custom keys must remain data, never setters.
    const result = Object.create(null);
    for (const key of Object.keys(value)) {
      let target: string;
      if (encode) {
        target = fieldToCode.get(key) ?? '~' + key;
      } else if (key.startsWith('~')) {
        target = key.slice(1);
        if (fieldToCode.has(target)) throw new Error('Noncanonical escaped puzzle field.');
      } else {
        target = codeToField.get(key);
        if (target === undefined) throw new Error('Unknown puzzle field code.');
      }
      if (Object.prototype.hasOwnProperty.call(result, target)) {
        throw new Error('Duplicate expanded puzzle field.');
      }
      result[target] = visit(value[key], depth + 1);
    }
    return result;
  };
  const result = JSON.stringify(visit(source, 0));
  // Short keys may expand substantially. Bound the restored schema as well.
  if (new TextEncoder().encode(result).length > MAX_FIELD_CODE_JSON_BYTES) {
    throw new Error('Expanded puzzle is too large.');
  }
  return result;
}

/** Encode keys only; values, including Ref paths and card names, stay literal. */
export function encodePuzzleFieldCodes(json: string): string {
  return transformJson(json, true);
}

/** Restore ordinary JSON before any engine, host-history or schema processing. */
export function decodePuzzleFieldCodes(json: string): string {
  return transformJson(json, false);
}

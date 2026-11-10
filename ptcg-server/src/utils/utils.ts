
export function deepCompare(x: any, y: any): boolean {

  if (x === y) { return true; }
  // if both x and y are null or undefined and exactly the same

  if (!(x instanceof Object) || !(y instanceof Object)) { return false; }
  // if they are not strictly equal, they both need to be Objects

  if (x.constructor !== y.constructor) { return false; }
  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.

  for (const p in x) {
    if (!Object.prototype.hasOwnProperty.call(x, p)) { continue; }
    // other properties were tested using x.constructor === y.constructor

    if (!Object.prototype.hasOwnProperty.call(y, p)) { return false; }
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[p] === y[p]) { continue; }
    // if they have the same strict value or identity then they are equal

    if (typeof (x[p]) !== 'object') { return false; }
    // Numbers, Strings, Functions, Booleans must be strictly equal

    if (!deepCompare(x[p], y[p])) { return false; }
    // Objects and Arrays must be tested recursively
  }

  for (const p in y) {
    if (Object.prototype.hasOwnProperty.call(y, p) && !Object.prototype.hasOwnProperty.call(x, p)) { return false; }
    // allows x[ p ] to be set to undefined
  }
  return true;
}

export function deepIterate(source: any, callback: (holder: any, key: string, value: any) => void): void {
  if (source === null) { return; }

  if (source instanceof Array) {
    source.forEach((item: any) => deepIterate(item, callback));
  }

  if (source instanceof Object) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        deepIterate(source[key], callback);
        callback(source, key, source[key]);
      }
    }
  }
}

export function deepClone(source: any, ignores: Function[] = [], refMap: {s: Object, d: Object}[] = []): any {
  // A playability probe clones a large state graph. Repeated refMap.find calls
  // made that work quadratic; keep the public reference list and index it once.
  const references = new WeakMap<Object, Object>();
  for (const entry of refMap) {
    // Primitive sources can appear in a caller-provided map, but they never
    // participate in object lookup. WeakMap cannot use them as keys.
    const key = entry.s;
    if ((typeof key === 'object' && key !== null) || typeof key === 'function') {
      if (!references.has(key)) { references.set(key, entry.d); }
    }
  }
  const clone = (value: any): any => {
    if (value === null) { return null; }
    // Functions are executable card definitions; preserve their callable
    // reference rather than creating an object with Function's prototype.
    if (typeof value === 'function') { return value; }
    // Preserve the existing array-copy behavior and prototype-backed objects.
    if (value instanceof Array) { return value.map(clone); }
    if (value instanceof Object) {
      if (ignores.some(ignore => value instanceof ignore)) { return value; }
      if (references.has(value)) { return references.get(value); }
      const dest = Object.create(value);
      references.set(value, dest);
      refMap.push({s: value, d: dest});
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) { dest[key] = clone(value[key]); }
      }
      return dest;
    }
    return value;
  };
  return clone(source);
}

export function generateId<T extends {id: number}[]>(array: T): number {
  if (array.length === 0) {
    return 1;
  }

  const last = array[array.length - 1];
  let id = last.id + 1;

  while (array.find(g => g.id === id)) {
    if (id === Number.MAX_VALUE) {
      id = 0;
    }
    id = id + 1;
  }

  return id;
}

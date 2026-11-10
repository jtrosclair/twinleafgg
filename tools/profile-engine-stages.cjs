'use strict';

// Optional, process-local instrumentation/experiments for profile-puzzle-setup.
// These patches never write engine sources or generated engine output.
const path = require('node:path');
const { performance } = require('node:perf_hooks');

function instrument(engine) {
  const modules = name => require(path.join(engine, name));
  let active, phase;
  const patch = (holder, key, label, skip) => {
    const original = holder[key];
    let depth = 0;
    holder[key] = function (...args) {
      if (!active || (skip && skip.call(this))) return original.apply(this, args);
      const entry = active[`${phase}.${label}`] ||= { ms: 0, calls: 0 };
      entry.calls++;
      if (depth++) { try { return original.apply(this, args); } finally { depth--; } }
      const start = performance.now();
      try { return original.apply(this, args); } finally { entry.ms += performance.now() - start; depth--; }
    };
  };
  for (const method of ['decode', 'encode']) patch(modules('utils/base64').Base64.prototype, method, 'Base64.' + method);
  for (const method of ['parse', 'stringify']) patch(JSON, method, 'JSON.' + method);
  const serializer = modules('game/serializer/state-serializer').StateSerializer.prototype;
  patch(modules('game/serializer/state-serializer').StateSerializer, 'normalizeCardName', 'StateSerializer.normalizeCardName');
  for (const method of ['serialize', 'deserialize', 'restoreContext']) patch(serializer, method, 'StateSerializer.' + method);
  patch(modules('utils/utils'), 'deepClone', 'cardClone');
  for (const [file, type] of [['card-list.serializer', 'CardListSerializer'], ['generic.serializer', 'GenericSerializer'],
    ['card.serializer', 'CardSerializer'], ['state-log.serializer', 'StateLogSerializer'], ['prompt.serializer', 'PromptSerializer']]) {
    patch(modules('game/serializer/' + file)[type].prototype, 'deserialize', type + '.deserialize');
  }
  const store = modules('game/store/store').Store.prototype;
  patch(store, 'calculatePlayability', 'Store.calculatePlayability', function () { return this.calculatingPlayability; });
  for (const method of ['restoreState', 'propagateEffect']) patch(store, method, 'Store.' + method);
  const simulator = modules('client/simulator').ClientSimulator.prototype;
  for (const method of ['decodeSnapshot', 'settle', 'publish']) patch(simulator, method, 'ClientSimulator.' + method);
  patch(modules('game/serializer/path-builder').PathBuilder.prototype, 'getValue', 'Ref.lookup');
  return {
    begin(value) { active = {}; phase = value; },
    phase(value) { phase = value; },
    end() { const result = active; active = undefined; return result; }
  };
}

function applyVariant(engine, variant) {
  if (variant === 'baseline') return;
  const modules = name => require(path.join(engine, name));
  if (variant === 'fast-input') {
    applyVariant(engine, 'repair-exact');
    applyVariant(engine, 'base64-loops');
    return;
  }
  if (variant === 'repair-exact') {
    const { StateSerializer } = modules('game/serializer/state-serializer');
    const normalize = StateSerializer.normalizeCardName;
    StateSerializer.normalizeCardName = function (name) {
      // Same one-character repair already used by restoreContext; retain the
      // original compatibility normalizer for names without an exact match.
      const repaired = name.replace('�', 'é');
      return repaired !== name && StateSerializer.hasKnownCard(repaired) ? repaired : normalize.call(this, name);
    };
    return;
  }
  if (variant === 'memo-normalize') {
    const { StateSerializer } = modules('game/serializer/state-serializer');
    const normalize = StateSerializer.normalizeCardName, setKnown = StateSerializer.setKnownCards;
    let cache = new Map();
    StateSerializer.setKnownCards = function (...args) { cache = new Map(); return setKnown.apply(this, args); };
    StateSerializer.normalizeCardName = function (name) {
      if (!cache.has(name)) cache.set(name, normalize.call(this, name));
      return cache.get(name);
    };
    return;
  }
  if (variant === 'base64-loops') {
    const { Base64 } = modules('utils/base64');
    Base64.prototype.decode = function (value) {
      const binary = atob(value), bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
      return new TextDecoder().decode(bytes);
    };
    Base64.prototype.encode = function (value) {
      const bytes = new TextEncoder().encode(value);
      let binary = '';
      for (let index = 0; index < bytes.length; index += 8192) {
        binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
      }
      return btoa(binary);
    };
    return;
  }
  if (variant === 'batch-playability') {
    const { CheckHpEffect } = modules('game/store/effects/check-effects');
    modules('client/simulator').ClientSimulator.prototype.publish = function () {
      const store = this.store;
      const previous = store.calculatingPlayability;
      store.calculatingPlayability = true;
      try {
        for (const player of this.state.players) {
          for (const list of [player.active, ...player.bench]) {
            if (list.getPokemonCard()) store.reduceEffect(this.state, new CheckHpEffect(player, list));
          }
        }
      } finally { store.calculatingPlayability = previous; }
      if (!previous) store.calculatePlayability(this.state);
      this.notify?.(this.state);
      return this.state;
    };
    return;
  }
  if (variant === 'map-serialize') {
    const { PathBuilder } = modules('game/serializer/path-builder');
    const { GameError } = modules('game/game-error');
    const { GameCoreError } = modules('game/game-message');
    modules('game/serializer/state-serializer').StateSerializer.prototype.serialize = function (state) {
      const serializers = this.serializers, refs = new Map(), paths = new PathBuilder();
      return JSON.stringify([state.players, state], function (key, value) {
        paths.goTo(this, key);
        const path = paths.getPath();
        if (Array.isArray(value)) return value;
        if (value instanceof Object && value._type !== 'Ref') {
          if (refs.has(value)) return { _type: 'Ref', path: refs.get(value) };
          refs.set(value, path);
          const name = value.constructor.name;
          if (name === 'Object') return value;
          const serializer = serializers.find(candidate => candidate.classes.some(Type => value instanceof Type));
          if (serializer) return serializer.serialize(value);
          throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown serializer for '${name}'.`);
        }
        return value;
      });
    };
    return;
  }
  throw new Error('Unknown experimental variant: ' + variant);
}

module.exports = { instrument, applyVariant };

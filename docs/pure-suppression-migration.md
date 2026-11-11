# Pure Ability-suppression migration

Status: **experimental and unwired**. The existing `PowerEffect` gameplay path
remains authoritative. `fixtures/pure-suppression.fixture.ts` is a data-only evaluator for five
reviewed rule families; it is not a complete replacement and must not be called
from Magmortar or other production actions until coverage is complete. In
particular, caller-provided `coverage: 'complete'` is an assertion, not a
verified capability registry. No production adapter may claim completeness yet.

## Why this is needed

Magmortar DLR's Buddy Boost attaches Basic Energy from hand through an Ability.
Some effects forbid *attachment from hand*; other effects forbid *playing a card
from hand*. The current ability bypasses hand-attachment restrictions and
reactions. Broadcasting `AttachEnergyEffect` before moving the card is unsafe:
it mixes eligibility, physical movement, mutable observers, nested prompts,
and cancellation. A clone does not isolate external callbacks, module state,
randomness or externally emitted events.

The preserved opt-in red test
[`fixtures/power-effect-purity.red.fixture.ts`](fixtures/power-effect-purity.red.fixture.ts)
demonstrates this concretely: a Goodra suppression probe on a cloned state still
calls an unrelated `PowerEffect` observer whose closure is outside the clone.
This diagnostic intentionally fails; it is kept out of the ordinary suite until
the new suppression contract is complete. Reproduce only in a disposable copy:

```sh
cp docs/fixtures/power-effect-purity.red.fixture.ts \
  ptcg-server/src/sets/tests/power-effect-purity.red.spec.ts
cd ptcg-server
node scripts/test-card-regressions.cjs --filter=power-effect-purity.red
```

`CheckPokemonPowersEffect` is not an equivalent shortcut: the migration spec
reproduces that Galarian Weezing SHF can block Goodra with `PowerEffect` while a
powers query still reports Goodra's Ability. Real suppression must be preserved,
including source Ability suppression, owners, Pokémon slots and protection.

## Experimental rules and explicit boundaries

The evaluator takes plain data only: player/slot identities, card tags, marker
identities, source power data, rules, and explicitly supplied protection outcomes.
It receives no `StoreLike`, game object, callback, prompt or RNG. It returns
`blocked`, `allowed`, or `unsupported`; incomplete participant coverage,
missing required source power data, missing/unknown Iron Thorns protection,
and suppression cycles return `unsupported`. These outcomes are only as
complete as the supplied data; the module does not certify it itself.

The currently tested families are:

- Galarian Weezing SHF: opposing Active Neutralizing Gas, source Ability
  suppression, hand/discard and exempt Ability cases.
- Empoleon V BST: the existing Active and Rule Box conditions, including a
  synthetic untagged case. The current legacy code checks both Active Pokémon
  for a Rule Box, including Empoleon V; the prototype intentionally preserves
  that behavior rather than silently correcting a separate game bug.
- Iron Thorns ex TWM: the current legacy Rule Box tag set and source Ability
  check. The view must provide whether the exact target was removed from the
  `EffectOfAbilityEffect`; Stealthy Hood is covered by a parity test. A generic
  `preventDefault` flag is not interchangeable with a removed target.
- Victreebel UNB: marker name and source identity on the affected Pokémon.
- Arbok XY: marker name and source identity on the acting player's Active slot,
  matching current behavior even when a different Pokémon is queried.

The rules intentionally preserve **existing implementation semantics**, which
may contain independent card bugs. They do not certify all upstream rules,
legacy Ability effects, Poké-Bodies/Pokémon Powers, cross-card effects, dynamic
format overrides, unknown marker handlers, or all interactions among suppressors.
Stealthy Hood protection is supplied as an explicit fixture result; there is no
pure production evaluator for that protection or Tool suppression yet.

Run the real-engine parity and pure side-effect checks with:

In a disposable copy, install the research fixtures into their expected paths,
run the tests, and discard the copy:

```sh
cp docs/fixtures/pure-suppression.fixture.ts ptcg-server/src/game/store/pure-suppression.ts
cp docs/fixtures/pure-suppression-migration.spec.fixture.ts ptcg-server/src/sets/tests/pure-suppression-migration.spec.ts
cd ptcg-server
node scripts/test-card-regressions.cjs --filter=pure-suppression-migration
```

The selected fixture cases exercise real legacy `PowerEffect` calls and compare
their decisions with the data-only evaluator. Synthetic cases also check an
unrelated external observer, unknown coverage/protection and recursion cycles.
They are not proof of whole-catalogue suppression parity.

## Inventory and next steps

`pure-suppression-inventory.json` records a source scan made during this work.
Regenerate it after upstream changes with:

```sh
node tools/inventory-suppression.cjs --write docs/pure-suppression-inventory.json
```

The scan found 71 direct `instanceof PowerEffect` conditional branches across
69 source files; 66 contained a throw or prevention assignment in the scanned
branch, and 41 of those referenced a nested effect/blocking helper. These are
**lower-bound review leads**, not counts of true suppression rules: a nested
throw can be unrelated, and indirect dispatch, overrides, source marker hooks,
custom type tests, and future code are not exhaustively detected. Some branches
are a card's own activation rather than a global suppression rule. A file having
a `CheckPokemonPowersEffect` branch does not prove equivalent behavior.

Before production use:

1. Classify all actual `PowerEffect` suppressors, their zone and type scopes,
   source identity, format overrides, and nested Ability/Tool/Stadium effects.
   Implement pure suppression and protection hooks with a reviewed capability
   registry for every potentially relevant participant. Unknown cases must
   return `unsupported`; never silently treat an unported handler as a no-op.
2. Cross-check each hook against the existing behavior in test-only isolated
   fixtures, including player ownership, Active/Bench/hand/discard, Power types,
   markers, rule boxes, Stealthy Hood, suppression of the suppressor and cycles.
   Audit multi-card and callback timing separately. Preserve the red fixture
   above until the replacement can make it green without legacy fan-out.
3. Add an upstream-update review gate for new/changed participants and all
   indirect paths. A simple AST inventory is not sufficient to prove purity.
4. Only then use the pure query for Magmortar eligibility, add a safe physical
   commit and post-attachment notification contract, and test Goodra's coin
   timing, legal target pairs, canceled movement, two-Energy sequencing,
   reactions, stale callbacks, saved puzzles, complete replays, and mobile UI.
   Do not silently fall back to legacy probing after running a supposedly pure
   check, and do not reject unknown cases in production without a product choice.

A separate unshipped prototype explored Magmortar attachment semantics and a
batch optimization, but still fails the external-observer requirement. On a
Mac arm64/Node 24 using a full recorded puzzle modified to six eligible targets
and two Energy cards, 15 measured runs gave median prompt/resolve times of
3.10/2.16 ms for the current Basic-filter implementation, 8.37/4.47 ms for a
12+4 full-state-clone prototype, and 4.08/3.59 ms for a 1+2 clone audited-batch
prototype. These measurements do not establish Android performance, and the
batched version is not safe to ship while nested suppression still uses legacy
fan-out.

## Aerodactyl VSTAR investigation

The existing Ancient Star implementation can recursively probe suppression.
A broad reentrancy guard avoided some recursion but incorrectly allowed a nested
opposing V Ability, and a relevance-first protection refactor introduced cycles
with real Enamorus V and Corviknight VMAX immunity effects. A scoped-probe
research candidate passed targeted cases but is not production-ready: legacy
direct probes and protection coverage remain unaudited, and multiple protected
sources produced factorial probe growth (six synthetic sources: 3,912 power
probes, 1,956 protection events, 33.4 ms in one Mac/Node run). Arbitrary puzzle
payloads may contain such states even when ordinary game setup would not. A
cycle-safe dependency strategy must preserve genuine nested Ability actions,
independent suppressors and protection, avoid external side effects, and be
verified against saved puzzles before integration. Garbodor plus Spiritomb also
has a separately reproduced existing cycle without Aerodactyl.
A real-store counterexample also shows that target-only memoization is unsafe:
a protection can distinguish two physical Ancient Star sources and protect
against only one. Any cache would need source identity and certified purity
for every participating handler and nested dependency; current reducers may
mutate state or external closures, so caching is not generally sound.

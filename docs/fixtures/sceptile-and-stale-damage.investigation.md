# Sceptile protection and queued damage: deferred investigation

Status: **deferred; neither proposed patch is approved for integration** (2026-11-10).
The eleven-card copied-attack ownership migration is separate and does not depend
on these proposals. Shared runtime files were not changed by this investigation.

Power of Nature currently omits two printed requirements: Sceptile must belong
to the damaged Pokémon's player, and that Pokémon must have Grass Energy.
The proposed card fix implements both requirements and preserves the existing
attack-only ownership method. Its standalone safety is nevertheless incomplete:
the old overprotection masks invalid queued-damage paths elsewhere in the engine.

## Preserved proposals and hashes

The [proposed manifest](sceptile-and-stale-damage.proposed.manifest.tsv) records
full baseline/candidate SHA-256 values for three runtime files and two new specs.
The baseline is the shared tree after ownership batches 1–3; none of those
ownership changes should be reversed when revisiting this work.

| Proposal | Preserved artifact | Status |
| --- | --- | --- |
| Sceptile owner/effective-Energy checks | [card patch](sceptile-power-of-nature.proposed.patch) | Deferred |
| Stale damage cancellation/source-owner fallback | [core patch](stale-attack-damage.proposed.patch) | Incomplete; deferred |
| Detailed evidence | [investigation results](sceptile-and-stale-damage.investigation.json) | Research only |

The Sceptile candidate hash is
`d95d3ab96918f2b621d24ba40c0130d393ff28cfb2aa80cb6805a739b03acb0c`.
The Store candidate hash is
`e74858c4650d747ae8ca86deed3202f7dacbf340ae77a24999d822cd074ceaf9`.
The attack reducer candidate hash is
`19b078e1c0a8bbfa0529014429a9b1fe3b80a96d0adcf3cce90f63d188f5a583`.
These identify reviewed experiments, not a releasable revision.

## What the passing checks establish

The Sceptile fixture has 27 checks. The original handler passes 15 and fails 12;
the proposed handler passes all 27. These include actual Buzzwole Touchdown
attack actions, defending-side ownership, Grass versus other Energy, Rainbow
and blended Unit Energy under Temple of Sinnoh, real Garbotoxin suppression,
per-copy suppression, both Sceptile printings, Bench/friendly damage, copied
attacker tags, and Powerful Storm scaling. The card's data/text and attack-only
method remain unchanged.

The separate core fixture has 18 checks. The original core passes 7 and fails
11; the proposed core passes all 18. These cover target removal before damage,
during card fan-out and during Weakness calculation; departed source slots;
normal switching; Weakness/Resistance; preservation of prevention flags; invalid
empty-slot rejection; and absence of damage logs/follow-ups for cancelled events.
Strict compilation plus these fixtures and the two ownership suites passed
**134 tests** (27 + 18 + 43 + 46).

Those 134 checks exclude the deliberately red reused-slot counterexamples below.
Passing them does **not** establish complete attack lifecycle safety.

## Remaining counterexamples

These use real Jet Punch attack actions with an injected nested reaction. They
exercise the actual engine queue, but do not establish that an existing live
card independently triggers the injected mutation.

1. **Selected target slot removed.** The card-only correction correctly declines
   protection for an off-board target. The core still throws `INVALID_GAME_STATE`
   while looking up ownership. The old Sceptile handler appears to pass because
   it incorrectly cancels the damage before that lookup.
2. **Selected target slot reused.** The core proposal checks slot ownership but
   then damages a replacement Charmander occupying the same `PokemonCardList`.
   It has not captured the originally selected Pokémon's identity.
3. **Source slot reused.** Both baseline and proposed code read the replacement's
   tags through the mutable source slot. A queued Buzzwole-GX attack can therefore
   lose its Ultra Beast attribution when Charmander replaces it. This is a
   pre-existing attribution issue; the proposal does not fix it.

The core cancellation cannot be placed inside Sceptile as a workaround. Whether
an invalid damage event is cancelled must not depend on an unrelated Ability
being present.

## Reproduce only in an isolated checkout

These files intentionally end in `.fixture.ts` and are outside automatic test
collection. Copy them to the destinations below in an isolated checkout; the
three red cases are expected to fail until the remaining lifecycle is fixed.
Do not promote them into the ordinary passing suite unchanged.

| Fixture | Destination relative to `ptcg-server/src` |
| --- | --- |
| [Sceptile proposal](sceptile-power-of-nature.proposed.spec.fixture.ts) | `sets/tests/sceptile-power-of-nature.spec.ts` |
| [core proposal](stale-attack-damage.proposed.spec.fixture.ts) | `game/store/effect-reducers/stale-attack-damage.spec.ts` |
| [removed target](sceptile-stale-target.red.spec.fixture.ts) | `sets/tests/sceptile-stale-target.spec.ts` |
| [reused target](stale-reused-target.red.spec.fixture.ts) | `sets/tests/stale-reused-target.spec.ts` |
| [reused source](stale-reused-source.red.spec.fixture.ts) | `sets/tests/stale-reused-source.spec.ts` |

From `ptcg-server`, run the normal isolated source compiler and Jasmine driver:

```sh
node scripts/test-card-regressions.cjs --filter='sceptile|stale-attack|stale-reused'
```

The earlier [four-case Sceptile research fixture](sceptile-power-of-nature.red.md)
remains valid and deliberately red.

## Saved-state and first-action corpus

A fresh card-only comparison against the shared tree including ownership batch 3
verified that the bundled source inventories differed in exactly one runtime
file: Sceptile. Both inventories contained 10,742 inputs; no source paths were
added or missing. An earlier scratch comparison included 20 unrelated older
card files and was discarded before producing this evidence.

Of 669 stored rows, 532 contained decodable simulator states (376 active). All
532 validated in both versions; serialized state, card names, and deserialized
state were identical. The other 137 rows were classified as missing fragment,
invalid payload, or non-simulator format by the existing comparison script.

| First-action kind | Attempts | Same result | Succeeded in both | Rejected in both |
| --- | ---: | ---: | ---: | ---: |
| Trainers | 1,867 | 1,867 | 1,859 | 8 |
| Attacks | 684 | 684 | 145 | 539 |
| Abilities | 917 | 917 | 576 | 341 |
| Total | 3,468 | 3,468 | 2,580 | 888 |

These were read-only database comparisons with deterministic RNG/time for
actions. No differing outcome or new rejection was observed. They stop at
unresolved human prompts and do not prove the injected reaction cases safe.
The proposals remain deferred despite this normal-flow compatibility evidence.

## Required work before a future integration

Define how an attack captures source and selected-target **in-play identity**
before asynchronous reactions. Slot membership, the current top card's name, and
static physical card IDs alone are insufficient. A slot can be reused; the same
Pokémon can switch slots or evolve/devolve without becoming a replacement. A card
that leaves play and re-enters also needs a considered identity policy.

Capture source attribution without reading a later replacement's tags. Preserve
the existing effective type/Energy queries and attack modifiers. Validate target
identity before fan-out, after nested dispatch, and before damage/follow-up
commitment. Handle a departed attacker without attributing its attack to the
new occupant. Do not extend cancellation indiscriminately to damage counters or
other effects.

Add red/green controls for reused source/target slots, same-Pokémon switching,
evolution/devolution, and departure/re-entry. Keep snapshot references, physical
IDs, copied-session restoration, prompts, win conditions and old/plain/gz1/gz2
transport unchanged. Rebase onto the latest shared tree, then rerun strict
ownership/card/client checks, saved-state validation, and the action corpus.
The recorded first-action corpus does not replace prompt-continuation or full
turn tests.

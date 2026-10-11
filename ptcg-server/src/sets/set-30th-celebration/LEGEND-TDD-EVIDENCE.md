# CC16/CC17 LEGEND implementation evidence

## Scope

Source-only local implementation; no output compilation, commit, push, publish or deployment by this implementer. Parent owns fresh aggregate compilation, full-suite comparison and final integration review.

## Source-backed rules

- Unchanged `english-source-text.json` records for exact Limitless `30C/CC16` and `30C/CC17` attack effects.
- Both exact Limitless images inspected. CC16 is top, CC17 bottom. Bottom prints Fighting **and Psychic** ×2 weakness, unlike the incomplete provider page summary. 150 HP; Darkness/Psychic; retreat two; two Prize cards on KO.
- Separate physical halves, hand-only matching-pair assembly onto one Bench slot. Runtime top contains composite attacks; neither half is a Basic.

## Observed RED → GREEN tracer bullets

| Behavior slice | Observed RED before implementation | Final GREEN |
| --- | --- | --- |
| Composite half assembly | `1 spec, 1 failure`: expected 0 constructors to be 2 | Both hand directions, HP/types/prizes and illegal standalone play pass |
| Lost Crisis payment | `2 specs, 1 failure`: expected 0 prompts to be 1 | Real provided-Energy prompt and payment pass |
| Damage-only KO destination/full attachment stack | `3 specs, 1 failure`: expected Lost Zone size 0 to be 6; cards incorrectly in discard | Real UseAttackEffect → Energy payment → animation → damage → KO/prize lifecycle passes |
| Moon's Invite redistribution | `4 specs, 1 failure`: expected 0 prompts to be 1 | Total-preserving redistribution and target/source restrictions pass |
| Mandatory payment hardening | `4 specs, 1 failure`: damage still 100 before payment, duplicate selected Energy accepted, cancellation did not throw | Damage held at 0 until valid payment; duplicate/cancel refused |
| Classic registry completion | `7 specs, 2 failures`: exact CC16/CC17 absent; expected two missing identities to be zero | Both registered; no fixture exclusions; 30/30 Classic passes |
| Counter-move protection | `11 specs, 1 failure`: protected source/destination incorrectly changed damage 20→10 | Both ends checked through real effect-of-attack prevention; no counter creation/loss |

Additional passing regressions cover missing/same/in-play halves, full Bench, counter/effect-induced KOs, damage-then-counter KOs, pre-existing KOs, unrelated simultaneous KO, checkup, later attacks using the same attack definition, prevented damage, a saved damage KO with consumed destination, Double Colorless payment, Moon's Invite cancel/zero/one/empty boards and resulting LEGEND two-prize KO.

## Final commands

From `ptcg-server`:

```text
./node_modules/.bin/jasmine-ts src/sets/set-30th-celebration/darkrai-cresselia-legend.spec.ts --random=false
13 specs, 0 failures

./node_modules/.bin/jasmine-ts 'src/sets/set-30th-celebration/*.spec.ts' 'src/sets/tests/thirty-celebration*.spec.ts' --random=false
86 specs, 0 failures

./node_modules/.bin/tsc --noEmit --pretty false
exit 0, no diagnostics

git diff --check
exit 0
```

Node `require.resolve` under the declared ts-node loader selected `.ts` source for all five touched engine modules (attack/check/game reducers, game-effects and PokemonCardList), not stale JavaScript siblings.

Programmatic source-registry inventory: **202 distinct fullName identities**, **158/158 numbered**, **30/30 Classic**, **3/3 RGB**, no missing names/numbers. Frozen upstream identity regression passes in the scoped suite. Full compiled-root coverage and global identity drift remain parent verification, not a source-only claim.

Source inventory evidence is saved under the profile scratch directory as `30c-legend-final-source-inventory.json`; machine-readable checklist coverage is in `english-coverage-audit.json`. Final verification caught a stale checksum already recorded in that audit; it was corrected to the actual source fixture SHA-256 (`8c406f88d0a725d36e371cd5d790239d143b00197bacca770462a85071f6769f`) without modifying the fixture.

# Queued attack damage when a Pokémon slot is reused

Status: **open research**. These fixtures are deliberately red in the reviewed
stale-damage/Sceptile candidate and are not shipping tests. They document an
identity limitation separate from the candidate's fix for a slot that leaves
the table entirely.

Both fixtures dispatch Buzzwole-GX CIN's real **Jet Punch** attack action. They
inject a simulated nested reaction immediately before the selected Bench
`PutDamageEffect` is reduced, using `spyOn` to replace a Pokémon in a slot.
No specific currently registered card pairing has been identified that
produces this exact timing; the tests establish an engine edge case, not a
confirmed currently reachable puzzle sequence.

## Reproduce in a scratch checkout

Copy the two `queued-damage-reused-*.red.spec.fixture.ts` files beside the
existing specs in `ptcg-server/src/sets/tests`, removing `.fixture` from their
names. From `ptcg-server`, run:

```sh
node scripts/test-card-regressions.cjs --filter=queued-damage-reused
```

The tests use the same Pokémon slot object before and after the replacement;
the slot remains in play even though the Pokémon occupying it has changed.

## Observed results

* **Reused target:** the selected Bench Pokémon moves to hand and a replacement
  occupies its slot. The reviewed candidate deals 30 damage to the replacement,
  even though it was not selected. The original shared baseline passes this
  exact fixture for the wrong reason: its unrelated Sceptile Ability bug
  prevents Ultra Beast damage regardless of Energy. Thus the fixture exposes a
  stale-target risk revealed by fixing that Ability; it does not prove that
  slot reuse was otherwise safe in the original engine.
* **Reused source:** the attacking Ultra Beast is discarded and a non-Ultra
  Beast occupies the same slot before queued damage resolves. Both the baseline
  and the reviewed candidate deal 30 to a Grass-attached target protected by
  Sceptile, because the source's current occupant is mistaken for the original
  attacker. The expected damage is 0.

The combined candidate correctly handles the independently tested case in
which a whole source or target slot is removed from the table. These two tests
exercise a different situation: a still-valid slot no longer contains the
original selected or attacking Pokémon. A general fix likely needs to retain
and validate Pokémon identity across queued attack effects. Source attribution
must also remain available after the attacking card moves away, while preserving
legitimate switches and copied-attack behavior.

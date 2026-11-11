# Ambiguous outer-copy prompt orchestration

A handler can set `AttackEffect.preventDefault = true` to manage its own prompt
without intending to cancel the copied attack. The focused fixture wraps the
real M Gengar-EX PHF Phantom Gate reducer with that operation, then copies the
provisional Electrike MD Random Spark and selects the opposing Bench. Expected
Bench damage is 10; the experimental scope/cancellation prototype deals zero.
The wrapper is synthetic, not an assertion about a printed card.

Reproduce in a disposable checkout matching the accompanying dependency hashes:

1. Apply `git apply docs/fixtures/round28-target-orchestration.prototype.patch`.
2. Copy the `.red.spec.fixture.ts` to
   `ptcg-server/src/sets/tests/round28-target-orchestration.spec.ts`.
3. Run `node ptcg-server/scripts/test-card-regressions.cjs
   --filter=round28-target-orchestration`. The test is intentionally red.

The patch is an experimental reproduction artifact, not a proposed release.
It adds only Electrike and its required central prototype; do not merge it.
The separate `round28-nontarget-cancellation` fixture demonstrates a real
pre-existing bug on the unmodified baseline.

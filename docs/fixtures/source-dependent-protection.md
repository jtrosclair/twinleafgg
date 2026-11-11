# Protection-query cache counterexamples

`source-dependent-protection.spec.fixture.ts` uses the real engine Store and effects, with synthetic reducers to demonstrate two permitted behaviors: protection may vary between two identical-looking source cards, and a reducer may change its answer while emitting an observable side effect on each dispatch. The tests do not claim that current printed cards necessarily exhibit either behavior. A cache keyed only by target fails the first contract. Reusing a result between queries or skipping callbacks fails the second without a stronger purity guarantee.

Run in a disposable checkout with the simulator's development dependencies installed, from the repository root:

```sh
cp docs/fixtures/source-dependent-protection.spec.fixture.ts ptcg-server/src/sets/tests/source-dependent-protection.spec.ts
cd ptcg-server
node scripts/test-card-regressions.cjs --filter='source-dependent-protection'
```

Use Node 24. These tests run against the existing Store without the experimental Ancient Star code; the synthetic source Ability is not activated. Remove the copied test after running. This fixture is research and must not be bundled as simulator runtime code.

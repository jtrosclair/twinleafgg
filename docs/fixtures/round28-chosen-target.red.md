# Round 28 chosen-target damage regressions

Status: deliberately red, non-shipping, real-engine fixtures. The package includes the exact deferred Electrike MD implementation and targeted-damage helper under `round28-src`. The tests instantiate Electrike directly; no set registration or other deferred round28 card is required. Use a disposable checkout based on the upstream-sync workspace with its existing common helpers and Node 24:

```sh
cp -R docs/fixtures/round28-src/ptcg-server/src/sets/. ptcg-server/src/sets/
cp docs/fixtures/round28-chosen-target.red.spec.fixture.ts ptcg-server/src/sets/tests/round28-chosen-target-red.spec.ts
cp docs/fixtures/round28-choice-belt.red.spec.fixture.ts ptcg-server/src/sets/tests/round28-choice-belt-red.spec.ts
cd ptcg-server
node scripts/test-card-regressions.cjs --filter='round28-(chosen-target|choice-belt)-red'
```

Verified on a separate original-source snapshot without the round28 set or registry: 2 protection controls passed, and 5 assertions intentionally failed (log `/private/tmp/prizemap-round28-portable-check.log`). Direct and copied Random Spark do 10 instead of 40 when the target is an Active Pokémon V and the attacker holds Choice Belt. The tests remove the test helper’s duplicate Tool reference from `cards`, matching a Tool attached by the live reducer and ensuring the bonus applies only once. Separately, with a synthetic Stadium that adds 20 to the transient `AttackEffect`, direct and copied Random Spark incorrectly deal 20 damage to the opposing Active as well as 10 to the chosen Bench. Electrike's attack chooses only one opposing Pokémon. The synthetic Stadium represents the engine's modifier extension point; this is not a claim that a named printed Stadium has that effect. Two tests demonstrate that Manaphy BRS and `preventDamageNextTurn` correctly prevent the Bench damage.

Both defects require a reviewed solution for damage modifier context. A synthetic positive-damage replacement `Attack` object can break reducers that compare attack object identities; mutating a shared printed `Attack` can leak across nested actions. Do not ship the chosen-target batch based on the two green controls. The fixture files live under `docs/fixtures` and are not compiled or bundled into the simulator unless explicitly copied into a disposable checkout.

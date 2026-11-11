# Canceled attack still searches — non-shipping reproduction

This fixture captures a red regression in the deferred Toxel MEP 78 and Fennekin
MEP 80 candidate implementations of Call for Family. A real Hippopotas M3 Sand
Attack marker is attached to the active attacker exactly as Hippopotas's reducer
would attach it. The engine runs Hippopotas's real `CoinFlipEffect`; the test
asserts the coin callback value and that tails sets the matching `AttackEffect`
`preventDefault` to true. On tails, the attack should do nothing, but the queued
search callback still prompts, puts a Basic Pokémon onto the Bench, and shuffles.

Four direct/Mew-copied tails cases are red; four corresponding heads controls
pass. The fixture constructs a valid pre-existing Sand Attack marker rather
than replaying the prior turn. Do not blindly suppress callbacks for every
`preventDefault`: some legacy protections prevent damage to one target while
allowing an attack's other effects. A fix needs explicit cancellation semantics
and tests for those protection interactions and nested copied attacks.

## Run in a disposable checkout

From the repository containing this fixture, with a disposable simulator
checkout at `/path/to/checkout` (never overwrite a working tree):

```sh
cp -R docs/fixtures/round31-canceled-search/fixture/ptcg-server/src/. /path/to/checkout/ptcg-server/src/
cd /path/to/checkout/ptcg-server
node scripts/test-card-regressions.cjs --filter=round31-canceled-search.red
```

The test registers the two candidate classes in its local CardManager when they
are absent; it intentionally fails if an incompatible same-name card is already
registered. No production catalogue registration is needed. The fixture includes
the exact deferred print classes and search helper. It depends on the simulator's
existing base classes, `afterAttackDamage`, Mew 30C and Hippopotas M3. The
constructor file contains three additional inert candidate definitions as source
dependencies; none is registered by the test. Check for path collisions before
copying. Expected result: 4 passing heads controls and 4 failing tails tests.

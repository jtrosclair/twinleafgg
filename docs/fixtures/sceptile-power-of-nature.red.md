# Sceptile CES Power of Nature: existing behavior discrepancy

Status: **open**. This research fixture is deliberately red and must not be
included as an ordinary passing regression spec until the behavior is fixed.
The copied-attack ownership migration leaves the original Ability behavior
unchanged.

The follow-up owner/Energy fix and broader queued-damage proposal were
**deferred** after additional lifecycle counterexamples. See the
[investigation record](sceptile-and-stale-damage.investigation.md); neither
proposal is integrated.

## Reproduce in a scratch checkout

Copy `sceptile-power-of-nature.red.spec.fixture.ts` to
`ptcg-server/src/sets/tests/sceptile-power-of-nature.red.spec.ts`, then run
from `ptcg-server`:

```sh
node scripts/test-card-regressions.cjs --filter=sceptile-power-of-nature.red
```

The fixture dispatches the real Buzzwole CEC `Touchdown` attack action through
the normal game engine. It uses Grass Energy SVE for Buzzwole's cost, 60 base
damage, and a turn-2 game. In the observed run, two controls pass and two
expectations fail:

* When defending Sceptile CES has no Grass Energy, the attack should deal 60;
  it currently deals 0.
* When the attacker's own benched Sceptile is in play and the opposing active
  Pokémon has Grass Energy, the attack should deal 60; it currently deals 0.
* With defending Sceptile holding Grass Energy, the attack correctly deals 0.
* With the Ability suppressed, the attack correctly deals 60.

The existing implementation in `set-celestial-storm/sceptile.ts` tests for an
Ultra Beast damage source and suppression but does not verify either Grass
Energy on the damaged Pokémon or that Sceptile belongs to that Pokémon's
player. The future fix should verify both ownership and attached energy,
preserve Ability suppression, account for energy-providing effects rather than
relying only on printed basic-energy names, and test multiple Sceptile cards,
Bench damage and copied attacks. Avoid changing the attack-only ownership
migration as a substitute for fixing the original Ability.

# Team Aqua's Great Ball — pre-fix search defects

This non-shipping fixture covers the existing `Team Aqua's Great Ball DCR`
implementation, independently of the new Spheal port. Its printed text allows
one Basic Team Aqua Pokémon and one basic Water Energy from the deck, reveals
them, puts them into hand, then shuffles. Before the local fix the prompt had
`max: 1` across both categories, rejecting a legal two-card selection. Selecting
zero cards also returned without shuffling a nonempty searched deck. The local
fix implements both categories, reveal and shuffle; the fixture records the
prior behavior.

The fixture includes the exact Team Aqua's Spheal DCR candidate solely as a
self-registering test dependency, with its Team Aqua tag. It does not register
or ship any production card. `Team Aqua's Great Ball DCR` must already exist in
the checkout. The tests use real Item play and the engine's prompt validation.

## Run

From the repository root, copy the fixture into a **disposable** compatible
checkout (check for pre-existing paths first), then run:

```sh
cp -R docs/fixtures/team-aqua-great-ball/fixture/ptcg-server/src/. /path/to/checkout/ptcg-server/src/
cd /path/to/checkout/ptcg-server
node scripts/test-card-regressions.cjs --filter=team-aqua-great-ball.red
```

On the pre-fix revision, one control passed and two intended-rule tests failed;
all three now pass. The shipping regression suite additionally checks zero,
one or one from each category, invalid choices, deck privacy, reveal ordering,
shuffle, Item locks, cancellations and intercepted moves.

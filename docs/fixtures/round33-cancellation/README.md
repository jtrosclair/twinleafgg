# Sand Attack cancellation in original cards and candidate prints

This is a non-shipping research fixture. A real Hippopotas M3 Sand Attack marker is present on the attacker, and each regression independently checks the actual CoinFlipEffect callback reports tails and sets the matching AttackEffect `preventDefault` flag. The canceled attack nonetheless deals ordinary damage. Hop's Zacian ex also damages the Bench, Cynthia's Garchomp ex draws, Hop's Snorlax self-damages, and Iono's Bellibolt ex marks its next-turn attack lock. Lillie's Clefairy ex supplies the ordinary damage-only control. Each scenario uses both a direct attack and a Mew ex 30C copied attack.

The `audit` directory contains candidate and baseline specs and their exact test logs: each reports 0 passing and 10 intentionally failing. The baseline contains the matching older JTG/DRI printings before adding the candidate. It exhibits the same failures, so these are pre-existing engine/parent defects, not regressions caused by reprinting. This is not a proposed runtime fix; cancellation, target-only protection and asynchronous continuations need an explicit engine solution.

`frozen-candidate` preserves the complete originally evaluated 10-print overlay and its two passing test suites, as well as its original source/dependency hash manifest. Seven prints were deferred pending a cancellation fix: Luxio P8, Piplup P8, Hop's Snorlax SVP 184, Hop's Zacian ex SVP 193, Iono's Bellibolt ex SVP 194, Lillie's Clefairy ex SVP 195, and Cynthia's Garchomp ex SVP 204. The remaining three may be handled independently and still inherit the global ordinary-damage cancellation defect: all Pokémon attacks are affected by that legacy behavior. Do not blindly overlay the saved barrel into a working checkout: it is a complete snapshot of `src/sets/index.ts`; verify its preimage hash and use a disposable matching checkout. The 10-print overlay and audit files are research material and are not registered by this fixture directory.

To run the baseline reproduction in a disposable checkout with the existing parent cards and real test helpers:

```sh
cp docs/fixtures/round33-cancellation/audit/baseline.red.spec.fixture.ts /path/to/checkout/ptcg-server/src/sets/tests/round33-cancellation-parent.spec.ts
cd /path/to/checkout/ptcg-server
node scripts/test-card-regressions.cjs --filter=round33-cancellation-parent
```

To reproduce the candidate, first prepare a disposable checkout at the exact baseline hashes in `frozen-candidate/manifest.json`, verify all destinations and overlay only the six listed files, then copy `audit/candidate.red.spec.fixture.ts` into `ptcg-server/src/sets/tests/round33-cancellation-candidate.spec.ts` and run the matching test filter. The fixture relies on the full simulator card library and normal real-engine test helpers; it does not contact external services. See `SHA256SUMS` for the saved files.

# Tuck Tail attacker identity after a damage-boundary switch

This is a non-shipping regression fixture for an existing Meowth ex POR issue.
In both direct Tuck Tail and a Mew ex 30C Memory Helix copy, it dispatches a
real attack and injects a switch of the attacking Pokémon when the opponent
receives `AfterDamageEffect`, before the subsequent `AfterAttackEffect`.
Meowth's existing handler reads `player.active` at that later point and returns
the replacement Charmander instead of the original attacker and its cards.

The original shared Meowth definition (SHA-256
`8896fc0d30350966c5dd92c1f1819b781e1db63263e3ef6b3b74ec2b46996a39`)
and the isolated Holon-return candidate (SHA-256
`544a2ccf0c0f68d858fee6ad7c0aa2fa750b5b458617b7c5da9721f3b3c9fbf2`)
both produced **0 passing / 2 failing** on the fixture. This is not introduced
by the Holon-return candidate.

The switch timing is deliberately injected using a spy. A naturally occurring
card interaction that causes the same ordering has **not** been identified.
The expected ownership behavior is that the original attacker, not its
replacement, is the Pokémon referred to by the attack's return effect.

To reproduce in a disposable checkout, copy
`meowth-before-after-switch.red.spec.fixture.ts` to
`ptcg-server/src/sets/tests/meowth-before-after-switch-review.spec.ts`, then run
from `ptcg-server` with Node 24:

```sh
node scripts/test-card-regressions.cjs '--filter=meowth-before-after-switch-review.spec'
```

Both tests intentionally fail until this separate attacker-identity issue is
resolved. Do not add the fixture as an ordinary passing test or interpret it as
proof that a specific current card naturally triggers the injected timing.

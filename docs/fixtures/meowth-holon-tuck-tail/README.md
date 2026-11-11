# Meowth / Holon Energy defect: pre-fix reproduction

This is a non-shipping regression fixture for the pre-fix behavior. In real actions, attach Holon's Magnemite DS from hand as Energy to an attacker, then use Meowth ex POR's Tuck Tail either directly or via Mew ex 30C's Memory Helix. The attack says to return the attacker and **all attached cards** to hand. Before the local fix, the attachment resolved and 60 damage was dealt, but Holon's Magnemite was discarded instead of returned.

The exact pre-ownership-batch Meowth source has SHA-256 `bf99109e0ca234d6de8a780b0c8e8129e0624afbe539a8d32de5db97d2fde1c9`. Both cases also fail under the ownership candidate Meowth source SHA-256 `8896fc0d30350966c5dd92c1f1819b781e1db63263e3ef6b3b74ec2b46996a39`. Its Tuck Tail return branch was moved unchanged, so this is an existing issue, not a newly introduced defect. The original gameplay run using these same setups reported 10 controls passing, both Holon cases failing; a diagnostic repeat against the exact baseline confirmed the card was in discard. The fixture depends on the normal current engine, card library, and `test-helpers.ts`/`card-test-helpers.ts` in a full checkout.

In a disposable checkout, from `ptcg-server`:

```sh
cp ../docs/fixtures/meowth-holon-tuck-tail/tuck-tail.red.spec.fixture.ts src/sets/tests/meowth-holon-tuck-tail.spec.ts
node scripts/test-card-regressions.cjs --filter=meowth-holon-tuck-tail
```

The two assertions failed on the documented pre-fix revisions and pass with the local fix. The old code filtered every `PokemonCard` instance out of the non-Pokémon attachments; Holon's Magnemite remains a `PokemonCard` instance while acting as Energy and is excluded from the evolution stack by its attachment classification. The local fix includes those attachments and tests direct/copy, restored state, reuse, and Tool aliases. An independent [pre-AfterAttack switch fixture](../meowth-pre-afterattack-switch/README.md) records a separate pre-existing timing issue with injected switch timing.

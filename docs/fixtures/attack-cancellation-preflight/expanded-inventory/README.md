# Expanded attack-legality investigation

This directory is non-shipping research. It extends the earlier 92-branch inventory without modifying the original candidate, manifest, or fixtures.

On the local 2026-11-10 working tree, `scan.cjs` examined 10,670 set TypeScript files, with source-tree SHA-256 `4a567617fd09bba5aef163f6568744810bf8f347fab69e76ee38519b2e2bda57` using the algorithm inside the script. It found **301 syntactic audit candidates**, saved in `snapshot.json`: 98 under an explicit `instanceof AttackEffect` condition (95 directly inside reducer methods, 3 inside nested function callbacks), 184 under `WAS_ATTACK_USED` (150 direct, 34 inside callbacks), and 19 under other attack-related conditions. The scan identifies `GameError` throws by syntax and does not prove that each is an attack-use restriction. It misses helper-mediated throws, non-`GameError` prohibitions, other syntactic shapes and dynamically selected behavior. The callback classification is syntactic, not proof a callback is asynchronous. `pre-throw-scan.cjs` found 12 branches with syntactically suspicious earlier mutations, prompts or derived-effect queries; `pre-throw-snapshot.json` is an audit list with false positives and omissions.

Run both inventories from a checkout with the server dependencies installed:

```sh
node docs/fixtures/attack-cancellation-preflight/expanded-inventory/scan.cjs > /tmp/attack-legality-snapshot.json
node docs/fixtures/attack-cancellation-preflight/expanded-inventory/pre-throw-scan.cjs > /tmp/attack-legality-before-throw.json
```

A separate raw text scan, `after-attack-scan.cjs`, recorded 1,163 set files mentioning `AFTER_ATTACK(...)` or `instanceof AfterAttackEffect` (933 and 237 respectively, with overlap) on the same source-tree hash. This is a review upper bound, not a count of bugs: some matches can be comments or unrelated helpers. It illustrates why preserving lifecycle cleanup while suppressing canceled attack-owned effects also requires more than changing the pre-attack phase. Run it the same way, redirecting output to a temporary file.

An optional first argument gives the root of another checkout. A changed source-tree hash or TypeScript version can change the snapshot; do not treat these totals as a permanent exhaustive registry.

Concrete constraints established by source inspection and targeted controls:

- Some nested throws validate a player's choice only after a prompt; Darkrai & Cresselia Legend and English Palkia Lv.X validate selected cards or transfers there. Hoisting every throw ahead of a coin flip would use values that do not yet exist.
- Some legality logic performs derived queries. Lycanroc VMAX uses `CheckHpEffect`, and Slaking ex SSP consults `PowerEffect` to determine whether its Ability is suppressed. Dispatching legacy queries on live state is not a proven pure operation, and naïvely reading an Ability ignores suppression, protection and cycles. `slaking-suppression.spec.fixture.ts` covers real AttackActions: with no opposing ex or V the attack is blocked, while an opposing Garbodor DRX with a normally stored Tool suppresses the Ability and permits 280 damage.
- Rayquaza-GX CES checks a GX-use restriction, mutates `player.usedGX`, then checks whether the deck is empty. A split must preserve which errors win and when state changes become visible; blindly copying code before cancellation can mutate resources too early.
- The real Store sends effects to stadium and supporter, active/bench stacks and Tools, prizes, hand, deck and discard. It then invokes copied-session logic, and physical card references can occur more than once. Native Cobalion-GX Iron Rule checks a marker keyed to the physical source without requiring it to remain in play. `hidden-zone-legality.spec.fixture.ts` demonstrates rejection when that source is in each of hand, discard, deck and prize. A certificate of only the visible board would bypass a real restriction.
- Trainer format overrides can replace the effective reducer at runtime. Any certification needs to cover that effective handler, exact card identity, player, attack identity and retained copied/marker source; a class-name list alone is insufficient.
- Nested copies can be selected only after an attack starts. Clefable JU Metronome creates a nested `AttackEffect` from a prompted defending attack without a `copycatAttack` metadata flag. A certificate must cover all reachable choices and their transitive validators, or leave the state on the legacy path.
- `TrainerCard.prototype.reduceEffect` can invoke executable `attack.effect` callbacks, including copied Technical Machine attacks. A base-class-only certificate must also verify the selected or copy-derived callback and its dependencies by trusted identity; an unknown callback is not certified.
- `AttackEffect.preventDefault` is overloaded. Some handlers prevent a whole attack, while Klefki STS, Holon Energy WP and Unown G can protect a target without canceling a valid Bench effect. Do not equate this flag with whole-attack cancellation. Attack cleanup, `AfterAttackEffect`, copied attack scope, prompts and error/reset cleanup must remain correct in either path.

Certificate provenance must hash or version transitive shared helpers, engine reducers, format overrides and suppression queries, not just card files: upstream edits to a helper can invalidate many card proofs. At runtime, validate actual trusted function/object identities; never accept a certificate claim from puzzle-supplied metadata. Unresolved dynamic calls or prototype overrides require the legacy path.

Any certificate and cancellation context must be tied to the exact Store, state identity, attack invocation and attack object. A pending prompt can be followed by sandbox edits, and `Store.restoreState` discards in-flight prompt continuations. Revalidate a certificate at every continuation after state changes, or prohibit conflicting mutations; clear contexts on success, failed actions, nested-copy completion, reset and restored-state replacement. Do not replay an old continuation against a replacement state graph.

A useful acceptance suite must cover native Cobalion Iron Rule and Sirfetch'd's reuse lock with no coin for illegal attacks, hidden-zone marker sources, direct and nested copied attacks, multiple blockers, both coin outcomes, target-only protections with allowed Bench damage, Ability suppression and derived HP queries, selected-cost validation and errors, source removal, reset/undo, and normal after-attack cleanup. Then run the existing engine suite, read-only saved-puzzle/first-action comparisons and recorded solution replays without weakening the known tests.

A concrete bounded design would first build one ordered responder plan using the same collector as native `propagateEffect`, augmented by copied-session and marker hooks. The plan must retain duplicate occurrences and the effective format override and must identify executable attack callbacks. Only if every reachable responder, transitive derived query and after-attempt hook has a verified contract for the exact effective function and attack identity should the engine enter the new path. In that path it validates hard restrictions, resolves a typed whole-attack cancellation once per invocation, skips attack-owned effects on cancellation and runs the certified unconditional lifecycle cleanup. A nested copied attack needs its own invocation token, not only an attack-object key. If certification is incomplete, the entire attempt must take the unchanged legacy path before any new validation, coin flip or mutation. This is a bounded partial fix, not a solution for uncertified states.

A bounded migration is only safe when every reachable responder and all of its derived legality dependencies are proven to have a pure contract. The certificate must include hidden zones, format overrides, copied retained sources, marker hooks, actual traversal order and duplicate references. If certification is incomplete, preserve the legacy execution path and report cancellation as unsupported for that state; do not silently allow an illegal attack or reject an otherwise legal one. A full fix needs exhaustive contracts or another proof covering every reachable effect, not speculative reducer execution against live state.

To run the hidden-zone real-Store control in a disposable checkout:

```sh
cp docs/fixtures/attack-cancellation-preflight/expanded-inventory/hidden-zone-legality.spec.fixture.ts /path/to/checkout/ptcg-server/src/sets/tests/attack-legality-hidden-zones.spec.ts
cd /path/to/checkout/ptcg-server
node scripts/test-card-regressions.cjs --filter=attack-legality-hidden-zones
```

`hidden-zone-vs-preflight.spec.fixture.ts` combines those hidden-zone sources with a real Sandshrew BS marker and an actual AttackAction. It passed 4/4 against the baseline: each illegal attack was rejected, the coin prompt was never shown and the turn stayed unchanged. Against the preserved preflight prototype it failed 4/4: each illegal attack was accepted, the prompt fired and the turn advanced. To reproduce, copy the fixture into each disposable checkout's test directory as `attack-legality-hidden-flip.spec.ts`, then run `--filter=attack-legality-hidden-flip`.

The hidden-zone control should pass all four cases on the baseline. To run the two Ability-suppression controls, copy `slaking-suppression.spec.fixture.ts` into the same test directory as `attack-legality-slaking.spec.ts` and use `--filter=attack-legality-slaking`. `SHA256SUMS` covers this directory. The companion `round33-cancellation` fixture preserves actual canceled-attack failures and corresponding parent-print controls.

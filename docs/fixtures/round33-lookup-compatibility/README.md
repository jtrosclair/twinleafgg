# Deferred Round 33 promo lookup compatibility

This non-shipping fixture preserves the exact v6 candidate for Iono's Kilowattrel SVP 182, Lillie's Ribombee SVP 183 and Professor's Research SVP 221. These three additions remain deferred. The executable card classes, their tests, the serializer and deck API changes, and the complete source/dependency manifest are saved under `frozen-v6/`. The manifest SHA-256 is `341023ebcfc8bd0918f8b6588126f8df33b430695b325277ac5692da0e116f0c`; each saved candidate file was checked against it. The fixture is not a shipping patch.

The candidate introduced distinct internal fullNames such as `Professor's Research221 SVP`, so the old unnumbered input could retain its earlier fallback while a saved new print had a distinct identity. It fixed real wrong-number regressions for standard, hyphenated, curly-apostrophe and alphanumeric inputs in the existing catalogue. The evidence directory contains the v6 focused engine/API results, 534-state read-only comparison, 52,695-input prior deck comparison, 14-case production hyphen route test, and the independent 3,888-input internal-alias matrix. These checks do **not** establish future registration-order safety; v6 was not integrated. The common engine-wide Sand Attack damage-cancellation defect remains separate, documented in `../round33-cancellation/`.

## Reproduced future duplicate edge

The independently reviewed `duplicate-identity-v6.portable.cjs` bundles the real baseline and candidate engines and injects a **synthetic** alternate with the same printed name, set and collector number, while preserving a real Professor's Research card prototype. No such duplicate is claimed to exist in the current catalogue. The checked-in log captures both registration orders and removal of the new print:

- Before adding v6, the synthetic alternate is the existing generic fallback for `Professor's Research SVP 999`. After v6, serializer falls back to Research BRS and the deck parser reports unknown instead.
- For the valid `SVP 221` input, the v6 serializer can choose the alternate if it comes first; the deck parser and `get-cards` can choose the alternate if it comes last.
- If the intended 221 class is missing, the v6 exact lookup can substitute the synthetic alternate instead of reporting that the intended print is unavailable.

These are controlled future-compatibility counterexamples, not a claim that the present saved-puzzle corpus contains an affected duplicate. The reproduction asserts the known v6 failure and prints `V6_COUNTEREXAMPLE_REPRODUCED`; a corrected implementation should make those old failure assertions fail and should have positive regression tests instead.

To run without editing a working tree, prepare two disposable copies matching the baseline in `frozen-v6/manifest.json`; verify every listed preimage and then overlay the nine saved candidate files only into the candidate copy. Both copies need server dependencies; provide the esbuild module path if it is not installed under the candidate checkout:

```sh
node docs/fixtures/round33-lookup-compatibility/duplicate-identity-v6.portable.cjs \
  /path/to/baseline /path/to/candidate /path/to/esbuild
```

The tool can optionally accept the frozen overlay as a fourth argument when the candidate checkout already contains the overlay's newly added module paths. It builds isolated temporary bundles, restores its test-only registry overrides, and does not write to either checkout. `SHA256SUMS` covers all fixture files. Markdown and `.log` files are ignored by repository Git rules and require explicit force-add if retained in a commit.

## Plan for a generic safe resolution

1. Factor the existing parser's map construction and six-stage lookup into shared helpers operating on an explicit ordered card array. Preserve fullName and normalized-name precedence, collector numbers, `usSetNumber`, set aliases, replacement handling, format-dependent details, and current map ordering. Keep the existing public behavior unchanged in a baseline-only test before introducing any new prints.
2. Resolve each explicitly supported new collector number by its intended canonical fullName and verify its printed name, set and number. Handle the intended print being absent explicitly; do not silently substitute an alternate class. An exact same-fullName duplicate needs a defined collision policy because fullName alone cannot distinguish it.
3. For unregistered numbers and legacy unnumbered names, run the **same** generic resolver against a catalogue excluding only the newly added canonical identities. Preserve all pre-existing alternate prints and their original relative ordering. Apply the equivalent filtered lookup to serializer normalization without changing old casing or whitespace semantics. Build this filtered view lazily or once per request; never temporarily mutate the shared CardManager or static global catalogue.
4. Cover `parseDeckList`, `getCards` and serialized name restoration, including exact canonical fullName round trips; valid/missing prints; unnumbered input; padded, wrong, alphanumeric and internal-alias numbers; SVP/PR-SV aliases; straight and curly apostrophes; whitespace and hyphens; both registration orders; and synthetic distinct classes sharing the same printed identity. Explicitly test format/image mapping and the cost of the filtered view.
5. Repeat the independent route matrix and complete legacy catalogue/deck comparisons, the read-only saved-state and first-action comparisons, and recorded solution replays against an exact refreshed baseline. Keep the three prints on the upstream ledger as deferred until the generic resolver is independently reviewed and all checks pass.

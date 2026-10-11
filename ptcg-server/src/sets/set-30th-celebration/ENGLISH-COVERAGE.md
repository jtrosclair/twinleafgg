# English 30C local coverage audit

## Outcome

- All **158/158 numbered English prints** resolve by number **and name**.
- **30/30 Classic prints** resolve with English `30C CCn` image identities.
- All **3/3 Limitless R/G/B Mew prints** resolve with the exact image keys.
- Registry contains **202 unique fullName identities**. All **133 frozen upstream identities** remain unchanged, including the ten M6a entries and the legacy non-ex Mewtwo occupying 30C #64.
- English Mewtwo #63 and Mewtwo ex #64 are additive, not rewrites. English Mew ex #66 is likewise additive. New English print classes explicitly set `usSetNumber`.

Machine-readable per-print coverage, source fixture checksum, verification commands and blockers are in `english-coverage-audit.json`. `english-print-manifest.json` freezes the entire intended English numbered/Classic/RGB checklist. `english-source-text.json` freezes provider effects for all 69 additive registrations, including both implemented LEGEND halves.

## Sources and numbering

Regular missing prints and numbered alternate arts use the exact TCGdex `30th-020`, `053`, `054`, `063`, `064`, `066`, and `129`–`158` card details. Classic effects use the exact Limitless English `/cards/30C/CC1`–`CC30` pages; R/G/B use their respective Limitless pages. All URLs are retained in the source-text fixture.

TCGdex `30th-c` ordering differs from the English image/checklist order: English CC1 is Pikachu and CC2 is Charizard. Therefore the Classic fixture uses verified Limitless English CC numbering instead of blindly mapping TCGdex list positions.

Alternate arts inherit matching executable base classes. Twenty-three Classic prints inherit exact historical implementations. Effect-text comparison normalizes only typography, energy symbols, and the two documented equivalent wordings ("basic energies"/"basic Energy cards" and sequential hand shuffle/draw wording). Synthetic LV.X/BREAK/LEGEND assembly rule powers are excluded from the printed attack/power comparison, not from the runtime cards.

New behavioral implementations cover regular Palkia; both Pikachu ex variants; Classic Misty; Erika's Jigglypuff; Shining Celebi; Palkia LV.X; and Magikarp. Corrected Mewtwo and ex prints inherit existing matching mechanics. Tests exercise real Store prompts, energy attachment/search/discard, switch timing and prompt ownership, healing, condition selection, deterministic coin results, damage modification and LV.X previous-level attack availability. Registry tests resolve actual CardManager entries, not source-file presence alone.

## Completed LEGEND escalation: CC16 and CC17

Both Darkrai & Cresselia LEGEND halves are registered with exact `30C CC16` / `30C CC17` image keys. Either half's hand-only `LEGEND_ASSEMBLY` rule requires its matching counterpart and a free Bench slot, then places bottom/top in one PokémonCardList. They are not independently playable Basics. The composite has 150 HP, Darkness/Psychic typing, two retreat, and the existing DUAL_LEGEND two-prize rule.

Both [CC16 artwork](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/30C/30C_CC16_R_EN.png) and [CC17 artwork](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/30C/30C_CC17_R_EN.png) were inspected. The bottom artwork prints **Fighting AND Psychic ×2 weakness**; Limitless's text summary omits the second weakness. The implementation follows the artwork. Attacks match the unchanged exact Limitless source fixture.

- **Lost Crisis:** the real attack lifecycle waits for mandatory two-Energy payment to Lost Zone before dealing 100 damage. Cancellation, duplicate physical Energy, and insufficient payment are rejected. The opt-in on that specific AttackEffect is armed only after payment. Only actual PutDamageEffect damage crossing the current HP threshold records a destination, with owner/turn/target-card provenance. The next KO scan consumes this destination; saved Pokémon, effect-induced KOs, unrelated simultaneous KOs, checkup and later attacks retain default discard behavior. The KO route moves the Pokémon stack, tools, Energy/Pokémon-as-Energy and nested attached cards to Lost Zone once each. It does not reuse or modify Lost City's different attached-card discard rule.
- **Moon's Invite:** the card-local strengthened MoveDamagePrompt allows optional transfers of existing counters only between distinct occupied opposing Pokémon. It rejects self-transfers, empty slots, own Pokémon and excessive outgoing counters. Every successful transfer preserves total counters, respects attack-effect protection at both ends, and lets the ordinary KO/prize scan resolve resulting knockouts (including two prizes for an opposing LEGEND).

`darkrai-cresselia-legend.spec.ts` contains 13 behavioral regressions, including real Store payment/animation/KO sequencing, attachment routing, negative provenance controls, assembly in both directions, cancellation and empty-board cases. The Classic registry contract now requires all 30 identities and compares both LEGEND attacks against their frozen source text. These tests passed before removing the two-blocker audit.

## Verification

From `ptcg-server`:

```text
./node_modules/.bin/jasmine-ts 'src/sets/set-30th-celebration/*.spec.ts' 'src/sets/tests/thirty-celebration*.spec.ts' --random=false
86 specs, 0 failures

./node_modules/.bin/tsc --noEmit --pretty false
exit 0, no diagnostics

git diff --check
exit 0
```

The scoped suite includes the engine child's compatibility/review/image tests after its helpers arrived. The full repository suite was not rerun here; the parent-provided unrelated baseline is not a success claim for this change.

The LEGEND escalation adds local 30C files and the specifically authorized opt-in damage-only KO hook in engine attack/check/game effects. Root integration and unrelated existing-card image corrections are parent-owned. This implementer made no compiled output, commit, push, publishing or deployment. Source caches and diagnostic/runtime snapshots were written under `/Users/jerrytrosclair/.hermes/profiles/sgremspec/cache/scratch`, never the system TMPDIR.

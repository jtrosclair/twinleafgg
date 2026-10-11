# Chaos Rising / 30C implementation handoff

## Status: coverage complete; deployment approved with known limitations

Jerry explicitly authorized deployment after accepting the later-turn Mew/Drednaw defensive Ability leak for PrizeMap's one-turn simulations. Other ownership acceptance failures remain documented below. Baseline: `52fce8002`; source and compiled artifacts are released together on `production`.

## Verified published-print coverage

| Checklist | Covered |
| --- | --- |
| Chaos Rising English numbered prints | 122/122 |
| 30C English numbered prints | 158/158 |
| 30C Classic Collection | 30/30 |
| 30C R/G/B Mew prints | 3/3 |

Chaos Rising now has 123 registrations (39 additions), preserving its existing alias. 30C has 202 registrations, preserving imported JP/Energy identities alongside English additions. Counts are registrations, not an assertion that every possible interaction has been tested.

Classes and set indexes are wired into the compiled production registry. Full English image keys are present for target registrations. Basic Energy retains canonical M6a identities and uses separately verified MEE artwork. Source fixtures, English manifest and detailed 30C coverage are under `src/sets/set-30th-celebration/`.

Scoped mechanics corrections include Chaos Rising Cinccino ex / Mega Greninja ex / Krookodile ex; 30C printed stats, Pikachu attacks, coin/Energy handling, Yveltal and Snorlax timing; faithful Darkrai & Cresselia LEGEND assembly, payment, counter movement, two-prize rule and attack-damage-only Lost Zone KO routing of all attachments.

## Final execution

- `npm run compile`: PASS (both TypeScript targets and postcompile).
- Target card/registry/image and first engine review regression suites: **176 specs, 0 failures**.
- Same scope with copied-handler architectural acceptance: **188 specs, 3 failures**. These three failures reproduce the unresolved source-passive leakage below.
- `npm test -- --random=false`: **603 specs, 42 failures**. Programmatic baseline comparison finds all 38 baseline failures still present, three new copy-ownership acceptance failures, and one additional reconnection cleanup-logging assertion. Do not describe this as a green full suite or claim the additional logger failure was in the original baseline.
- Compiled inventory: **13,242 original cards checked, zero drift** in existing fullName, set, setNumber, name or usSetNumber; **13,483 total registered cards**.
- All target registrations resolve image-cache keys; **zero missing image keys**.
- `git diff --check`: PASS.

## Known copied-handler issue; later-turn defense deferred for PrizeMap

Jerry clarified that PrizeMap runs one-turn simulations and accepts deferring the Mew/Drednaw incoming-damage leak because it requires a later opposing attack. Retain its regression evidence, but do not treat that particular scenario as a blocker for the stated one-turn use case. This is not a universal copied-handler fix: the synthetic initial-AttackEffect ownership regression remains unresolved. No deployment approval was given by accepting the limitation.

Mew's copied attack delegation can inherit unguarded passive Ability branches from its source. Actual Drednaw SCR reproduction: copied Hard Crunch deals its correct 80, but a later incoming 200-damage attack deals 0 instead of 200 because Impervious Shell leaked. Acceptance fixtures also show marker-gating and initial-AttackEffect filtering cannot establish ownership.

The bounded implementation retry repaired cross-game session pruning, source Ability cost reductions, copied Bench-attacker selection, and cancelled-Stadium turn allowance. The Architect rejected scratch experiments that either broke copied Harden or retained passive leakage. No experimental workaround was installed.

The remaining general fix requires separate attack-owned handlers and deferred listeners plus migration of copyable legacy sources. A source-monolith fallback leaks; omitting fallback silently loses allowed attack effects. This release is approved for the stated one-turn usage with the known limitation, not a universal copied-handler acceptance PASS. See `COPIED_ATTACK_HANDLER_OWNERSHIP.txt` and permanent RED/control tests in `src/sets/tests/copied-handler-ownership.spec.ts`.

## Evidence

Active profile scratch contains:
- `twinleaf-final-audit.json`, `twinleaf-final-inventory.json`.
- `30c-engine-review-repair-evidence.json`.
- `copy-ownership-architecture-evidence.json`.
- Final full-suite log: `/Users/jerrytrosclair/.hermes/profiles/sgremspec/cache/terminal-output/out-1791658480-21805-b820.log`.

Next technical owner: Architect/engine maintainer for explicit copied-attack handler ownership migration and independent acceptance review. Deployment remains an explicit approval gate after functional acceptance.

# Simisage PAR investigation — deferred, nonshipping

**Do not integrate or register this candidate.** It requires an audited intrinsic-power query migration first. The five failed requirements are deliberately preserved as failed assertions; they have not been skipped or converted into expectations of incorrect behavior.

The isolated card implements Monkey Trio separately from attack-owned Arm Thrust Needle protection. Its 27 focused tests pass for direct and real copied attacks, source ownership, exact-name cost reduction, suppression, marker expiry, switching, serializer/checkpoint restoration, reset, Tool exclusion, and damage-versus-counter distinctions. All four recorded legal puzzle solutions still win, twice each. These eight replays are compatibility smoke evidence, not a saved-state/action-corpus audit.

The shared query blockers are:

- Galarian Weezing and Iron Thorns remove Abilities in their text but only reject Ability use; they do not update effective-power queries.
- Aerodactyl VSTAR's actual Ancient Star attack grants an Ability that its query handler never reports.
- Ordinary usable-power queries alias the Pokémon's powers array; Tool Abilities can contaminate later intrinsic queries.
- Tool-provided permission to use an Ability does not mean the Pokémon itself has that Ability.
- A single fan-out pass is order-dependent: Garbotoxin can filter first and Unown VSTAR can append Star Cipher afterward.

The real four-action repro in `aerodactyl-live-red.cjs` uses Arm Thrust Needle → Ancient Star → Arm Thrust Needle → Lost Dive. Weakness Guard Energy legally keeps Aerodactyl alive through the two Simisage attacks without changing printed stats. Lost Dive incorrectly knocks out protected Simisage. Its final assertion intentionally fails, and the exact trace/result is retained in `aerodactyl-live-red.json`.

The official [Simisage text](https://asia.pokemon-card.com/hk-en/card-search/detail/10682/) and [Pokémon Q&A](https://asia.pokemon-card.com/sg/rules/search/?keyword=Vulpix) support the distinction: an otherwise Ability-less Regidrago V can damage protected Alolan Vulpix VSTAR while using Forest Seal Stone's Tool Ability.

`candidate/` contains exact research source copies with `.fixture.ts` suffixes. They are outside the simulator source/build paths. `baseline/` preserves the exact preimages of the existing runtime files changed by this experiment. `candidate-manifest.json` and `verification-results.json` are unmodified original reports; their temporary paths refer to the frozen scratch at `/private/tmp/prizemap-simisage-par-investigation`. `preservation-manifest.json` maps all retained evidence to original paths and SHA-256 values. `baseline-source-inventory.json` records the complete source closure; it does not bundle all those source files. The original scratch checksum file is historical; `SHA256SUMS` verifies the durable copies here.

To repeat the original run, use the retained isolated scratch and its dependency symlinks:

```sh
cd /private/tmp/prizemap-simisage-par-investigation
node ptcg-server/node_modules/typescript/bin/tsc -p ptcg-server/tsconfig.simisage.json
node run-focused.cjs green
node run-focused.cjs red
node aerodactyl-live-red.cjs
```

The last two commands intentionally fail on the preserved blockers. If reconstructing a new scratch later, first obtain a baseline matching the manifest/inventory, restore each candidate `.fixture.ts` to its original `.ts` path there, copy `tsconfig.simisage.fixture.json` to the scratch server as `tsconfig.simisage.json`, compile the client entry and both specs, and mirror only `.ts`/`.json` source files into `.simisage-test` for dynamic test-helper registration. Do not overlay these files onto the shared runtime. The CJS runners belong at that reconstructed scratch root.

Next work should isolate queried arrays, define a distinct intrinsic-Ability query, collect printed/inherited/genuinely gained powers before applying removal, then migrate removal adapters with ownership, immunity and suppression controls. Only after that contract is reliable should this card be reconsidered against the then-current source and full saved-state/action corpus. General stale slot reuse and broader movement repairs remain outside this investigation.

The repository ignores `*.md` and `*.log`. This README therefore needs explicit force-add when committing. Logs are retained verbatim as `logs/*.log.txt`, which are not ignored. No ignore rules were changed.

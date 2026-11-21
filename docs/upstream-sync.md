# Upstream Twinleaf sync record

`upstream-sync-ledger.json` records each commit observed after the previous
upstream tracking point, including partial ports and deferred work. The latest
observed SHA is **not** an applied watermark: this fork has deliberately
different card paths, local print aliases, engine behavior and UI. Never replace
the simulator's source with upstream wholesale or assume a merge is safe.

For a future sync:

1. Fetch `upstream`, then run `node tools/upstream-sync-ledger.cjs refresh`.
   `status` reports commits not yet recorded without modifying the ledger.
   `refresh` also downloads the latest static image index, preserving local
   legacy aliases, and refreshes the Japanese counterpart mappings for the
   indexed English sets. Commit both image JSON files with the card batch. Network or malformed
   data errors stop the refresh without replacing the existing files.
   `npm run sync:images` runs that step alone; append `-- --all` to recheck every
   Japanese print listing. No image-index requests are made during gameplay.
   The package build rejects newly added cards without scans. The committed
   `known-missing-card-images.json` only exempts existing unavailable scans;
   add an exception deliberately when a new printing genuinely has no scan.
2. Review unreviewed or partial entries and record the exact files and scope of
   any port. Statuses are `unreviewed`, `partial`, `applied`, `already-present`,
   `deferred`, or `not-applicable`; use `partial` when only part of a commit was
   applied. Preserve full upstream SHAs and original subjects.
3. Test each batch on an isolated copy of the actual working source, including
   uncommitted changes. Preserve all existing card names and print variants;
   check card artwork mappings and test changed effects through the engine.
4. Compare saved-state validation against the deployed engine in a read-only
   transaction, replay recorded puzzle solutions, and run client and card/engine
   tests. Investigate baseline failures; do not claim exhaustive gameplay
   coverage. Record results and unresolved limitations below or in the ledger.
5. Carry only reviewed files into the working checkout after checking that their
   original bytes have not changed; never overwrite unrelated work. A source
   port is not a deployment. When a release is explicitly requested, use the
   guarded simulator deployment process, which also updates the web engine and
   featured-art catalogue.

Card scans support the native app's English, Spanish, French, Italian and
Japanese preferences. European languages share the English print identity;
Japanese uses a verified equivalent printing from the card's JP print list
(its illustration can differ). If no verified counterpart exists, or a
localized scan fails, the simulator uses the English scan. The native puzzle
and draft WebViews must allow `ja` when injecting `cardLanguage`; that native
bridge change ships with the next app build. The committed Japanese table is
bundled alongside the normal metadata, rather than fetched during setup.

The first trial against upstream `837aebeb5` is documented at
`/private/tmp/twinleaf-upstream-trial.yXnwhx/TRIAL-README.md`. It compared 530
saved Twinleaf states and replayed four solutions twice. Six M7 cards were
tested only in that scratch trial; their images were absent from the current
and published image maps, so they were not automatically considered applied.
Scratch paths are temporary; durable decisions belong in the JSON ledger.

The first working-copy sync on 2026-11-09 ports twelve artwork-backed cards
and seven upstream logic changes; the per-commit ledger records exact scope. The
final working source comparison against the deployed engine loaded all 530
applicable saved Twinleaf snapshots and preserved every serialized state and
card name. Four states have only the deliberate Gwynn M5 display-text change.
Of 667 database rows, 134 were non-Twinleaf formats, two lacked a fragment,
and one already failed decoding. The Escape Board candidate independently
preserved all 530 states against the combined baseline and replayed the four
recorded wins. The simulator API suite passed 6/6. No release was deployed.
The final 57-file card/engine suite has 458 passing tests and the same two
unresolved unguarded copied-handler ownership failures described below.

The follow-up batch adds Pansage PAR and Blissey SVI, ports Dragonite UNM's
Hurricane Charge and Arboliva ex DRI's attack damage fixes, and adds guards
for Kingambit SVI and Radiant Hawlucha ASR. Simisage PAR remains deferred:
the fork's existing Ability checks do not consistently distinguish an Ability
being removed from being unusable. A strict comparison of all 530 saved
Twinleaf states against the prior working source reported zero differences.
The final combined follow-up passed both browser builds and replayed all four
recorded solutions to a win. Its full 62-file card/engine suite reported 481
passing and the same two unlabelled copied-handler ownership failures; those
failures have not been skipped or redefined. No release was deployed.
An additional verified batch adds Hop's Phantump ASC with corrected
self-protection targeting. Its four real-engine tests, both browser builds,
four recorded wins and exact 530-state comparison passed. Hop's Trevenant is
deferred because its effect requires tracking the identity of a knocked-out
Hop's Pokémon, which the current snapshot records only as a boolean.
The final combined 63-file card/engine suite reported 485 passing and the same
two unresolved copied-handler ownership failures; the simulator API suite
passed 6/6. No release was deployed.
The subsequent batch fixed the shared self-protection target used by Flittle
SSP, Charcadet PAR and other cards: a defending Pokémon's protection could
incorrectly stop the attacker protecting itself. Real-engine regression tests
reproduced the bug and verify heads, tails, expiry and protected defenders.
It also ports Strange Timepiece's evolved-Psychic playable-card check while
retaining this fork's existing devolution-count prompt and scrambled-stack
support. Stakataka UNB and its two SMP printings were added, including
suppression, prize threshold, deck discard, and Prism Star routing tests.
Redeemable Ticket now puts old prizes at the bottom and draws replacement
prizes from the top of the deck, keeping them face down. A 530-state
comparison against the preceding source was unchanged. The combined 66-file
card/engine suite reported 510 passing tests and the same two ownership
failures; both browser builds passed and four recorded puzzle solutions
replayed to wins.

The latest continuation also adds Noibat ASC, Okidogi ASC and Heatmor WHT;
corrects Star Perfume's dual-type search and Durant SIT's search/shuffle
ordering; and fixes Antique Shield Fossil's in-play recognition, Lost City
routing and post-Weakness damage reduction. Combined source preserved all 530
comparable saved states and the 72-file card/engine suite reports 575 passing
and the same two unlabelled ownership failures. Four recorded solutions also
replayed to wins against the current combined browser build. The root and frontend test
commands now regenerate the card catalogue before running, so adding cards
does not leave them testing against stale generated metadata; the root
`npm test` and simulator API suite passed on the combined source.

The next batch adds Poochyena, Noivern and Drampa ASC, fixes Rosa's
Encouragement's optional attachment and blocked-target enforcement, and
reworks Forest of Vitality to check each prospective evolution without
rewriting other Pokémon's played turns. Forest, Power Plant and Path to the
Peak use an upstream-compatible Stadium-effect probe, including Wicked Wind
and the now-registered Lunatone OBF's New Moon; other legacy Stadium effects
do not yet opt in to this probe. Mightyena ASC
was subsequently ported with original-defender tracking for direct and copied
attacks; focused tests cover a damage-triggered switch, attack-effect immunity,
and lethal damage with and without a Bench. The Galarian Zigzagoon, Linoone
and Obstagoon ASC line was also added. Latios-GX's Clear Vision restriction
now remains in force after its source or a copied attacker leaves play.

An active copied-attack session now has an optional snapshot checkpoint, so
its delayed effects survive save, native reset and undo. The checkpoint
preserves selected attack identity across reprints and duplicate attack names;
card callbacks remain executable locally and are not serialized. Older
snapshots without a checkpoint retain their existing behavior: if they contain
only a copied marker, the source cannot safely be reconstructed. These
changes do not resolve the two unlabelled ownership tests below. The combined
source preserved all 530 comparable saved states; the 76-file card/engine
suite reports 619 passing and the same two ownership failures. The simulator
API suite passed 6/6, and four recorded puzzle solutions replayed to wins.
The root `npm test` run passed, including 188 frontend service specs.

The following batch ported Power Plant and Path to the Peak Ability-lock
updates, registered Lunatone OBF, added Galarian Zigzagoon/Linoone/Obstagoon
ASC and Mightyena ASC, and fixed Latios-GX Clear Vision's persistent player
restriction. Mightyena's original defender is retained through direct and
copied attacks; twelve focused tests include damage-triggered replacement,
Knock Outs, prize awards and the opponent-last-attack path. On the combined
source, 530 comparable saved states remained identical, four recorded puzzles
replayed to wins, the simulator API suite passed 6/6, and root `npm test`
passed. The 81-file card/engine suite reports 665 passing and the same two
unlabelled ownership failures.

The Stadium change was also checked in isolated desktop Node benchmarks with
identical build configurations. Warm real-puzzle initialization samples showed
no clear material regression; a full synthetic Path board added roughly
0.8 microseconds per Ability probe. These short, noisy samples do not measure
mobile WebView performance. Solrock OBF 93 remains unimplemented; New Moon
works with registered Solrock printings, including PGO. Galarian Obstagoon's
discard now selects attached Energy cards even when they provide no Energy,
including Pokémon attached as Energy. The shared discard prefab used by other
cards still needs separate review for that case.

The next ASC batch adds Pawniard, Bisharp and Kingambit, with 14 focused
real-engine cases, followed by Carbink ASC with 12 focused type and damage
cases. Conflicting type-replacement ordering beyond its tested additive
interaction remains unproven. Obstagoon's discard also has regression coverage for
Energy cards that provide no Energy and Pokémon attached as Energy. Copied
Aggron UNB Extra-Tight Press now opts into an explicitly attack-owned
after-damage callback, restored from the card definition on snapshot load;
eight focused cases cover copying, unrelated Ability isolation, reprints,
Knock Outs, expiration and restoration. This opt-in mechanism fixes Aggron,
but does not automatically identify attack-owned code in legacy handlers.
The combined candidate preserved all 530 comparable saved states, replayed
four recorded puzzle solutions to wins, and passed root `npm test` and the six API tests. Its
84-file card/engine run reported 701 passing and the same two unlabelled
ownership failures; no tests were skipped. These saved state checks do not
simulate every action.

Mega Rayquaza ex M6 remains deferred despite passing isolated card tests: its
shuffle of a deck subset must be recorded through the arbiter for deterministic
bot modes and action replay. The candidate's mixed-type Energy accounting also
miscounts a real type override: Typhlosion LOT can make Rapid Strike Energy
provide Fire even though its printed blend has no Fire.

The subsequent batch adds Team Rocket’s Exeggcute, Vullaby and Pangoro ASC;
their 12 focused cases include a copied attack and damaged Benched Pokémon.
Heracross LOT 18 is registered separately while the historical Heracross BRS
12 identity is preserved for saved puzzles. Its five cases cover registry
identity and its Bench condition; the API suite checks both print identities.
ShuffleDeckPrompt now sorts indexes numerically during validation, so valid
permutations of 11 or more cards are accepted; malformed permutations remain
rejected. On the combined source, 530 comparable saved states matched, four
recorded puzzle solutions won, root `npm test` and seven API tests passed, and
the 87-file card and engine suite had 720 passing and the same two ownership
failures.

The next ASC batch adds Team Rocket’s Diglett and Zangoose ex. Thirteen
focused tests cover attacks, short decks, recoil and copying. Diglett captures
the originating attack before asynchronous coin flips, so a copied attack's
later card movement is not attributed to the copycat's printed attack. Both
browser builds, 530 saved-state comparisons and four recorded puzzle wins pass
in the combined source, as do root `npm test` and all seven API tests. A
card-local Bastiodon M5 fix also prevents its Ability-only handler from running
as Mew when Hammer In is copied; six focused cases cover actual attacks,
suppression, reprints, a subclass override and snapshot restoration. The
90-file engine suite has 741 passing and the same two ownership failures.

The next local batch adds Hop’s Pincurchin ex ASC, including Ability
suppression and protection checks, and fixes three copied-attack crashes:
Zarude M5, M Scizor-EX BKP and Weavile UPR called source-specific methods on
the copycat. The helpers are now independent of the copycat's class. Isolated
tests covered direct attacks, Mew copies, a reprint, subclass overrides,
optional choices and Knock Outs; 530 saved states matched and four recorded
puzzles won. Combined verification also passed root `npm test` and all seven
API tests; the 94-file engine suite has 815 passing and the same two ownership
failures.

The Diamond & Pearl batch adds Shinx, Starly and Turtwig, correcting their
printed +10 Weakness from upstream. Ten focused tests cover copied Spark and
Bench protection; both browser builds passed in isolation. Combined checks
matched 530 saved states, replayed four wins, passed root `npm test` and all
seven API tests, and reported 825 engine tests passing with the same two
ownership failures. Other cards from that upstream commit remain to be reviewed.
The following batch adds Grotle, Torterra and Luxio DP. Grotle's Synthesis
attaches a selected Grass Energy from the deck and validates its target before
shuffling. Twenty focused tests, both browser builds, 530 saved-state
comparisons and four recorded puzzle wins passed in isolation. Energy Search
Pro SSP now reveals selected Energy before moving it and then shuffles; eleven
focused tests cover Parasect, prevented or redirected movement and the simulator
client. Combined verification matched 530 saved states and four recorded puzzle
wins; root `npm test` and seven API tests passed, and the engine suite had 887
passing with the same two unlabelled ownership failures.
Spiritomb UPR now requires distinct available Supporters from the public
discard pile, and Pokémon Tower and Parasect recognize the actual attack when
the effect is copied. Parasect's status check applies to Parasect itself, not
an unrelated Active Pokémon. Thirty-one focused tests, both browser builds,
530 saved-state comparisons and four recorded puzzle wins passed in isolation.
Combined verification matched 530 saved states and four recorded wins, passed
root `npm test` and seven API tests, and reported 918 card tests passing with
the same two ownership failures.
The next batch adds Machop, Machoke, Machamp, Riolu, Lucario and Ponyta DP;
their printed Weakness, damage ordering and Bench targeting were checked.
Combee ASR, Cyndaquil ASR and Emolga SIT now reveal before moving searched
cards, then shuffle, including copied attacks. In the combined source the
104-file card suite reports 985 passing and the same two ownership failures;
root `npm test` and seven API tests pass. All 530 comparable saved states,
initial attack/retreat affordability, copied-attack choices and playable hand
hints matched the earlier local baseline, and four recorded solutions won.

The upstream evolution staging change was not copied directly: its early move
could leave a rejected evolution on the board. The local source now preflights
nine existing evolution restrictions against an isolated clone, tracks whether
the card came from hand or deck, and emits a separate event after a successful
evolution. Charizard ex OBF uses that event to check Ability suppression after
evolution; Rare Candy counts as hand-origin, while deck effects do not. The
combined source passed 41 focused cases, preserved 530 comparable saved
states, replayed four recorded solutions to wins, and passed root `npm test`
and all seven API tests. The 90-file engine suite had 780 passing and the same
two ownership failures.

The mixed-Energy audit also found existing affordability bugs: one Unit Energy
can pay two typed symbols, Temple of Sinnoh can fail to suppress its printed
blend, and Rapid Strike Energy can fail to pay two Colorless. A scratch
one-to-one matcher and explicit blend-ownership model are in
`/private/tmp/prizemap-energy-round4` (see `manifest.json`). In isolation it
preserved all 530 serialized snapshots and matched current attack, retreat and
copy-choice affordability at those positions; two deserialized active states
reflect the intentional Rapid Strike unit-count correction. Do not port the
prototype blindly: it changes shared cost and conversion logic across 25 files,
and duplicate versus independently additive Energy mappings and legacy
conditional blend provenance are not fully distinguishable yet. Future
conditional Energy definitions need an explicit active-blend contract.
The follow-up `/private/tmp/prizemap-energy-round5/ROUND5-NOTES.md` records
additional real-card counterexamples: Crystal Beach with Typhlosion and Rapid
Strike Energy changes behavior on repeated reads, and Aqua Energy can fail the
second attack of Team Aqua’s Walrein. Energy-selection prompts also discard
individual map entries instead of preserving physical-card provenance. These
must be addressed together before the shared matcher is safe to port.

Independent review found earlier candidate regressions involving Regenerative
Energy, hand-only blockers and a Palafin prompt left by rejected preflight;
the integrated candidate covers these with source-aware rules and isolated
preflight tests. Other on-evolution Abilities, including Drizzile SSH, still use
the legacy pre-move event and need their own migration and suppression checks.
The clone shares executable function references and cannot guarantee isolation
for arbitrary future card closures. Ordinary hand evolution retains the
existing broad player-marker cleanup. Desktop clone-only timings are documented
in `/private/tmp/prizemap-evolve-preflight`; mobile performance is unmeasured.

## Local regression fixes, 2026-11-09

The isolated card runner now exposes its saved-puzzle fixtures. Drednaw SCR
checks Ability permission before applying Impervious Shell; Duraludon VMAX EVS
checks the attacker's attached Special Energy and Ability permission for
Skyscraper. These fixes have real-store regression tests and were tested along
with the first two card batches and five logic changes against 530 saved
Twinleaf snapshots and four recorded winning solutions. The only deserialized
corpus difference was the intentional Gwynn text correction; all serialized
states and card identities matched.
The follow-up sync also corrected Kingambit SVI's Leadership: it checks Ability
permission and only boosts damage to the opponent's Active Pokémon. Its five
real-engine tests, 530-state differential and four recorded wins passed.
Radiant Hawlucha ASR's Big Match now also respects Ability suppression; four
focused tests cover normal attacks and copied attacks. The combined Kingambit
and Hawlucha candidates passed 530-state comparison and four recorded wins.
The next batch fixes Volcanion-EX's resolved Steam Up boost: player-scoped
marker effects persist across source movement and saved-state restoration,
expire when the owner's turn ends, and apply before defensive damage effects
only to the opponent's Active. A dedicated suite tests the copied-attack,
Lost Zone, ordering and type interactions. The existing per-source marker
deduplication still does not model a second activation after the same card
leaves play and re-enters in the same turn; changing it requires a reliable
once-per-play lifecycle and remains open.
Giratina LV.X PL's Darkness Lost now reaches its attack branch, damages the
Active through the usual damage pipeline, and sends only damage-caused Knock
Outs to the Lost Zone. Existing serialized legacy markers retain their old
handling. Eighteen focused tests include direct and copied attacks, prevention,
Weakness, Resistance, attached cards and restored legacy markers. Both browser
builds passed in isolation. Combined verification matched 530 saved states,
replayed four wins, passed root `npm test` and all seven API tests, and reported
843 engine tests passing with the same two ownership failures.
The final combined working source was also rebuilt in isolation, compared
byte-for-byte against the working source, and replayed four recorded winning
solutions twice each.

The broader baseline had six failures. The fixture and Drednaw fixes resolve
four of them. Two intentionally unguarded synthetic copied-handler ownership
cases remain failing: the current generic delegation mechanism cannot identify
which of two identical unlabelled branches belongs to an Ability. Treat this as
a real architectural limitation, not a passing test. A durable solution needs
explicit ownership boundaries and careful migration of affected card handlers;
the scratch prototype `/private/tmp/prizemap-copy-fix` is experimental and must
not be copied into a release without full compatibility review.
An attack callback for Onix Harden made the mixed ownership fixture pass in a
separate experiment, but dropped a legitimate subclass's attack override. It
was not integrated; a safe migration must define and verify callback ownership
for inherited card handlers as well as ordinary reprints.
An opt-in attack-owned reducer is now available for individually reviewed cards.
It falls back to the legacy handler when an unannotated subclass overrides its
reducer. Onix EVO and Ursaring UF have been migrated; Ursaring's copied Rock
Smash and Drag Off previously lost their coin bonus and switch choice. The
unchanged unannotated ownership tests still fail, and this does not make other
legacy mixed handlers safe automatically. Future migrations must audit delayed
closures that refer to temporarily substituted attacks or marker constants.
Annihilape DRI has also been migrated: Impact Blow's next-turn restriction no
longer disappears when the Ability is blocked or the attack is copied. Five
focused tests and both browser builds passed in isolation; combined verification
matched 530 saved states and four recorded wins, passed root `npm test` and
seven API tests, and reported 985 engine tests passing with the same two
unlabelled ownership failures.
Bunnelby PRC's copied Rototiller now keeps its attack provenance through the
discard selection, so Parasect can block the effect. Five focused direct and
copied cases and both browser builds passed in isolation; the same combined
checks matched 530 saved states and four recorded wins, with 985 engine tests
passing and the same two unlabelled ownership failures.
Pikachu ex SSP, Dragapult ex TWM, Greninja ex TWM, Teal Mask Ogerpon ex TWM
and Charizard ex OBF now keep their Tera/Ability effects on the actual card
when their attacks are copied. Thirty-two focused tests cover original cards,
registered reprints, Mew, suppression and restored checkpoints; both browser
builds and four recorded solutions passed in isolation.
Tsareena ex PAR, Garchomp ex PAR, Skeledirge ex PAR and Dragonite ex OBF
now use the same attack-only ownership boundary. Eighteen focused cases
cover Mew copying, original Bench protection, registered alternate prints,
attack choices and Skeledirge’s own Ability and turn cleanup; both browser
builds passed in isolation. Combined verification matched 530 saved states,
3,457 first actions and four recorded wins; root tests and the production build
passed, with 1,290 card tests passing and the same two ownership failures.
Palossand ex, Tatsugiri ex, Ceruledge ex and Sylveon ex SSP, Tyranitar ex OBF
and Gyarados ex SVI now separate copied attacks from Tera Bench protection.
Twenty-four focused tests cover base and registered alternate prints, copied
attacks and Sylveon Magical Charm reduction and expiry; the original source
failed ten cases. Both browser builds, 530 saved states and four recorded
solutions passed in isolation. Combined verification matched 530 saved states
and 3,457 first actions; four recorded puzzles won; root tests, seven API tests
and the production build passed. The 128-file card suite had 1,553 passing and
the same two unlabelled ownership failures. A follow-up preserves actual Sylveon's
Magical Charm reduction and expiry when its source enters the Lost Zone, including
serialized checkpoints, without double-applying the reduction in ordinary zones.
The separate unregistered PRE 41 implementation was not changed. Copied Magical Charm now retains its reduction when Mew switches or leaves play,
including restored checkpoints and three copy implementations. Checkpoints
created before this fix with Mew-sourced markers retain the prior limitation.
Angelite still needs separate work for its player-wide lock and source retention.
Goldeen DP uses a scoped post-damage lifecycle so recoil follows outgoing
damage and remains attached to the original attacker across switching. Mew TM
Lost Link also delegates attacks from either Lost Zone. Twenty-nine focused
cases, an independent manual-copy audit, both browser builds, seven API tests,
530 saved-state comparisons, 3,457 matching first-action attempts (2,572
successful in both builds) and four recorded wins passed on an overlay
byte-identical to the integrated source.
The overlay card suite had 1,172 passing and the same two ownership failures.
Legacy manual-copy effects drain at the enclosing attack's completion; pending
prompt continuations are not serializable in the existing simulator.
Wobbuffet LOT and Slowbro DEX now separate their attacks from their Ability
handlers: copied Knock Away retains its coin flip without inheriting Shady Tail,
and Lazy Headbutt applies self-Sleep when Airhead is suppressed or copied.
Twenty-eight focused tests and both browser builds passed in isolation.
Combined verification matched 530 saved states, 1,860 first Item/Supporter
action attempts and four recorded wins; root `npm test` and seven API tests
passed, and the engine suite has 1,050 passing with the same two ownership
failures.
Thirteen explicit-contract tests, both browser builds, 530 saved-state
comparisons and four recorded wins passed in isolation. Combined verification
matched 530 saved states and four recorded wins, passed root `npm test` and
seven API tests, and reported 887 passing with the same two legacy failures.

On 2026-11-10 an action rollback audit found rejected synchronous actions can
leave newly queued wait callbacks. Simply restoring the prior callback queue is
unsafe: callbacks may have captured the abandoned state or already executed
before a later failure. A pending payment prompt can also coexist with sandbox
edits, making a one-time discard preflight stale. Holon Farmer and the queue-only
prototype remain deferred until action/prompt transactions have explicit
continuation and rollback semantics. A Prism Star discarded as a cost may be
sent to the Lost Zone and still count as discarded.

The same audit found mirror-only Energy attachments are accepted by the
snapshot validator but absent from all 530 loaded saved states checked. Existing
conditional Special Energy handlers often inspect the physical card stack, so
simply delivering additional events to mirror-only entries is not a complete
compatibility fix. Magmar and Quilava MT remain deferred pending a sound solution.

The reduced Energy-discard fix routes Prism Star cards to their owner’s Lost
Zone after existing DiscardCardsEffect interception. Nitro Fire Energy now removes
its physical attachment as well as its mirror when returning to hand. Eight
focused cases pass against the candidate (six failed against the previous code),
including Carbink, Burning Energy and separate physical-card identity. Both
browser builds and 530 saved states passed in isolation. The combined first-action
sweep matched 3,457 attempts, and four recorded solutions won. Mirror-only Energy
remains a pre-existing limitation and Magmar/Quilava MT are still deferred.

A read-only 2026-11-10 snapshot audit found 38 of 530 applicable states
(19 active) containing at least one card object in more than one physical zone;
normal Energy mirrors were excluded. None of those duplicate references were
Nitro Fire Energy or Prism Star cards. Preserve these accepted payloads when
changing card movement; the audit does not establish correctness of every
duplicate-zone game action.

For the saved-state comparison, build the API bundle from the isolated
candidate using `node simulator-api/build.cjs`, then run from this checkout:

```
node tools/compare-puzzle-corpus.cjs /path/to/deployed-service.mjs /path/to/candidate/simulator-api/.build/worker.mjs /path/to/pokepuzzles-web
```

The web checkout provides its configured database connection and transport
decoder. The comparison uses a read-only transaction and prints aggregate
counts only. It checks persisted Twinleaf snapshots; it does not simulate every
possible action or validate external-format puzzles. The program fails if a
previously valid snapshot becomes invalid or its serialized/deserialized state
changes. No database payloads are written to disk.

For a stronger initial-action comparison, run the reusable read-only harness
against two source trees and the web checkout:

```
node tools/compare-puzzle-actions.cjs /path/to/baseline /path/to/candidate /path/to/pokepuzzles-web --min-comparable=530 --min-actions=682
```

By default it replays playable Items and Supporters and printed Active attacks in memory,
with deterministic random and clock values. It compares serializable state
except logs and prompts, then compares pending human prompt details separately; only
aggregate results, card names and structural difference paths are printed.
The minimums should be updated when the corpus changes. `--mode=attacks`,
`--mode=trainers` or `--mode=abilities` selects one category; `--mode=all`
includes printed in-play Abilities, and `--limit=N` provides an ID-ordered
sample. Results cover only the first action: they do not resolve human prompts,
exercise Pokémon or Energy plays, include effects granting extra attacks or
Abilities, or test externally supplied win-condition overrides. Run
identical-source controls when changing the harness itself.

On 2026-11-09 a separate read-only comparison against the earlier local source
at `/private/tmp/prizemap-giratina.Xckshh` also checked both players' active
attack affordability, retreat affordability and copied-attack choices. All 530
comparable positions, including 374 active puzzles, matched; 137 rows were
outside the comparable simulator corpus. The temporary scripts are
`/private/tmp/prizemap-round7-build-affordability.cjs` and
`/private/tmp/prizemap-round7-compare-affordability.cjs`. This covers initial
positions only and does not establish equivalence for later actions.
The same source comparison also restored each snapshot and compared the
derived playable cards in both hands. All 530 comparable positions matched;
502 had at least one card in hand and 487 had at least one playable hand card.
The temporary coverage runner is
`/private/tmp/prizemap-round7-compare-playability-coverage.cjs`. These are UI
playability hints, not a simulation of all legal action sequences.

An additional read-only first-action sweep compared the current source with
`/private/tmp/prizemap-dp-round7.8qF3pY` using the actual `ClientSimulator`,
identical seeded randomness and every Item or Supporter flagged playable in
each comparable saved position. Of 1,860 attempted actions, 1,852 succeeded in
both builds and eight were rejected in both with `ACTION_IN_PROGRESS`, because
another prompt was pending. The compared phase, card-zone
membership, Active damage, prize counts and pending human prompt types matched.
The runner is
`/private/tmp/prizemap-round8-compare-action-sweep.cjs`. It does not resolve
human prompts, exercise Pokémon or Energy plays, or prove a full solution.

On the next sync pass, a similarly seeded first-attack sweep compared every
printed Active attack offered by the same 530 comparable starting positions.
All 682 attempts matched: 145 resolved in both builds and 537 were rejected
in both (532 for insufficient Energy). It compared resulting card zones,
Active and Bench damage, conditions, markers, attack restrictions, prize
counts, winner and pending human prompt types. The runner is
`/private/tmp/prizemap-round9-compare-attack-sweep.cjs`. It does not resolve
subsequent human choices or cover attacks granted only by other effects.

On 2026-11-10 eight Secret Wonders cards were ported as a group: Bagon,
Growlithe, Ivysaur, Magmar, Roselia, Shellder, Shroomish and Wartortle.
Thirty-nine focused tests, both browser builds, 530 saved-state comparisons
and four recorded puzzle solutions passed in isolation. Roselia has Fire
weakness +10 on its printed card; the historical card-dex PDF appears mistaken.

The deferred Barboach and Geodude MT attacks need true simultaneous spread.
A real-card reproduction shows Jellicent discarding the attacking Special Energy
after the Active hit, incorrectly removing Duraludon VMAX Bench protection
before a later sequential hit, including when Mew copies the attack. Simply
buffering after-damage events is insufficient: existing prevention handlers can
mutate cards, draw, deal damage, or prompt during damage placement. The future
fix must preserve a consistent board across prevention decisions and commit
damage together for direct and copied attacks. Scratch audit and reproduction:
`/private/tmp/prizemap-spread-audit-round13.md`.

Staravia DP now uses an opt-in attack retreat lock on the original defender.
Fourteen focused cases cover protection, copied attacks, Lost Zone source,
checkpoint restoration, switching, evolution and accepted versus rejected
turn expiry. Its isolated candidate matched 530 saved puzzle states.

Ownership test audit: both remaining synthetic failures use unlabelled attack
and Ability logic. One fixture mutates damage in two adjacent branches with
identical conditions but different intended ownership; runtime state contains
no distinction. Always trusting an inherited attack-only reducer fixes the
other case but breaks an existing legitimate subclass attack override. Continue
explicit ownership migration for affected real cards; do not suppress the tests
or remove the legacy fallback until those handlers have been reviewed. Scratch
audit: `/private/tmp/prizemap-ownership-audit.md`.

Combined round-13 verification (first Secret Wonders batch, Staravia, and
printed Sylveon Charm retention): 530 saved states and 3,457 initial action
attempts matched the earlier baseline; all four recorded puzzle solutions won.
Root tests, seven API tests and the production build passed. The card suite
had 1,613 passing and the same two unlabelled ownership failures. Initial
action comparisons do not cover later choices or external win conditions.

A second Secret Wonders batch adds Diglett, Electabuzz, Lickitung, Mareep,
Nidoran male, Phanpy, Venonat and Voltorb. Sixty-five focused direct/copied
attack and checkpoint tests, 530 saved states and four recorded wins passed
in isolation. Clefairy SW requires evolution timing work; Lotad SW is deferred
until its historical Energy comparison is verified.

The copied Magical Charm follow-up passed 69 focused tests, both browser
builds, 530 saved-state comparisons, 3,457 matching first actions and four
recorded wins in isolation. Old checkpoints with Mew-sourced markers are not
migrated and retain their pre-existing behavior. The copy checkpoint can be
pruned while the generic markers survive, leaving no unambiguous source identity;
see `/private/tmp/prizemap-sylveon-legacy-checkpoint-audit.md`.

Three historical rules are now optional: multiple retreats per turn, multiple
Stadium plays per turn, and same-name Stadium replacement. Omitted flags preserve
modern behavior and old snapshot shape. Twenty-seven focused tests cover full
and compact snapshots, malformed flags, Stadium and retreat actions, playable
hints, Prism Star routing and Hyperrogue; 530 saved states, 3,457 initial
actions and four recorded solutions matched in isolation. Confused retreat and
setup rules remain separate work.

Combined round-14 verification (two Secret Wonders batches, Staravia,
Sylveon retention and optional historical Stadium/retreat controls): root tests,
seven API tests and production build passed; 530 saved states and 3,457 initial
actions matched, and four recorded puzzle solutions won. The card suite had
1,741 passing and the same two unlabelled ownership failures. Existing three
SCSS budget warnings remain. No deployment was made.

Confused retreat remains deferred: upstream flips before paying and allows
unlimited retries, which does not match the reviewed historical variants. Its
naive port also clears Confusion before the asynchronous mobile drag resolves.
A variant-specific design and action/prompt lifecycle tests are needed; scratch
audit: `/private/tmp/prizemap-confused-retreat.E6Jooc/CONFUSED-RETREAT-AUDIT.md`.

A third Secret Wonders batch adds Roserade, Pinsir, Psyduck, Rattata, Shuppet
and Stantler. Sixty-one focused tests cover original-defender protection and
replacement, switching, evolution, retreat and attack locks, copies and restored
checkpoints. Browser/API builds, 530 saved states, 2,542 initial trainer/attack
actions and four recorded solutions passed in isolation. Squirtle and Raticate
are deferred because accepted mirror-only Energy attachments can bypass Rainbow
Energy conditional type. Real simulator tests show unambiguous mirror-only
Energy moves during retreat payment and attack discard; duplicate-zone cases
are still under audit.

Round-15 combined verification of the three Secret Wonders batches and the
previous engine fixes: 1,802 card tests passed with the same two unlabelled
ownership failures; root tests, seven API tests and the production build passed.
530 states and 3,457 initial actions matched; four recorded puzzle solutions won.

An opt-in query-only fix now recognizes Rainbow Energy attached solely in its
mirror when there is exactly one reference and no physical-zone reference. It
preserves the snapshot representation and leaves ambiguous references and other
Energy implementations unchanged. Twenty-four focused tests cover all 11
registered Rainbow variants, attack and retreat payment, Special Energy
overrides and compact snapshots; 530 saved states, 3,457 first actions and four
recorded wins passed in isolation. Other conditional Special Energy remains
deferred. Audit: `/private/tmp/prizemap-mirror-energy.YfKxa1/MIRROR-ENERGY-AUDIT.md`.

Angelite player-wide restriction remains deferred. The official ruling says
Genome Hacking copying Angelite does not count as using Angelite and its copied
effect fails if Angelite was used on the previous turn. A candidate covering
three Mew mechanisms failed a real Mimikyu TEU legacy Copycat case: its helper
unconditionally dispatches a nested AfterAttackEffect after a fizzled copy.
Do not integrate the scratch candidate without fixing and testing that shared
lifecycle. Scratch audit: `/private/tmp/prizemap-angelite-round14-audit.md`; official reference: https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%8B%E3%83%B3%E3%83%95%E3%82%A3%E3%82%A2EX

Round-16 combined verification, including the Rainbow query fix: 1,826 card
tests passed and the same two unlabelled ownership tests failed. Root tests,
seven API tests, production build, 530 saved-state comparisons, 3,457 initial
action comparisons and four recorded puzzle wins passed. Three existing SCSS
budget warnings remain. No deployment was made.

Passimian SSP and Victini LOT now preserve existing attack damage modifiers
when calculating damage per Basic Pokémon. Eight real-store direct/copied cases
passed; the unmodified cards each failed both bonus cases. In isolation, all
530 saved states and 3,457 initial trainer, attack and Ability actions matched.

Round-17 explicit copied-attack ownership migration covers Drednaw SCR, Bronzong
FCO, Aegislash XY 86, Regirock-EX FCO and Passimian UPR. It fixes real Lost
Link Mew incorrectly inheriting Regirock's damage-boosting Ability (110 versus
100 damage). Eighteen focused tests, both browser builds, 530 saved states,
3,457 initial actions and four recorded solutions passed in isolation. Existing
Regirock Bedrock Press marker issues remain separate; the two unannotated
synthetic ownership tests still fail.

Round-17 grouped eight-card port: Shellos East Sea and Sableye SW; Girafarig,
Kricketot, Nidoran female and Chimecho MT; Clamperl and Togepi GE. Fifty-nine
focused direct/copied tests, both browser builds, 530 saved states, 3,457 initial
actions and four recorded puzzle wins passed in isolation. Bidoof and Buizel MT
remain deferred because upstream omits their printed Berry effects; Corsola SW
needs a dual-type-aware choice prompt.

Inventory on 2026-11-10 at upstream c531dc84: 1,460 added TypeScript paths
under upstream set directories (excluding index/full-art/secret/spec files),
of which 1,342 have no same-set, same-relative-path file locally after this
batch. This is a path-based rough inventory, not an exact count of missing
registered cards: one file may contain multiple prints, and renamed files,
reprints, alternate aliases, unregistered upstream definitions and existing
local behavior require review. Recount with a set-relative mapping; do not treat
this number as an applied/unapplied commit count.

Round-17 combined verification: root tests, seven API tests, production build,
530 saved-state comparisons and 3,457 initial action comparisons passed. Four
recorded puzzle solutions won. The 139-file card suite had 1,911 passing and
the same two unannotated ownership failures; an updated 63-case historical
batch was separately recompiled and passed, adding four short-deck checks after
the full-suite snapshot. The Angelite/copy candidate remains isolated pending
final review and combined validation; see `/private/tmp/prizemap-angelite18-useattack-audit.md`.

Independent review of the isolated round-18 Angelite candidate reproduced a
new regression: migrating Kecleon PLF and Ditto VMAX SHF to the generic opponent
copy helper prevented Palkia 30C Wormhole's required after-attack switches.
Both real-card tests passed the prior source and failed the candidate. A second
global AfterAttackEffect can double-trigger observers; a properly scoped copied
attack lifecycle is needed. Reproducer and reports: `/private/tmp/ownership-palkia-copy-round18.spec.ts`,
`/private/tmp/prizemap-palkia-candidate.log`, `/private/tmp/prizemap-palkia-baseline.log`.
The candidate was not integrated.

Round-19 grouped port: Cherrim and Magnemite DP, Kricketune and Spinarak MT,
and Arbok, Cacturne, Hariyama and Delibird GE. Seventy-three direct/copied and
snapshot tests, both browser builds, 530 saved states and 3,457 initial actions
matched; four recorded solutions won using an independently resolved candidate
browser. Printed Hariyama says Palm Strike; the official historical card-dex
has a conflicting attack name.

Round-19 copied-attack ownership batch splits Milotic ex SSP, Toedscruel ex OBF,
Tangrowth TWM, Iron Crown ex TEF, Farigiraf ex TEF and Forretress ex PAL. The
Forretress change also corrects its Guard Press attack index; copied Mew no
longer inherits Tera Bench protection. Twenty-four real-engine tests, both
browser builds, 530 saved states, 3,457 initial actions and four puzzle wins
passed in isolation, with the candidate browser path verified. Unrelated legacy
Forretress marker retention after its physical source leaves remains unverified.

Regirock EX FCO Bedrock Press remains deferred in scratch. The reviewed candidate
fixes missing after-Weakness reduction on both the original and a Lost Link copy,
preserves legacy markers, and passes 15 focused cases including restored copied
checkpoints and rejected turns; 530 saved states and 3,457 first actions match.
Its behavior when a damage reaction switches the original attacker before the
post-damage self-effect has not been established, so it is not integrated. The
candidate and fixture are preserved in `docs/upstream-sync-review/`. Regi Power
also needs a seat-independent pre-damage Ability stage; the old implementation
boosts after Weakness, boosts Regirock itself and can change with traversal order.
Effective-type checks must avoid recursion on opposing Kecleon, and ambiguous
duplicate card references must retain compatible ownership behavior. Its red
fixture is preserved alongside the Bedrock fixture.

Round-19 combined verification: 2,012 card tests passed, with the same two
unannotated ownership tests failing. Root tests, seven API tests, the production
build and build attestation passed. All 530 comparable saved states and 3,457
initial actions matched; four recorded puzzle solutions won. Three existing
SCSS budget warnings remain. Nothing was deployed.

After the round-19 eight-card port, the same upstream-path inventory reports
1,334 unmatched source files. As above, this is not an exact missing-card count.

The card regression runner now removes its isolated compiled workspace after
the run while preserving the summary JSON and per-spec logs, including on
compile or test failure. Use `--keep-workspace` when the compiled files are
needed for debugging. A real passing suite and the two-failure ownership suite
verified report retention and cleanup; a tiny isolated invalid-TypeScript
project verified both normal and `--keep-workspace` compiler-failure paths.

Round-20 copied-attack ownership migration covers Erika's Dratini G1, Ninetales
HL, Mimikyu PAL, Armarouge ex PAR, Froslass ex PAR, Durant ex SSP, Feraligatr
TEF and Rabsca TEF. The unchanged baseline failed three direct copied-Ability
protection/prize regressions; all 30 focused tests passed in the candidate. Both
browser builds, 530 saved states, 3,457 initial actions and four recorded
puzzle solutions passed in isolation, with candidate browser paths verified.
The two unannotated generic ownership failures remain unresolved.

Round-20 grouped port adds Manaphy and Steelix DP; Bayleef, Dunsparce
and Murkrow MT; Donphan SW; and Feebas and Glameow GE. The candidate passed
62 focused tests plus 73 round-19 tests, both browser builds, 530 saved-state
comparisons, 3,457 initial actions and four recorded puzzle solutions in
isolation. Combined verification is recorded below.

Round-20 inventory at upstream c531dc84: 1,326 unmatched set-relative
source files after this batch. A static scan found each imported and instantiated
in an upstream set index and 1,370 explicit fullName literals across those
files, all directly instantiated in upstream set indexes. Of those definitions,
49 are in reprint files and 1,321 in one-definition files. This is not an exact
count of distinct new mechanics or a gameplay validation: prints, computed
identities and possible overlap still require review.

Round-20 combined verification: root tests, production build and attestation,
seven API tests, 530 comparable saved states and 3,457 initial actions passed;
four recorded puzzle solutions won. The full card suite reports 2,104 passing
and the same two unannotated generic ownership failures. Nothing was deployed.

Round-21 grouped port adds 16 Arceus cards: Cherubi, Electrike 63, Gastly 64,
Treecko 79, Wingull 81, Gulpin 66, Charmeleon, Grovyle 39, Bagon, Bronzor
34/54, Rapidash 47, Omanyte, Tangela 77, Graveler and Wormadam Sandy Cloak.
Ninety-one focused tests, 135 preceding-batch tests, both browser builds, 530
saved states, 3,457 initial actions and four independently resolved candidate
browser puzzle replays passed in isolation. Combined validation is recorded below.

Round-21 accepted-evolution migration covers 16 existing cards, including
Drizzile, Inteleon, Parasect and Togekiss. Their hand-origin Abilities run after
accepted evolution, and Arboliva can heal with an empty deck. The candidate
passed 103 focused tests including a real Rare Candy action and 41 existing
lifecycle cases; the unchanged baseline failed 60 focused cases. Both browser
builds, 530 saved states, 3,457 initial actions and four independently resolved
candidate-browser puzzle replays passed in isolation. Combined validation is
recorded below. Other evolution Abilities still need review.

Round-21 Delta Plus copied-attack ownership migration covers Articuno, Natu,
Dustox and Swellow ROS. Twenty-six focused cases pass; the unchanged baseline
failed eight copied extra-Prize cases, including four actual lethal attacks and
Prize selection flows. Both browser builds, 530 saved states, 3,457 initial
actions and four recorded puzzle wins passed in isolation against a frozen
pre-evolution baseline. Combined validation is recorded below.

Follow-up evolution audit identified 67 JUST_EVOLVED call sites whose hand
origin and timing need per-card review. The top-deck Energy attachment prefab
and ten card callers also need a real-engine source-zone investigation before
additional evolution cards using it can be migrated.

The round-22 Energy attachment candidate and reproducer remain isolated in
`/private/tmp/prizemap-energy22`; neither has been tested or integrated. Static
review suggests temporary top-deck sources are not handled by the hand-only
attachment reducer. Source provenance also affects many in-play observers, and
the selected card may not be in a propagated state zone while its own legality
handler needs to run. Preserve existing hand defaults and investigate these
interactions with real-engine red/green tests before porting.

Round-21 combined verification: root tests, production build and attestation,
seven API tests, 530 comparable saved states and 3,457 initial actions passed;
four recorded puzzle solutions won. The 146-file card suite reports 2,324
passing and the same two unannotated generic ownership failures. Nothing was
deployed. The corpus also skipped 137 missing, invalid, or unsupported inputs;
the action comparisons and four recorded solutions cannot establish every
possible later puzzle sequence.

Round-22 Energy source baseline reproduction: a real Electric Generator and a
real Metang Metal Maker each place a selected Energy into the Pokémon energy
list while leaving it in the deck and absent from the Pokémon cards list. A
prevented attachment stayed in the deck. Two of three focused cases failed on
the unchanged baseline; report
`/var/folders/j1/v2wg0qh93kjb4_cmn27201p00000gn/T/twinleaf-card-regressions-0igjUL/results.json`.
The candidate remains unintegrated pending source provenance, selected-card
legality, hand-only observer review and candidate red/green validation. Audit:
`/private/tmp/prizemap-energy22/AUDIT.md`.

Round-22 grouped port adds 24 Supreme Victors cards: Bidoof, Buizel, Chimchar,
Combee, Corphish, Croagunk, Doduo, Drifloon, Geodude, Kricketot, Magikarp,
Magnemite, Mankey, Meditite, Meowth, Pikachu, Piplup, Sandshrew, Seel, Shinx,
Shroomish, Starly, Surskit and Turtwig. The candidate passed 127 focused tests
and 153 earlier cases, both browser builds, 530 saved states, 3,457 initial
actions and four candidate-browser puzzle solutions. Combined verification is
recorded below.

Round-22 Energy candidate expansion: an identical 21-case real-engine suite
reports 7 passing/14 failing on the baseline and 19 passing/2 failing on the
candidate. The unresolved failures are partial attachment when a later selected
Energy is rejected and Aurora Energy attaching before its discard-payment
prompt completes. The candidate spans source provenance, card legality and
hand-only observers; it remains scratch-only and must not be integrated until
transaction and prompt continuation semantics are resolved. Logs:
`/private/tmp/prizemap-energy22-baseline-final.log` and
`/private/tmp/prizemap-energy22-candidate-final2.log`.

Round-22 copied-attack ownership migration covers Giratina-EX AOR, Wobbuffet
SS, Team Rocket’s Articuno DRI, Scovillain ex SSP, and Groudon ex/Kyogre ex
HL. Wobbuffet’s Flip Over recoil now resolves after outgoing damage against the
original attacker. The candidate passed 39 focused cases; the identical baseline
failed 11. It also passed both browser builds, 530 saved states, 3,457 initial
actions and four candidate-browser puzzle solutions. Combined verification is
recorded below. Kyogre’s legacy in-flight Super Tidal Wave prompt restoration
remains unsupported; stable copied Giratina snapshot coverage passed.

Evolution follow-up review: the printed Floette CEC 151 face says one random
card despite conflicting local `card-data.json` stating two; keep the one-card
selection. Its existing handler does not reveal the chosen card before moving
it, and Forretress FLF directly increments damage counters without checking
Ability-effect prevention. These pre-existing behaviors need separate tests.
A test fixture also exposed a possible Garbodor DRX / Stealthy Hood interaction;
verify the printed ruling and reducer ownership before changing it.

Round-22 accepted-evolution migration covers 12 additional existing cards:
Bewear GRI, Alakazam/Kadabra M1S, Haunter/Mismagius BKT, Rhyperior BUS,
Floette CEC, Butterfree FST, Forretress FLF, Galarian Obstagoon SSH/VIV and
Alcremie VIV. The candidate passed 101 focused cases (including Bench, blocking
and several accepted effects); the identical baseline passed 61 and failed 40.
Both browser builds, 530 saved states, 3,457 initial actions and four physical
candidate-browser puzzle solutions passed in isolation. Combined verification is
recorded below.

Round-22 combined verification: root tests, production build and attestation,
seven API tests, 530 comparable saved states and 3,457 initial actions passed;
four recorded puzzle solutions won. The full card suite reports 2,591 passing
and the same two unannotated generic ownership failures. The corpus skipped 137
missing, invalid or unsupported inputs; initial-action checks and four recorded
solutions do not cover every later move. Nothing was deployed.

Round-23 follow-up corrects Floette CEC Flower Picking to reveal its selected
card before moving and shuffling it, and routes Forretress FLF Thorn Tempest
counters through Ability-effect protection. Eleven focused cases pass, including
a public-dispatch reveal flow and Corviknight VMAX protection; the identical
original nine-case baseline passed five and failed four. Both browser builds,
530 saved states, 3,457 initial actions and four candidate-browser puzzle wins
passed in isolation. Combined verification is recorded below.

Round-23 grouped port adds 20 Legends Awakened cards (including distinct Gligar
and Chinchou prints) and four Majestic Dawn cards: Leafeon, Fearow, Lickitung
and Kangaskhan. Full identities and preimage hashes are recorded in
`/var/folders/j1/v2wg0qh93kjb4_cmn27201p00000gn/T/prizemap-cards23.9pb7ll21/MANIFEST.json`.
The candidate passed 168 focused cases, both browser builds, 530 saved states,
3,457 initial actions and four physically resolved candidate-browser puzzle
solutions. Combined verification is recorded below.

Round-23 Energy transaction investigation: the current-source baseline passes
10 of 32 focused cases; the scratch candidate passes 26. Remaining candidate
failures cover pre-payment observer ordering, late onAttached rollback, emitted
animations, external closure state, random-number progression, and distinguishing
a manual Energy play from an effect attaching from hand. Transaction snapshots
also do not cover WeakMap-backed attack state and can commit before an async
shuffle continuation. Candidate remains unintegrated; design and evidence are
in `/private/tmp/prizemap-energy23/AUDIT-ROUND23.md`.

Round-23 Tera copied-attack ownership migration covers 19 registered cards.
Wellspring Mask Ogerpon ex Sob uses the existing source-independent retreat lock,
fixing direct/copied retreat and expiry. The candidate passes 71 focused cases;
the earlier identical 68-case baseline passed 42 and failed 26. Direct and
copied new-lock snapshots survive attacker removal and expire; old source-present
markers still work. Old source-removed markers remain ambiguous and are not
blindly converted; see `/private/tmp/prizemap-ownership23-tera/LEGACY-SOB-AUDIT.md`.
Both browser builds and 530 saved states passed. 3,456 of 3,457 initial actions
matched: the intentional Sob difference changes only the saved marker name. Four
candidate-browser puzzle solutions won. Combined verification is recorded below.

Round-23 combined verification: root tests, production build and attestation,
seven API tests, and 530 comparable saved states passed. 3,456 of 3,457 sampled
initial actions matched; the sole intentional difference is the corrected Sob
retreat-lock marker. The comparator therefore exits nonzero; the affected saved
puzzle and continuation were independently checked in
`docs/upstream-sync-review/sob-saved-puzzle-round23.md`. Four recorded puzzle
solutions won. The full card suite reports 2,841 passing and the same two
unannotated generic ownership failures. 137 invalid, unsupported or missing
inputs were skipped. These checks do not cover every possible later move.
Nothing was deployed.

Round-24 larger batch adds 32 HeartGold & SoulSilver base-set and 30 Platinum
cards. The merged candidate passed 338 focused cases, both browser builds, 530
saved states, and four candidate-browser puzzle replays. 3,456 of 3,457 initial
actions matched; the sole difference is the previously reviewed Sob lock marker.
Flaaffy, Diglett and Dunsparce targeted-damage variants remain deferred pending
modifier-safe chosen-target logic; Slakoth PL remains deferred pending
switch-during-attack lock timing. Exact paths and hashes are in
`/private/tmp/prizemap-combined64/MANIFEST.json`. Combined verification is
recorded below.

Round-24 combined verification: root tests, production build and attestation,
seven API tests, 530 comparable saved states, and four recorded puzzle wins
passed. Of 3,457 initial action attempts, 3,456 matched; the one difference is
the previously reviewed Sob retreat-lock marker, so the comparison command
exits nonzero. The full card suite reports 3,179 passing and the same two
unannotated generic ownership failures. 137 invalid, unsupported or missing
inputs were skipped. These checks do not cover every later move. Nothing was
deployed.


Delta Reign pivot (2026-11-10): the simulator registers all 141 printed DLR
collector numbers, with individual CDN artwork and number-preserving payload
normalization. Upstream definitions were adapted to this fork's scalar types
and tags; upstream M6 identities are retained where applicable. Grisham 93 was
implemented locally because it was absent upstream. Legendary Stadium halves
are assembled as one play, displayed and inspected separately, and checked
against cancellation, Chaotic Swell, Evolution stages and saved-state reloads.
Rayquaza 84/138/141 uses replayable subset shuffles and corrected effective
Energy accounting; Talonflame 88/124 supports both its hand Ability and
dragging onto an empty Bench. A mobile touch regression also covers overlapping
Bench hit targets, a normal Basic drop, valid Fletchinder evolution, a missing
eligible Mega and a full Bench. The implementation also fixes the Water-type
restriction of Bubble Water Energy and selected DLR card-effect discrepancies.
The normal browser metadata now includes all 141 DLR image URLs. The deck-import
API resolves all 141 numbered identities and canonical full names without
collapsing alternate Rayquaza prints or the two Stadium halves; all 11 service
tests passed, including every printed DLR name and historical parity checks.

Combined candidate verification: 398 targeted tests passed, as did the full
card suite except the same two pre-existing unannotated copied-handler ownership
failures (3,530 passed, 2 failed). The ambiguity and the unsafe shortcut were
rechecked in `/private/tmp/prizemap-bubble-audit/OWNERSHIP-HANDOFF.md`. The
read-only puzzle corpus validated 530 supported saved states in both versions
and matched all 3,457 first actions. Four recorded puzzle solutions also won:
Breaking Through the Wall, Explosive Hand, Trapped in the Phantom Maze, and
Something's Fishy. Two decoded states differ only in corrected
Rapid Strike Energy provides/blendedEnergyCount metadata. No matching screenshot
puzzle existed in the saved corpus. A synthetic fixture based on a saved puzzle
loaded all four screenshot identities; portrait and landscape browser checks
showed each Stadium half and its artwork correctly. Those checks do not prove
every later action or combination of card effects.

Historical batch 25 and the generic copied-handler work were paused for this
pivot; the prior upstream watermark remains unchanged. See the per-commit
ledger for partial ports and deferred portions; do not treat the DLR pivot as
a full merge of the latest upstream commits.


Post-DLR correction: Mega Golurk ex's Goliath's Punch keeps its 30 recoil
when copied and when Restricted Activation is suppressed. The direct Ability
still blocks attacks with fewer than 10 cards in hand when active. All three
DLR prints inherit the corrected implementation. The isolated candidate passed
33 focused cases, 530 matching saved states, and 3,457 matching initial actions.
The two unannotated copied-handler ownership acceptance failures remain open;
the fix uses the existing explicit attack-ownership contract.


Round-25 combined batch: 30 Supreme Victors, 13 Majestic Dawn and 19
Unleashed printed identities are integrated. The SV additions are Altaria C,
Arcanine, Articuno, Bibarel, Buneary, Camerupt G, Chatot, Cherrim, Drifblim,
Feebas, Floatzel, Goldeen, Hippopotas, Lopunny, Loudred, Lucario C, Medicham,
Moltres, Mudkip, Pachirisu, Paras, Rhyhorn, Roselia, Roserade, Skorupi,
Staravia, Togekiss C, Whismur, Zapdos and Zubat. The MD additions are Aipom 51,
Chimchar, Hippopotas, Monferno, Pikachu, Piplup, Plusle, Spearow, Staravia,
Starly, Stunky, Sudowoodo and Turtwig. The UL additions are Beedrill, Cherubi,
Dunsparce, Fearow, Grotle, Larvitar 50 and 51, Magmar, Mankey, Natu, Onix 57,
Plusle, Poliwhirl, Pupitar 39, Riolu, Squirtle, Stantler, Teddiursa and Ursaring.
Exact numbered Larvitar UL 50/51 inputs, including 050/051, resolve separately
in both simulator and deck-import APIs, without changing other historical name
fallbacks.

The batch also fixes Garbotoxin ownership when Stealthy Hood protects a Pokémon
from an opposing Garbodor, while retaining own-Garbotoxin locks. The integrated
candidate passed 636 focused tests, 13 API tests, 530 identical saved states,
3,457 identical sampled first actions and four complete recorded puzzle wins.
The full card catalogue gained exactly 62 names, with no newly displaced or
duplicate registered identities. Simulator browser builds passed. Unreviewed
upstream cards and the two unannotated copied-handler failures remain open;
the upstream ledger remains partial rather than advancing the watermark.

Round-25 ownership follow-up migrates Steelix and Sandslash DLR, Zygarde FLI,
Slaking DRX, Zebstrika BKP and Tinkaton PAL to explicit attack-only copied
handlers. Tinkaton SVP/PAF reprints retain their inherited behavior. The batch
passed 49 focused cases and, after overlaying the 62-card batch, 468 combined
cases, 530 identical saved states and 3,457 identical sampled first actions.
The two generic unannotated ownership acceptance failures remain open; their
fixture branches do not identify which effects belong to attacks versus Abilities.

Final round-25 overlay check (including six ownership migrations and padded
Larvitar inputs): 531 supported saved states matched exactly and all 3,462
sampled first actions matched; 136 unsupported, missing or invalid records were
skipped. The current integrated browser build passed 199 client-service
specifications, 67 core client specifications, 50 client-card specifications,
13 API tests and all four recorded puzzle replays. These checks do not prove
every possible later action.

Final round-25 full-card run: 3,993 tests passed and the same two intentionally
unannotated copied-handler ownership acceptance tests failed. No new full-suite
failures appeared. Their identical predicates cannot distinguish attack-owned
from Ability-owned behavior without an explicit ownership contract; the
real-card migrations retain both acceptance cases unchanged for future work.

Arboliva DLR 17 follow-up: Slippery Oil now lets the opponent choose its
replacement and respects protection against opposing Abilities. Direct and
copied Mega Drain retain their healing. Two real baseline failures were
reproduced; the rebased candidate passed 63 focused checks, 531 identical saved
states and 3,462 matching sampled first actions.

Round-26 adds 32 further printed identities: Inkay LOR 77, Tandemaus PAL 166,
Floragato SVI 14, Sprigatito SVI 13, Tandemaus SSP 157, Houndour LA 103,
Poochyena LA 116, Nincada LA 108, Drapion E4 RR 17, Spheal RR 82,
Hippopotas RR 64, Surfing Pikachu RR 114, Bastiodon GL RR 2, Houndoom E4 RR 65,
Grovyle SF 39, Duskull SF 60, Cherubi SF 56, Shelgon SF 50, Stunky SF 76,
Crobat UL 14, Stufful MEG 111, Tinkatink MEG 96, Misdreavus LA 107,
Spoink LA 121, Treecko SF 79, Voltorb SF 81, Swinub SF 77, Bidoof SF 54,
Skorupi SF 73, Koffing RR 68, Gliscor E4 RR 62 and Eevee RR 59.
Numbered Inkay LOR 77/121, Duskull SF 60/SH2, and Crobat UL 14/84
resolve to their exact prints, including padded numeric forms, while legacy
unnumbered fallbacks are preserved. The 13,950-name catalogue gained exactly
32 identities without displaced or newly duplicate full names.

The combined 62-card and 32-card candidate passed 849 focused checks, 15 API
checks, 531 identical saved states, 3,462 matching first actions and four
recorded puzzle solutions. An independent review checked the new print
identities and attack effects; these tests do not prove every possible card
interaction. The upstream ledger is still partial, not a new upstream watermark.

Azurill DLR now marks Energy attached by its attack as coming from the deck,
so tested Basic and Special Energy restrictions that apply only to cards played
from hand do not incorrectly block it. The legacy behavior of unannotated
attachment callers is preserved. Its Basic and Special overlays passed focused
regressions and independently matched 531 saved states and 3,462 first actions.
This targeted source annotation does not resolve general attachment observer
ordering or rollback; other effect-driven attachment callers require review.

DLR Energy follow-up: Kommo-o and Mega Rayquaza ex now identify Energy as
coming from the deck. Pawmot and Darkrai now move the selected Energy from its
actual source before attachment notifications; their fixes are local to those
cards. Thirteen baseline cases failed and the overlay passed 96 focused cases,
532 identical saved states and 3,466 matching first actions. Generic attachment
transaction and rollback behavior remains to be audited. A separate real-game
reproduction shows Magmortar's Ability bypasses six tested hand-attachment
locks and Frozen City's reaction; a safe provenance and timing fix remains
unresolved and is not claimed by this batch.
The Magmortar audit also reproduced an invalid Special Energy selection even
though Buddy Boost specifies Basic Fire Energy. Gengar & Mimikyu-GX and Alolan
Golem-GX, which restrict plays from hand rather than this Ability attachment,
correctly allow it. Addressing both cases requires distinguishing attachment
from an Ability from a card played from hand and preserving notification order.
Frozen City PLF and Old Cemetery CRE now skip their hand-attachment reactions
for explicitly marked deck/discard attachments, including Azurill. Manual hand
attachments retain their existing behavior; unannotated effect-driven calls
retain legacy behavior and still require review. The candidate passed 123
focused checks, 532 matching saved states and 3,466 matching initial actions.
Island Cave HL and Calamitous
Snowy Mountain PAL need separate source-aware review; Frozen City has a
separate Team Plasma exception issue.

Test infrastructure: Mega Evolution's mixed M1S/M1L module exposed a helper
assumption that one module has exactly one set code, and partial pre-registration
could skip its other cards. The helper now registers missing cards and discovers
additional printed set codes; 113 focused tests passed with assertions preserved.

Release verification after the DLR and harness overlays: 4,319 card checks
passed; the same two generic unannotated copied-handler ownership tests remain
failing. Fifteen API tests, the Cloudflare tests and four recorded puzzle wins
passed. The release package build passed its mobile size budgets.

Local follow-up (not yet deployed): Magmortar's Buddy Boost prompt now rejects
non-Basic and non-Fire/Lightning Energy at submission as well as in its UI;
its hand-attachment locks and reactions require a separate timing fix. Island
Cave and Calamitous Snowy Mountain now ignore explicitly annotated deck/discard
attachments, and Frozen City exempts Team Plasma Pokémon. Six focused baseline
cases failed before these Stadium changes; 36 combined tests now pass, including
manual attachments, Water/evolution exceptions and Magmortar validation. All
532 supported saved states and 3,468 sampled initial actions match; 137
unsupported or invalid records were skipped. Unannotated attachment sources
remain open.

Local copied-attack follow-up (not yet deployed): callbacks from a copied
attack's prompts and coin flips now temporarily restore its attack and marker
context. The baseline failed three real delayed-effect reproductions; the
candidate passed 62 focused checks, 532 matching saved states, 3,468 matching
first actions and four recorded puzzle wins. Coin events use a per-dispatch
proxy, preserving the caller's callback while giving concurrent dispatches
separate contexts; future observers must not assume coin-event object identity.
Direct after-attack-damage queues, arbitrary external scheduling, and restoring
in-flight prompt closures remain outside this change. The two unannotated
ownership acceptance failures remain
open and unchanged.
Combined local callback, Energy and Stadium overlay: 98 focused checks passed;
all 532 supported saved states and 3,468 sampled initial actions matched the
published engine (137 rows skipped). Full-solution replays and a full card run
remain required after the next card batch is integrated.
The callback wrapper does not cover `afterAttackDamage` continuations, which
run with the raw store. A targeted scan of 98 current registrations found 14
closures passing `this` as a card/source argument, but none directly reading
`this.attacks` or `this.*MARKER`; that scan does not prove all helper or future
code paths safe.
`Attack.effect` and `copiedReactiveAfterDamage` are also outside the wrapper;
the latter is currently used by Aggron UNB and passes the copycat explicitly.
Coin-event `preventDefault` and `result` fields still forward to the original
effect object, so callback isolation does not make concurrent reuse of the
same event's mutable status fully independent.
Independent follow-up adds real Dusclops nested-prompt source identity and
multi-observer/multi-coin interleaving regressions; 18 combined checks passed.
The broader Magmortar hand-attachment fix is still isolated: its preflight
suppression probe can invoke an unrelated external observer even on a cloned
state. The non-shipping [pure suppression research](pure-suppression-migration.md)
records a reproducible red diagnostic, a five-family experimental evaluator,
and the remaining capability and protection work; it is not wired into play.
A first-pass classification of the 71 directly detected PowerEffect branches
is recorded in [the suppression classification](pure-suppression-classification.md);
indirect paths and full capability coverage still require manual review.

Round-27 local overlay (not yet deployed): 37 printed identities were added:
Electrike AR 62, Geodude AR 65, Ponyta AR 72, Rattata AR 73, Snorunt AR 75,
Tangela AR 76, Treecko AR 78, Manectric AR 44, Aron RR 57, Rhydon SV 80,
Plusle HSP 16, Hitmonlee HSP 25, Exeggcute HS 63, Phanpy P2 15, Pikachu P2
16, Bulbasaur P2 12, Ivysaur P2 7, Multi Technical Machine 01 P2 9, TV
Reporter P2 11, Ivysaur P3 14, Jolteon P3 3, Grovyle P4 7, Mudkip P4 11,
Pidgey P4 12, Treecko δ P4 15, Heal Energy P4 8, Scramble Energy P4 10,
Charmeleon δ P5 5, Charmander δ P5 10, Bill's Maintenance P5 6, Rare Candy
P5 7, δ Rainbow Energy P5 9, Cherrim P8 6, Rare Candy P8 10, Roseanne's
Research P8 11, Chimchar P8 12 and Turtwig P8 17. Definitions live in their
native set directories but use a last-registered aggregator to preserve old
unnumbered fallback resolution. Delta Pokémon use their ordinary gameplay names
and retain their δ-marked serialized full names; numbered deck imports and
API lookups support both forms.

Existing base fixes included with the reprints: Heal Energy ignores explicitly
marked deck/discard attachments; Roseanne's Research shuffles after zero chosen
cards; Bill's Maintenance draws only after its shuffle; Ivysaur's Poison Seed
uses attack-origin effects and honors protection, including when copied. Heal's
legacy unannotated non-hand attachments and Bill's prevented-movement cases
remain unaudited. The isolated full overlay passed 219 focused card tests,
19 API tests, all 37 artwork mappings, 532 matching saved states, 3,468 matching
first actions and four recorded puzzle wins. Its catalogue gained exactly 37
unique identities without changing 27,559 prior serializer fallbacks; 38,719
old deck-import inputs also retained their outcomes. The current combined tree
still requires its own final verification; the upstream ledger remains partial.
Combined round-27 full-card verification: 4,589 checks passed and the same two
unannotated copied-handler ownership acceptance checks failed; no other suite
failed. All 532 supported saved states and 3,468 sampled first actions matched
the published engine; 137 unsupported or invalid records were skipped.
The combined tree also replayed Breaking Through the Wall, Explosive Hand,
Trapped in the Phantom Maze and Something's Fishy to wins. Independent
round-27 review checked printed metadata for all 24 new Pokémon, reprint
metadata for all 13 variants, and 12 additional reprint gameplay cases. These
checks do not cover every possible later action or interaction.
A [portable ownership counterexample](fixtures/copied-ownership-research.md)
shows why arbitrary identical-predicate legacy branches cannot be partitioned
reliably without executable ownership information. The existing explicit
contract is a migration path; adding it to the two acceptance fixtures would
change their unannotated-handler intent, so those tests remain unchanged.
Round-28 chosen-target attacks remain under development: the
[portable red fixtures](fixtures/round28-chosen-target.red.md) reproduce a
missed Choice Belt bonus against an Active V and spurious Active damage when
a Bench target is selected. The fixture and helper are non-shipping research;
these cards must not be registered until target selection, modifier timing,
Weakness/Resistance and protection are correct for direct and copied attacks.

Round-28 local overlay (not yet deployed) adds 18 reviewed identities: Haunter
AR 42; Buneary DP 73; Glaceon MD 20; Shellos East Sea MD 73; Vulpix MT 107;
Charmander SW 82; Staravia SF 52; Spinarak HS 83; Buizel UL 45; Eevee P3 13;
Pikachu P4 13; Burmy Sandy Cloak MD 54; Ponyta SF 71; Snover SF 74; Swablu
GE 86; Sandshrew HS 79; Beldum SV 90; and Poliwag UL 58. The isolated overlay
passed 180 focused tests, 20 API tests, 532 identical saved states, 3,468
matching first actions, four recorded wins, and all 18 artwork checks. Its
catalogue added exactly 18 identities without changing 27,635 prior serializer
fallbacks or 38,827 prior deck-import inputs. The combined current tree still
needs its own test run; the chosen-target group remains separate and unresolved.
Combined round-28 full-card run: 4,769 passed and the same two unannotated
copied-handler ownership acceptance checks failed; there were no other failures.
The API suite passed 20 tests and all 532 applicable saved states matched.
Combined round-28 verification: the root client suite and all 20 API tests
passed; 532 supported saved states and 3,468 initial actions matched the
published engine, with 137 unsupported/invalid records skipped. All four
recorded puzzle solutions won. The full card run passed 4,769 checks and
retained the same two unannotated copied-handler ownership failures.

Local ownership migration (not yet deployed): attack-only contracts now cover
Meganium BKP, Zoroark BKT, Jumpluff EVS, Pinsir EVS, Vanilluxe PAR, Turtonator
M3, Seviper M2 (PFL), Machamp PLB, Slaking ex SSP, Cobalion-GX TEU, Latios-GX
UNM and Metagross VIV, including inherited print variants. A separate explicit
opponent-attack preflight and retention predicate preserves Cobalion and
Metagross restrictions through bounce/knockout, switching, serialization and
later copied attacks, without sending opponent attacks to unannotated handlers.
The isolated candidate passed 86 focused checks, 532 matching saved states and
3,468 matching opening actions; independent review also verified an actual
ClientSimulator detached-effect snapshot/undo roundtrip. The original two
unannotated ownership acceptance tests remain unchanged and failing. Final
combined-tree tests and recorded replays are still required.
Combined round-28 plus ownership migration: 4,812 full-card checks passed,
with only the same two unannotated ownership acceptance failures; 20 API tests
passed, 532 saved states matched exactly, and all 3,468 sampled first actions
matched (137 rows skipped). The added client regression exercises detached
Iron Rule through snapshot restoration, compact checkpoints and undo.
The combined tree also passed the 68-spec client suite with the new real
snapshot/undo regression and replayed the four recorded solutions to wins.
A separate [non-targeted copied-attack cancellation fixture](fixtures/round28-nontarget-cancellation.red.md)
reproduces existing Clefable Metronome damage after a loaded Sand Attack tails
cancellation. It is not fixed by the targeted-damage prototype and remains open.
Sceptile CES has an independently reproduced, pre-existing Power of Nature
ownership/Energy check issue; see the [non-shipping red fixture](fixtures/sceptile-power-of-nature.red.md).
The ownership migration preserves that behavior while a separate fix is reviewed.
A further local attack-ownership migration covers Landorus M6, Thundurus M6,
Enamorus M6, Tornadus M6, Stakataka UNB, Crustle BCR, Shedinja DRX, Registeel
CES, Sceptile CES, Ninjask VIV and Klinklang SCR, including inherited variants.
Independent review and 132 focused checks passed; the isolated candidate matched
532 saved states and 3,468 initial actions. Sceptile's separate Power of Nature
bug remains under review. Final combined-tree tests are still needed.
The combined 55-card tree plus this ownership batch passed 502 focused tests
and matched all 532 supported saved states and 3,468 sampled opening actions.
A full browser/replay run remains required after the last ownership migration.
Post-migration combined verification passed 4,859 full-card checks, with the
same two unannotated copied-handler ownership checks still failing and no other
card failures. All 20 API checks passed, and Breaking Through the Wall,
Explosive Hand, Trapped in the Phantom Maze and Something's Fishy replayed to
wins. The root client, service, touch, and packaging suites also passed.
Local ownership batch 3 adds attack-only contracts for Latias ex, Fezandipiti
ex, Bloodmoon Ursaluna ex, Pecharunt ex, Mega Kangaskhan ex, Fan Rotom,
Pidgeot ex, Gholdengo ex, Chien-Pao, Iron Leaves ex, Hariyama, Squawkabilly
ex, Blaziken ex, Kyurem, Mega Venusaur ex, Alakazam, Munkidori, Cornerstone
Mask Ogerpon ex, Jellicent ex, and Seaking, including compatible inherited
prints. Its isolated typechecked run passed 251 checks, including direct and
copied attacks, Ability isolation, delayed restrictions and alternate prints.
All 532 supported saved states and 3,468 sampled first actions matched the
prior local tree (137 records skipped). Combined-tree verification is pending;
the two unannotated ownership acceptance tests have not been changed.
The combined local tree subsequently passed 621 focused card and ownership
checks; a complete card and replay run is still required after final overlays.
Round-29 local overlay (not yet deployed) adds Turtwig DPP 1, Pachirisu DPP 4,
Buneary DPP 6, Buizel DPP 13, Chatot DPP 14, Shinx DPP 15, and Beldum UL 44.
Its independently reviewed candidate passed 67 focused tests, 23 API tests,
seven artwork mappings, four puzzle replays, and comparisons of 532 saved
states, 3,468 opening actions, 27,673 prior serializer inputs and 38,881 prior
deck imports. Existing Dialga DPP DP17 fallback behavior remains unchanged.
The exact combined tree passed 5,045 full-card checks, with the same two
unannotated ownership acceptance failures and no other card failures. All 23
API checks passed and the four recorded puzzle solutions replayed to wins.
The full client, service, touch and packaging suite also passed.
Four Energy-discard cards remain deferred pending the
[restored Pokémon-as-Energy investigation](fixtures/round29-holon-energy/README.md).
The separate [Sceptile and queued-damage proposal](fixtures/sceptile-and-stale-damage.investigation.md)
is also deferred because selected source/target identity can change while a
slot is reused. Neither research prototype is integrated.
Local ownership batch 4 migrates Klefki SVI, Mega Diancie ex PFL, Crustle DRI,
Dipplin TWM, Giratina LOT, Eevee SSP, Mew UNB, Gardevoir ex SVI, Miraidon ex
SVI, Brute Bonnet PAR, Marshadow UNB, Goldeen TWM, Flutter Mane TEF, Mega
Rayquaza ex DLR and Volcanion-EX STS. Its independently reviewed, typechecked
candidate passed 417 focused checks, matched 533 comparable saved states and
3,476 sampled first actions, and tested 13 inherited prints. Full combined-tree
verification remains pending; the two unannotated acceptance tests remain open.
Round-30 local overlay (not yet deployed) adds Manaphy, Pachirisu, Riolu,
Staravia, Buneary, Piplup, Starly and Turtwig P6, plus Delibird, Stantler and
Mareep P7. The reviewed candidate passed 105 focused checks, 24 API checks,
11 artwork mappings and four puzzle replays. It preserved 533 saved states,
3,476 opening actions, 27,687 prior serializer inputs and 52,581 prior
deck-import inputs. Piplup P6 uses its printed 20+ damage; the existing Piplup
DP parent still has a separate 10+ error, preserved here to avoid changing old
puzzles without dedicated review. Lucario P6 and Ralts P7 remain deferred for
separate attack-timing and printed-cost issues. Final combined tests are pending.
The exact round-30 combined tree passed 5,249 full-card checks, with only the
same two unannotated ownership acceptance failures. All 24 API checks passed,
and the four recorded solutions replayed to wins. The client, service, touch
and packaging checks also passed.
Round-31 local overlay (not yet deployed) adds Makuhita MEP 68, Chikorita MEP
69, Charmeleon MEP 79, High Pressure System P3 10 and Low Pressure System P3
11. Its independently reviewed candidate passed 21 focused checks, 25 API
checks, five artwork mappings and four recorded puzzle replays. It matched
533 supported saved states, 3,478 first actions, 27,709 prior serializer and
52,625 prior deck-import inputs. Chikorita MEP has its printed Grass attack
cost and Charmeleon MEP its printed 110 HP; the incorrect older parent prints
were left unchanged for separate review. Toxel and Fennekin MEP are deferred
because canceled attacks can still search; see the
[non-shipping reproduction](fixtures/round31-canceled-search/README.md).
Brave Bangle and Iron Defender PBL also remain deferred due to
[pre-existing modifier bugs](fixtures/pbl-parent-bugs/README.md).
The round-31 combined tree passed 5,270 full-card checks, with only the same
two unannotated copied-handler failures. All 25 API checks and all four recorded
puzzle replays passed. Client, service, touch and packaging checks also passed.
The local serializer now restores the Energy role of six explicitly opted-in
Pokémon-as-Energy cards when their attachment references are unambiguous. This
fixes the restored Holon/Charjabug selection case without changing the wire
schema or shared card-movement code. The reviewed candidate passed 118 focused
checks, 69 client checks and two independent snapshot-diff cases; it matched
534 supported saved states and 3,487 sampled first actions from one consistent
database snapshot. Existing ambiguous placements, Buzzap's missing chosen type,
and separate whole-stack movement defects remain outside this fix. The older
[research fixture](fixtures/round29-holon-energy/README.md) records the original
failure and its broader, unshipped movement experiment.
The integrated Energy fix passed 5,307 full-card checks and all 25 API checks;
the same two unannotated ownership tests remain the only card failures. All
four recorded puzzle solutions replayed to wins. Client, service, touch and
packaging tests also passed. A separate run replayed those four solutions in
ten unseeded sessions each, all 40 to wins.
Round-32 local overlay (not yet deployed) adds Bidoof MT, Team Aqua's Spheal
DCR, Gastly MEW, Helioptile/Pikachu/Rolycoly/Slurpuff/Swirlix ASC, Vibrava PFL,
Seaking JU, and Crushing Hammer/Energy Switch FA PBL. The reviewed candidate
passed 268 focused tests, 29 API checks, 12 artwork mappings, four puzzle
replays and a 576-case PBL collision matrix; 534 saved states, 3,487 actions,
27,719 prior serializer inputs and 52,645 deck-import inputs matched. Applin
SCR remains deferred because four existing saved states resolve that name to
Applin DRI; Pikachu ex SVP and Turtwig MD 78 have other existing fallback
collisions. A separate [Team Aqua's Great Ball reproduction](fixtures/team-aqua-great-ball/README.md)
records its pre-existing selection and shuffle defects. Full combined-tree
verification remains pending.
The subsequent local Team Aqua's Great Ball fix permits one eligible Basic
Team Aqua Pokémon and one basic Water Energy, reveals before moving, and
shuffles even when selecting nothing. Its sorted detached search view preserves
deck order/privacy and handles blocked selections. Independent review and 18
focused checks passed; 534 saved states and 3,485 sampled initial actions
matched the pre-fix tree. The fixture records the old behavior.
The combined tree including this fix passed 5,817 full-card checks, all 29 API
checks and four recorded puzzle replays. Only the same two unannotated
ownership acceptance checks failed; the root client, service, touch and
packaging checks passed.
The exact combined tree passed 5,534 full-card checks and all 29 API checks;
the same two unannotated ownership tests remain the only card failures. All
four recorded puzzle solutions replayed to wins. Client, service, touch and
packaging checks also passed.
Local ownership batch 5 covers 26 more source cards, including Lillie's
Clefairy ex, Meowth ex POR, Mew ex MEW and Eevee ex PRE. It separates their
attack reactions from Abilities and declares 23 implemented effect-free
attacks explicitly, including inherited prints. The reviewed candidate passed
223 typechecked checks and ten independent real-action checks, matched 534
supported saved states and 3,487 initial actions, and replayed four puzzle
solutions to wins. Bouffalant SCR was excluded because its existing next-turn
attack lock was missing; see its [original red fixture](fixtures/bouffalant-boundless-power.red.md).
Full combined-tree verification remains pending.
The subsequent local Bouffalant SCR fix applies Boundless Power's next-turn
restriction to the actual attack source, including copies and the SVP print,
without copying Curly Wall. It passed 18 focused tests and an independent
Bench-source action test; 534 supported saved states and 3,485 sampled first
actions matched the prior tree. The red fixture records the pre-fix baseline.
The integrated Bouffalant and copied-ownership regression run passed 386 checks.
The next local ownership migration covers Tapu Lele-GX GRI, Swampert CES,
Shining Genesect SLG, Eevee SUM and Rapidash SIT, including inherited prints.
The reviewed candidate passed real direct/copied attacks, asynchronous GX and
coin prompts, and physical Ability-source controls. It matched 534 saved states
and 3,485 sampled actions and replayed four recorded solutions to wins. Four
baseline marker-leak controls are synthetic and do not establish a reachable
saved-puzzle failure. The two general unannotated ownership tests remain open.
The local Meowth ex POR fix returns Pokémon-as-Energy with its attacker and
removes only successfully moved Tool aliases. It passed 296 focused checks,
69 client checks and 40 recorded puzzle replays; the reviewed candidate matched
534 supported states and 3,485 sampled first actions, then matched 30 affected
states and 235 actions again after the Bouffalant integration. A separate
[pre-AfterAttack switch fixture](fixtures/meowth-pre-afterattack-switch/README.md)
documents an existing source-identity defect reproduced with injected timing;
the fix here does not claim to resolve it.
The combined tree after the Bouffalant, five-card ownership and Meowth changes
passed 5,799 full-card checks, all 29 API checks, the complete root client and
packaging suite, and four recorded puzzle replays. The same two unannotated
ownership acceptance checks remain the only full-card failures.
The combined batch-5 tree passed 5,683 full-card checks and all 29 API checks;
only the same two unannotated ownership acceptance tests failed. The root
client, service, touch and packaging suite also passed. These checks preceded
the subsequent CSS-only prompt-layering hotfix, which was separately deployed.
The [targeted-copy orchestration fixture](fixtures/round28-target-orchestration.red.md)
records a separate synthetic ambiguity: the same legacy `preventDefault` write
can mean prompt orchestration or cancellation. Its accompanying patch is a
non-shipping reproducer, not a proposed production change.
The [round-33 lookup investigation](fixtures/round33-lookup-compatibility/README.md)
preserves the earlier deferred candidate and a duplicate-definition
counterexample. Its replacement is now integrated locally with five SVP prints:
Iono's Kilowattrel 182, Lillie's Ribombee 183 and Professor's Research 221,
222 and 223. Numbered SVP and PR-SV imports select the requested print; older
unnumbered and incorrect-number fallbacks are preserved. Missing exact prints
are not silently replaced, and pre-existing canonical or legacy-alias owners
retain precedence when definitions collide. Seven other print candidates remain
deferred in the [cancellation fixture](fixtures/round33-cancellation/README.md).
An [attack-cancellation preflight investigation](fixtures/attack-cancellation-preflight/README.md)
reproduces direct and copied attack side effects after a failed coin flip.
Its proposed preflight is deferred: it can bypass native attack legality checks
on tails. The record includes both native Cobalion-GX and Galarian Sirfetch'd
regressions, a 92-branch legality inventory, and the rejected prototype.
The [expanded inventory](fixtures/attack-cancellation-preflight/expanded-inventory/README.md)
finds 301 attack-related throw sites, including 37 inside callbacks, and a
real hidden-zone legality control. These are audit candidates rather than 301
proven preconditions; prompt-result validation cannot be hoisted blindly.
The [Simisage PAR investigation](fixtures/simisage-par-investigation/README.md)
is deferred pending a reliable intrinsic-Ability query. The existing query can
miss gained or removed Abilities, include Tool-granted effects, mutate printed
power arrays and depend on traversal order; the saved evidence includes a real
four-action Ancient Star counterexample.

The final five-print resolver candidate passed 38 strict focused checks, four
API checks, five generated browser artwork mappings and four recorded puzzle
solutions. Against the prior local tree, 534 supported saved states and 3,485
sampled first Trainer, attack and Ability actions matched. An independent
real-engine suite also exercised the two Pokémon's Abilities and direct and
copied attacks. These are sampled checks: they do not prove all historical
payloads or later actions safe. The existing attack-cancellation problem can
still allow damage or effects after a failed attack coin flip, including on
inherited attacks; the seven affected candidate prints remain deferred. The
two copied-handler ownership failures were resolved by declaring explicit
attack-only contracts on the synthetic mixed-handler fixtures. This validates
the ownership contract; arbitrary unannotated mixed handlers are not
generically partitioned. The final manifest SHA-256 is
`08c11fca24aab7a524f44b0019dafff020e542969759274597bc93cf73a66d77`.

The compatibility guard does extra catalogue work at startup. In six paired
local Mac process samples under load, median catalogue initialization rose
from 17.89 ms for 14,072 cards to 29.68 ms for 14,077 cards; 64 synthetic
contracts measured 29.90 ms with 14,139 cards. These are small desktop samples,
not an end-to-end puzzle-start benchmark; mobile WebView performance has not
been measured. The batch is integrated in the local source and remains a
partial upstream port; it has not been established as deployed by this record.

After integration of the frozen five-print batch, the full card suite ran 225
spec files: 5,866 tests passed and the two copied-handler ownership tests
failed. The fixtures now declare explicit attack-only contracts, and the
updated full run passes 5,868 tests with no failures. The root
client/service/touch/packaging suite and all 34 API tests passed. Four recorded
puzzle solutions replayed to wins on the integrated build. The
534-state/3,485-action comparison remains a sample of the final candidate, not
an exhaustive guarantee for all puzzles.

Smeargle UD's upstream Supporter-counter workaround remains deferred. Resetting
the counter around `TrainerEffect` can bypass a previously played Supporter,
but also changes how other in-play cards observe copied effects: Krookodile XY
can reject the copied Tierno effect, Hitmontop VIV can count copied Bea as
played, and Gwynn M5 and Misty's Cheerfulness have additional counter/timing
checks. A safe port needs copied-effect context that survives prompt callbacks
and is visible to those observers. The tentative local counter patch was
reverted; it passed the general card suite but did not cover these real
interaction regressions. The four puzzle replays passed on the built candidate;
the final source was restored to its pre-patch Smeargle behavior.

DPP follow-up: added four cards: Double Full Heal DP (collector 105), reusing
the existing Sandstorm implementation; Energy Restore DP (106), with its
three-coin retrieval effect; Night Pokémon Center DP (108), with its target and
coin-dependent heal/discard effect; and Professor Rowan DP (112), with its
retain-one, shuffle and draw-four effect. All four print identities are
registered. The full 225-file card regression suite passed (5,868 passed, 0
failed). The production build passed at 2.18 MiB gzip runtime, and all four
saved puzzle solutions won against this exact four-card state. The other files
in the DPP commit remain under review.

Upstream card import batch 01 has begun. Added and registered 67 Arceus-set
cards so far: eight Trainers (Bench Shield, Buffer Piece, Department Store
Girl, Energy Restore, Professor Oak's Visit, Dome Fossil, Helix Fossil and Old
Amber) and 59 Pokémon. Fossils use the local `cardTypez` field for their
in-play Pokémon type; Professor Oak's Visit uses the local
`DRAW_CARDS(player, 3)` signature. The Pokémon imports include upstream attack
and Ability implementations. Local compatibility work added bounded next-turn
damage prevention, attack coin-cancel timing, Endure timing, and type/tag
helpers required by those cards. The full 225-file card suite passed (5,868
passed, 0 failed), the browser package compiled, and all four saved puzzle
solutions replayed to wins against the rebuilt package. The batch inventory
under `docs/fixtures` is git-ignored by the repository's `*.md` rule, so this
tracked log is the durable progress record. Continue batch 01 with the DPP
promo print identities and remaining Arceus cards; check aliases and collector
numbers before adding duplicate definitions.

Upstream card catalog batch 01 continuation: added the remaining 24 DPP promo
print identities from the first inventory (23 standalone cards plus the
Ultimate Zone DPP print), and imported Pidgeot HP 14. Added three legacy-name
aliases for Electrike AR, Tangela AR, and Treecko AR, which already existed as
numbered prints locally and were not duplicated. DPP promo types and helper
calls were adapted to the fork's scalar card-type and prefab APIs. Pidgeot HP's
Delta Reserve is implemented with the local `EffectOfAbilityEffect` path and
checks that Holon Energy is attached, the Poké-Body itself is usable, targets
are in play and Delta Species are exempt. New targeted tests cover all 24 DPP
promo identities, Dialga's draw, Regigigas's pre-damage switch, Pidgeot's lock,
and the three Arceus aliases. The full 228-file suite passed (5,901 passed,
0 failed), the browser package compiled, and all four saved PrizeMap puzzle
solutions replayed to wins. A broad upstream/local set-number inventory yields
1,691 candidate print identities before alias and inherited-print review; this
is a review queue, not a verified count of missing implementations. Continue
with the next reviewed 100-print batch and test existing puzzle solutions
after each integration.

Upstream catalog batch 02 (reviewed 100-print candidate block): imported and
registered 83 new card identities across Diamond & Pearl, Great Encounters,
Dragon Frontiers and Holon Phantoms, plus 17 DPP promo reprint identities. Eight
of those promo aliases depended on base cards missing locally, so those base
implementations were imported and registered as well. Adapted upstream helper
calls for this fork, including card-type representation, draw signatures,
Pokémon-stack movement, Altaria's evolution-only damage reduction, Deoxys's
before-weakness reduction, trainer-play lock timing, and all-attack damage
bonus timing. `tsc -p tsconfig.browser.json --noEmit` passes. Focused DPP and
Great Encounters regressions pass 97/97; the full existing card suite passes
5,901/5,901 across 228 specs. The browser build succeeds, and the four saved
PrizeMap puzzle solutions (Trapped in the Phantom Maze, Explosive Hand,
Breaking Through the Wall, and Something's Fishy) replay to wins on this
build. This verifies no regressions against the saved puzzle corpus; card
specific coverage for the new print block is still being expanded. Continue
with the next reviewed 100-print candidate block; the 1,691-item raw queue is
not a verified missing-card total.

Upstream catalog batch 03 (next 100 reviewed identities): added 56 Great
Encounters and 38 Legends Awakened card implementations, plus six DPP promo
print aliases that resolve to existing indexed implementations. The local
compatibility adapters cover fork-specific helper signatures, trainer locks,
Ability locks and multi-flip attacks; Buneary's Double Kick resolves its two
printed coin flips. All 100 candidate names have registry checks, and the two
gameplay smoke cases pass. The complete 229-file card/engine suite passes
6,004 tests with zero failures; the browser TypeScript build passes; and all
four saved PrizeMap puzzle solutions replay to wins. Fossil and modern SVI
Energy Search now require selection of a Basic Energy when one is available;
when none is present, the search resolves without a selection. The client
regression covers the DPP reprint. The candidate inventory is a review
queue, not a verified count of remaining missing cards; continue with the next
100 reviewed identities.

Upstream catalog batch 04 (100 reviewed identities): added 65 Legends Awakened
and 35 Majestic Dawn card implementations. Compatibility work adapted the fork's
scalar card-type API, coin and damage helpers, Poké-Power locks, and numbered
Aipom MD print resolution. Added a native play-from-discard effect and reducer
for Garchomp LV.X's Restore attack. Batch gameplay coverage checks Hitmonchan's
Counter Punch, Jirachi's Doom Desire, Glaceon's Chilly Breath, and Garchomp's
Restore. All 100 names resolve to the expected set and collector number. The
full 230-file card/engine suite passes 6,108 tests with zero failures; the
client card regressions pass 51/51; production TypeScript compile passes; and
all four saved PrizeMap solutions replay to wins. The updated inventory shows
1,031 unique candidate names remaining before further alias and duplicate
review; this is not a verified missing-card count. Continue with the next 100.

Upstream catalog batch 09 (100 reviewed identities): added 5 Stormfront, 82
Supreme Victors, and 13 HeartGold & SoulSilver print identities. One Supreme
Victors print uses the existing Staraptor FB LV.X implementation through a
legacy spelling alias.
Adapted old draw and card-type APIs, and ported delayed Knock Out at end of the
opponent's next turn plus next-turn retreat-cost increases. The batch identity
and targeted gameplay suite passed 103/103, and the browser TypeScript check
passed. This turn's verification after batch 10 also replayed all four saved
PrizeMap solutions successfully.

Upstream catalog batch 10 (next 100 reviewed identities): imported 27 HS, 18
HSP, 44 Unleashed, 9 Black & White Promo, and 2 Theme Deck print identities.
Five shared-print entries were registered as aliases; no existing card files
were overwritten. Added compatibility for dual-type Legend Pokémon, draw count
modifiers, attack-cost increases, attack-damage bonuses, and local helper APIs.
The 100 identity checks passed, the browser TypeScript check and production
browser compile passed, and all four saved PrizeMap puzzle solutions reached a
human win. The refreshed candidate inventory contains 431 unique review
candidates; this queue still needs print-alias and inherited-card review and is
not a verified missing-card count. The complete card/engine suite was not run
for this batch. Continue with the next reviewed 100-print block.


Upstream catalog completion audit (2026-11-11): refreshed upstream/main and found no commits after c531dc84f6d079e7531a9c3986a2f51ddeecad6c. Registered seven exact SVP print variants (182, 183, 184, 193, 194, 195 and 204). Attack preflight now checks legacy Pokémon-marker and player-marker Sand Attack/Smokescreen states before fan-out, so a tails result prevents attack card effects while old puzzle payloads keep their marker representation. A normalized set/collector-number comparison matched all 15,504 non-test upstream identities against the built 15,750-card runtime catalogue with zero missing identities; normalization accounts for DP/SV prefixes and zero-padded local print numbers. The focused cancellation regression passed 21 cases, the full root test suite passed, and recorded solutions for Trapped in the Phantom Maze, Explosive Hand, Breaking Through the Wall, and Something's Fishy each reached a human win.

## 2026-11-20: Team Rocket’s Ampharos versus Hide n Sneak

The inherited Ampharos implementation (unchanged since upstream `77c40e496`)
mutated `target.damage` directly during `EvolveEffect`. Upstream
`db4eebfcfb1e1a04b2d99411ea8e5d61d540e1fc` replaces that mutation with
preventable counters as part of its larger ability-effect refactor. This port
adapts only that card to the fork: react to the existing `AfterEvolveEffect`
and dispatch `PutDamageCountersEffect` with the opposing Ampharos as source.
The evolved Pokémon’s protection now participates; normal damage, suppression,
hand/deck origin, active-player ownership and non-stacking behavior are covered.
No saved card identity or Ghost Veil discard-count name changes are required.

The new focused suite reproduces seven failures before the fix and passes all
18 cases after it. Combined with evolution rounds 21–23 and the saved Hide n
Sneak Prism Tower test, 235 tests pass. The ledger marks the upstream commit
partial; its other card and engine changes remain deferred.

## Gameplay re-audit, batch 1

The ability refactor is being reviewed by behaviour and card path. The first
batch ports targeted counter effects from `db4eebfcf` and `49205ef174`, with
explicit Ability provenance. It retains the fork's existing artwork and saved
card identities, including alternate printings. Attachment-triggered Abilities
now observe completed hand attachments. Golbat and Crobat react after a
completed hand evolution and honor the optional confirmation. Starmie stays in
play when Mysterious Comet is prevented. Tests exercise the actual simulator
actions and pending prompts, plus source-side and unprotected controls. The
final suite passes 33 cases, 300 existing card/evolution regressions pass, and
all ten packaged mouse/touch interaction checks pass. All four previously
recorded solutions still win. The read-only comparison matched all 3,635
sampled opening Trainer, attack, and Ability actions across 559 comparable
saved states (401 active). Opening-action coverage excludes later prompt
resolutions and is not proof of every solution.

The real Revenge of the Assassin fixture opens with Battle Cage, which must
stop Crobat counters against the opposing Bench. The browser gate now expects
that prevention. A separate complete replay verifies the original puzzle wins
by finding Team Rocket's Factory with Petrel, replacing Battle Cage, knocking
out Clefairy with counters to bypass Lillie's Pearl, and finishing with Arbok.

Bug Out was already fixed during the Delta Reign port. Its ledger entry now
reflects the tested direct and copied attack behaviour.

Remaining work includes the other card paths in all three ability-refactor
commits, plus the reproduced Smeargle UD Supporter-copy and Magnezone PLS
Supporter-limit failures. Use printed timing and costs as the expected result
when an upstream implementation has omissions. The November 18 upstream tip
also includes `7aa463245` (Hop’s Phantump/Trevenant tags), which needs validation
against the already registered Ascended Heroes prints and Trevenant's
Hop-specific knockout condition. Both replay commits after it only change the upstream React frontend. Their
diffs contain no shared gameplay or Angular simulator changes.

## Gameplay re-audit, batch 2

Magnezone PLS now checks the actual number of Supporters played this turn.
Dual Brains works after evolving mid-turn, never stacks across multiple
Magnezone, and preserves Lt. Surge’s three-Supporter limit. Gyro Ball first
switches the attacker, then lets the opponent choose a replacement if the
original defender can be affected. Direct reducer calls, playable hints,
copied attacks, suppression, and legacy Supporter snapshots are covered.
[Official Dual Brains ruling](https://www.pokemon-card.com/rules/faq/details.php?id=8838)
[Official Gyro Ball rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%B3%E3%82%A4%E3%83%AB&page=6&regulation=all&regulation_faq_main_item1=all)

Hop’s Phantump and Trevenant now participate in Hop-specific rules.
Horrifying Revenge uses the actual source and type of the knockout on the
opponent’s last turn. A Knock Out caused by damage counters, or of a non-Hop
Pokémon, does not add 100 damage. Existing card names and set numbers are
preserved. [Official Hop’s Trevenant](https://asia.pokemon-card.com/my/card-search/detail/24818/)

Delphox M4/CRI counts Energy units on both sides. Flare Magic works from the
Bench, takes one Basic Fire Energy, and uses the Pokémon’s turn history.
Switching keeps the usage marker, while leaving play and evolving again via
Grand Tree resets it. If no cards can be drawn, the Ability cannot pay its
discard cost. [Official Delphox](https://www.pokemon.com/el/jcc-pokemon/cartas-pokemon/series/me04/13/)
[Advanced rules, E-12 and E-30](https://asia.pokemon-card.com/sg/wp-content/uploads/sites/6/2025/10/EN_advanced_manual-2025.pdf)

The Mewtwo ex and Mew ex 30C collector-number correction is already covered
by distinct local English prints. Smeargle UD and the remaining partial
Ability refactors still need their own gameplay reviews.

Verification covered 559 compatible saved states including 401 active states.
All 3,635 sampled opening outcomes matched after omitting the new saved
Supporter count from the comparison. The count and Hop knockout marker
round-trip in the compact snapshot test. Two active puzzles included Delphox.
None in the compared active corpus included the affected Magnezone or Hop
cards. Four recorded solutions and Revenge of the Assassin reached human
wins. The packaged simulator passed ten browser regression checks. The full
card suite plus the corrected Grand Tree fixture rerun passed 7,032 tests.
Seven catalog or metadata assertions also fail on the pre-batch baseline.

## Gameplay re-audit, batch 3

Smeargle UD Portrait resolves a Supporter’s effect through its own play path.
It can copy before or after a real Supporter play. Bother and Hitmontop’s
Tornado Kick only react to an actual play. A choice is required when the
revealed hand contains a Supporter. If the chosen effect’s cost is impossible,
the copy resolves without that effect. Lt. Surge’s Strategy still sets a
three-Supporter limit, and Misty’s Vitality resolves its Energy prompts and
ends the turn. [Official Portrait card](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/hs_undaunted.pdf)
[Pokémon’s Portrait ruling](https://www.pokemon-card.com/rules/faq/search.php?page=920&regulation=all&sc_group_id=849%2F1000)
[Misty’s Vitality card text](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/me05/80/)

Engineer’s Adjustments and Misty’s Vitality were falling back to Item in the
fork. Their definitions now register as Supporters, including Misty’s full-art
print. [Official Engineer’s Adjustments](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/hs-unleashed.pdf)

An executable catalog check found 60 print identities affected by the legacy
subtype field before this batch. The repaired cards account for three of the
60. The read-only scan found four active records with Misty’s card and two of
those also contain Fossil Excavation Site M5. Fossil Excavation Site is in the
opponent’s deck and discard in both records. Review its registered definition
against the alternate source and run real Stadium placement and fossil
selection before applying that fix. [Official Fossil Quarry Stadium](https://www.pokemon.com/uk/pokemon-news/discover-more-cards-from-the-pokemon-tcg-mega-evolution-pitch-black-expansion)

Across 559 compatible saved states, 3,631 of 3,635 sampled opening actions
matched exactly. The four differences were two copies of Misty using the
Supporter allowance and two Crispin prompts ordering the deck differently
when Misty is classified as a Supporter. On the current published House of
Dragon snapshot, Quick Ball finds Latias, Crispin and Red Assist power Latios,
and Escape Rope brings Latios Active for Destructive Drake. The puzzle wins
in 14 actions and prompt resolutions. Breaking Through the Wall wins from its
current published snapshot, and the other three previously recorded solutions
still reach wins.

## Gameplay re-audit, batch 4

Fossil Quarry now plays as a Stadium while keeping its saved `Fossil Excavation
Site M5` identity. Its once-per-player search takes up to two Antique Items,
limited by Bench capacity, then shuffles even after a zero-card choice. Trainer
fossils with the existing `isFossil` role now count as Pokémon in their field
slots, including for evolution. Skull Fossil's Spiky Skull uses the engine's
Ability-sourced counter effect, including after a Knock Out, so Ghost Veil can
prevent it. Skull and Shield both discard their attached cards when their own
printed discard action removes them from play. Skull, Shield and Helix also
reject Special Conditions applied by Abilities, verified against Toxic Powder
with a normal Pokémon as the control.
[Official Fossil Quarry Stadium](https://www.pokemon.com/uk/pokemon-news/discover-more-cards-from-the-pokemon-tcg-mega-evolution-pitch-black-expansion)
[Official Antique Skull Fossil](https://www.pokemon.com/fr/jcc-pokemon/cartes-pokemon/series/me05/73/)

Fossil Quarry also exposed the older `c304e3028` Antique Helix Fossil fix,
which predates the initial sync window. The fork had a Pokémon definition with
Trainer supertype and no Item actions. Its original `Antique Helix Fossil MEW`
identity is now an Item outside play. Its Active-only Helical Swell blocks
Stadiums played from the opponent's hand, and its discard action clears the
entire Pokémon slot. [Official Antique Helix Fossil](https://www.pokemon-card.com/card-search/details.php/card/43475/regu/all)

All 3,635 sampled opening actions matched across 559 compatible snapshots
for the Quarry, Skull and Shield changes. The final revision also checked all
16 sampled actions in the two snapshots containing fossil-related cards; no
snapshot contained Antique Helix Fossil. Five recorded solutions reached a
human win, including the House of Dragon trace from the current published state.
The 16 focused cases pass on this revision. Fifteen fail on the old code and
the normal-Pokémon Poison control passes on both.

The original catalog sync ledger at `7a6f5e50e` recorded 35 commits whose
subject begins with `fix`. Eight were fully deferred and ten were partial.
The first re-audit batches expanded the ledger to 38 such commits and reduced
the fully deferred count to three by this point. The count is by commit and
includes frontend and import changes. Additional gameplay fixes can appear
in multi-file commits, refactors or history before the sync window. Remaining
legacy Trainer subtype definitions need review against the actual card classes and
printed rules. In particular, Technical Machine TS-1 and TS-2 are a separate
historical Trainer class and should not be reclassified as Pokémon Tools.
[Call of Legends rulebook](https://assets.pokemon.com/assets/cms/pdf/tcg/rulebooks/Call_of_Legends_Rulebook.pdf)


Dual Stadium discard rendering was already covered by the local Delta Reign
port. When a new Stadium replaces Legendary Pyroduct, both halves go to the
old owner's discard. The packaged Angular UI shows the two halves together
only in the shared Stadium slot, then as separate cards in either player's
discard dialog. The ledger now classifies `450a3e6a5` as already present.
The other two wholly deferred `fix` entries concern the shared reveal/from-hand
changes and the Aura Seeker imports.

## Gameplay re-audit, batch 5

Show Cards now distinguishes the viewer from the card owner, including where
a deck effect has already moved the cards into a temporary list. Own reveals
such as Arc Phone use the effect label. Hand Scope keeps the opponent label.
The optional source identifier is compatible with existing prompts.
[Arc Phone print](https://assets.pokemon.com/assets/cms2/img/cards/web/SWSH11/SWSH11_EN_152.png)
[Hand Scope print](https://assets.pokemon.com/assets/cms2/img/cards/web/XY4/XY4_EN_96.png)

Trick Shovel offers only decks with a top card. Its confirmation shows that
card and waits for the discard decision. Declining leaves the deck order intact.
If both decks are empty, the Item cannot be played. Sandshrew FST and Rockruff
JTG share the confirm path for Dig It Up. The attack can finish with an empty
deck. [Trick Shovel print](https://assets.pokemon.com/assets/cms2/img/cards/web/XY2/XY2_EN_98.png)
[Sandshrew print](https://assets.pokemon.com/assets/cms2/img/cards/web/SWSH8/SWSH8_EN_131.png)
[Rockruff print](https://asia.pokemon-card.com/ph/card-search/detail/17931/)

Thirteen focused reveal tests pass, including twelve that failed on the
baseline. The wider targeted suite passed 154 engine tests and 207 Angular
service and component tests. All 3,635 sampled opening actions matched across
559 compatible snapshots, including 401 active states. Five recorded solutions
reached a win. The attested production build also contains the final fossil
condition fixes from batch 4. In the packaged simulator, mouse play of Trick
Shovel kept its top card visible after the old timeout and left it on top after
declining. On a touch-sized browser, tapping the hand card and Excited Dive
put Talonflame ex directly onto the Bench.

The last fully deferred commit named `fix`, `214480db8`, reformats import
blocks already present locally. It does not address the M7 mechanics. The
first-action probe reproduced Rapid Strike Urshifu damaging both Benched
Pokémon before the required Water Energy was discarded. Both Urshifu attacks
skip a qualifying Luminous Energy when offering the optional discard. The
Japanese scans also omit the legacy Strike banners that the local definitions
grant. A read-only query found no known M7/FLO identities from these five cards
in the 559 comparable puzzle snapshots. Their original gameplay change
`cfd71b70` stays open for actual fixes.
[Official Aura Seeker preview](https://www.pokemon-card.com/ex/m7/index.html)
[Single Strike Urshifu M7 049](https://www.pokemon-card.com/ex/m7/assets/images/card/m7-049-pk5dw.webp)
[Rapid Strike Urshifu M7 050](https://www.pokemon-card.com/ex/m7/assets/images/card/m7-050-zbsr3.webp)

## Gameplay re-audit, batch 6

Wicked Blow and Torrential Strike offer one optional selection from the
attacker's currently eligible Energy. Their bonuses require the selected card
actually to be discarded. This uses effective typing for standard Energy,
Luminous Energy, Blend Energy and Unit Energy, and respects Colorless overrides
such as Temple of Sinnoh. Rapid Strike Urshifu applies its 40 damage to each
unprotected opposing Benched Pokémon after the Active hit and before any Knock
Out or Prize processing. Genome Hacking uses the copying Pokémon's own attached
Energy. The printed M7 Urshifu do not have the old Strike designations. Their
existing `FLO` saved names still resolve.
[Single Strike Urshifu M7 049](https://www.pokemon-card.com/ex/m7/assets/images/card/m7-049-pk5dw.webp)
[Rapid Strike Urshifu M7 050](https://www.pokemon-card.com/ex/m7/assets/images/card/m7-050-zbsr3.webp)
[Luminous Energy print](https://asia.pokemon-card.com/sg/card-search/detail/7003/)

Meowth's Pay Day draws after damage. Persian's Greedy Slash computes its
printed multiplier while retaining other attack modifiers. Large Coin still
requires at least two Pokémon with Pay Day in play and consumes its turn use.
The Choose Energy dialog clears a prior selection and disables OK until the
requested Energy is selected. Its Cancel action declines the optional cost.
[Official Aura Seeker card preview](https://www.pokemon-card.com/ex/m7/index.html)

All 21 focused Aura Seeker checks pass, compared with 5 on the baseline. The
broader suites passed 134 engine tests and 208 Angular tests. Packaged browser
checks demonstrated paid and declined discards, the initial disabled OK state,
and the expected damage and Energy movement. All 3,635 sampled opening actions
matched across 559 comparable saved states. Five recorded solutions reached wins.

Metagross M4 and CRI need a separate treatment. The official Metallic Hammer
ruling allows a Slowking copying the attack to add 150 with no Metal Energy.
If it has any Metal Energy, it must discard the available amount up to the
printed three. Also check both registered prints against the official 180 HP,
one-Metal Bounce Back and the opponent's choice of replacement. The baseline
reproduces 150 damage and no discard when Slowking copies either registered
Metagross with zero or one Metal Energy.
[Metallic Hammer ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A1%E3%82%BF%E3%83%AA%E3%83%83%E3%82%AF%E3%83%8F%E3%83%B3%E3%83%9E%E3%83%BC&regulation_faq_main_item1=all)
[Chaos Rising Metagross](https://asia.pokemon-card.com/sg/card-search/detail/25252/)

## Gameplay re-audit, batch 7

Metagross M4 and CRI share the printed 180 HP and one-Metal Bounce Back. The
opponent chooses the replacement during Bounce Back, and protection can stop
the switch. Metallic Hammer adds 150 on confirmation and then discards
available Metal Energy up to three units. The cost prompt counts effective
Energy types and uses the actual attacker for copied attacks. Both existing
saved card identities are retained. This corrects the Metagross portion of
upstream `c1f7775ef`, which still has 170 HP and assigns the switch choice to
the attacker. The other changes from that commit have their own review history.
[Official Chaos Rising card](https://asia.pokemon-card.com/sg/card-search/detail/25252/)
[Official Metallic Hammer ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A1%E3%82%BF%E3%83%AA%E3%83%83%E3%82%AF%E3%83%8F%E3%83%B3%E3%83%9E%E3%83%BC&regulation_faq_main_item1=all)

Mega Eelektross ex applies Disaster Shock's damage before its optional
Paralysis. A Pokémon copying the attack can choose the effect with zero
Lightning Energy, or discard its available Lightning up to two units. The
existing prevention check still applies to the original defender. Split Bomb
takes as many opposing targets as are available up to two, with Weakness and
Resistance applying to the Active as printed.
[Official English card](https://asia.pokemon-card.com/sg/card-search/detail/24847/)
[Official Disaster Shock ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A1%E3%82%AC%E3%82%B7%E3%83%93%E3%83%AB%E3%83%89%E3%83%B3ex&regulation_faq_main_item1=all)

All 24 focused tests pass, compared with four on the prior engine. The wider
targeted suite passed 116 tests. All 3,635 sampled opening actions matched
across 559 comparable snapshots. The five recorded puzzle solutions still win.
A read-only scan found 13 active saved states with Metagross, and one had it
in play. The same Night Stretcher into Dusknoir Cursed Blast line won that
saved draft under both engines. The attested production package passed the
mobile budget and all ten standard mouse and touch board checks.
In the same package, declining Metallic Hammer with a mouse kept all Energy
and dealt 150 damage. Confirming and choosing three Metal on a touch viewport
discarded them and dealt 300 damage.

## Gameplay re-audit, batch 8

Delibird MEE's Energizing Present lets the player choose zero or one Energy
from the cards looked at, including Special Energy. It shows the looked-at
cards to the player even if none are eligible. The selected card is revealed
before it moves into hand. Only the looked-at remainder is shuffled and
returned to the bottom, including when the player selects zero. The engine
retains the original order of the rest of the deck.
[Delibird print](https://www.pokemon-card.com/card-search/details.php/card/50460)
[Official Energizing Present ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E5%B1%B1%E6%9C%AD&page=4&regulation=all)

Gimmighoul SSP, Durant SIT and both Hisuian Lilligant VSTAR prints now wait
for the reveal before moving selected cards into hand, then shuffle. Their
private deck searches still permit selecting zero. Gimmighoul and Durant
now use the existing shared attack search routine. Team Rocket’s Proton
asks for cards to go into the hand, which matches the destination used by
the engine.
[Gimmighoul print](https://asia.pokemon-card.com/my/card-search/detail/16662/)
[Durant print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/swsh12/13/)
[Hisuian Lilligant VSTAR print](https://asia.pokemon-card.com/sg/card-search/detail/2286/)
[Official Team Rocket deck guide](https://www.pokemon.com/uk/strategy/pokemon-tcg-scarlet-violet-destined-rivals-battle-pass-deck-strategies)

All 28 focused tests passed, compared with 22 on the prior revision. The
broader targeted suite passed 101 tests. Of 3,635 opening actions across
559 comparable saved states, 3,633 matched exactly. The only two differences
were Proton's prompt labels. Gimmighoul’s zero-card and two-card branches in
When it Rains, it Pours! ended in the same game state under both engines
with the same shuffle seed. The five standard recorded solutions plus
Revenge of the Assassin reached a human win.
Playing Proton on both affected saved boards also produced matching state
after the search. The attested production package passed the mobile budget
and all ten standard mouse and touch board checks. In that same browser
package, a mouse user confirmed zero Energy, and a touch user dragged
Luminous Energy into the selection. Both paths kept the untouched deck
cards ahead of the shuffled group.

## Gameplay re-audit, batch 9

Holon Farmer commits its Supporter play after the hand discard is paid. The
recovery prompt then uses the actual discard pile, so the cost card itself
can be recovered if eligible. The player must take as many eligible cards
as are available up to three Pokémon and three Basic Energy. The Diamond &
Pearl rules update applies to the historical Pokémon wording, including
Pokémon LV.X. The recovery is revealed, put on top, then shuffled. A copied
Holon Farmer uses the copying player’s hand and discard and preserves the
Supporter allowance. Sandbox edits refresh stale payment and recovery choices.
[Holon Farmer print](https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/series/ex11/91)
[December 2005 PUI rulings archive](https://www.pokebeach.com/forums/threads/holon-farmer.55/)
[Diamond & Pearl rules update](https://www.pokebeach.com/news/0507/dprules.pdf)

The shared move reducer now reorders only cards actually moved, preserves
the destination’s other cards, and clears a temporary list after moving it
to the top. Prism Stars still go to the Lost Zone when discarded. This
corrects the deck contents before subsequent draws in effects such as
Lucian.
[Lucian print](https://asia.pokemon-card.com/sg/card-search/detail/12639/)

All 12 focused cases pass. Eleven exposed failures on the prior revision.
A read-only scan found 96 active snapshots containing exact card identities
from the audited deck-movement call sites. No snapshot in this scan contains
Holon Farmer. A played Ciphermaniac’s Codebreaking in Red Card Blunder and
a played Misty’s Psyduck in Love Prevails kept matching deck order and board
state under both revisions.
All 3,635 sampled opening actions matched across 559 comparable states.
A separate check found no Holon Farmer among those 559 snapshots, including
archived rows. Six recorded solutions reached a human win. The controlled
Lucian play reproduced lost top cards and duplicate bottom cards before
the fix, then drew the original top three for each player afterward.
Two older Delibird and Gimmighoul tests now assert the current rulings and
both pass on rerun. Across 7,144 engine cases, the full run plus reruns
leave 7 failures, all reproduced in the previous revision. They cover
catalogue counts, registration and artwork, two Pitch Black print marks,
and a legacy Applin fallback expectation.

The attested production browser package passed the mobile size budget.
A mouse and a touch run each discarded Lightning Energy for Holon Farmer,
then recovered it together with Charmeleon.
All ten standard mouse and touch board checks also passed on that package.

## Gameplay re-audit, batch 10

Four active saved states use the exact identifier `Applin SCR`. The two
published puzzles and two corresponding drafts were created between January 26
registration (`9bee5817a`) and March 25 removal (`f26049196`). Their original
registered card has Spray Fluid for 20 damage. The temporary name fallback
after removal used Destined Rivals' Mini Drain for 10. The catalog restored
the Stellar Crown print in `7a6f5e50e`, preserving the original rules. The
test now covers the exact and numbered identities as well as the old
fallback when the Stellar Crown print is absent. In Festival Finale, a
played Spray Fluid still dealt 40 through Weakness. In Twice in a row?, the
saved deck's Applin still entered play with Spray Fluid after Boom Boom Groove.
[Stellar Crown Applin print](https://asia.pokemon-card.com/sg/card-search/detail/13988/)
[Destined Rivals Applin print](https://asia.pokemon-card.com/sg/card-search/detail/19565/)

The main POP 6 and 7 sets already register the eleven cards from the old
Round 30 overlay. The two Pitch Black Items already register in Pitch Black,
where Crushing Hammer 105 and Energy Switch 107 now carry the J and I
marks from their scans. The inherited Item effects remain the same.
Registry checks cover all English Chaos Rising and Delta Reign collector
numbers, plus the separately registered Japanese prints and Eevee ex MEE.
[Crushing Hammer print](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PBL/PBL_105_R_EN.png)
[Energy Switch print](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PBL/PBL_107_R_EN.png)

The deck-import API passes 24 of 29 cases on both the baseline and candidate.
The five remaining failures concern historical numbered print identities and
fallbacks in Unleashed, Majestic Dawn, Stormfront, Arceus and DPP. The fetched
Twinleaf main remains at `d3d7a0031`.

The full engine suite passed all 7,145 cases in 256 spec files. All 15,750
runtime print identities, classes and ordering matched the baseline, with
the two intended regulation-mark corrections. All 3,635 sampled opening
actions matched across 559 comparable saved states. Six recorded solutions
reached a win. The attested production package passed the mobile budget
and all ten mouse and touch board checks.

## Gameplay re-audit, batch 11

Both deck import endpoints resolve the reviewed numbered variants before the
legacy name fallback. This keeps Aipom 51, Glaceon 20, Haunter 42, Onix 57,
Pupitar 39 and Voltorb 81 on their own attacks and artwork. Manectric and
Ponyta accept their registered Arceus collector numbers and report unknown
numbers without silently selecting another print. The established Electrike,
Tangela and Treecko fallbacks remain. Dialga LV.X DP17 and DP37 each retain
their own artwork when entered with the DP prefix or zero padding. The
previous DP17 test expected the DP37 artwork.
[Aipom 51](https://images.pokemontcg.io/dp5/51.png)
[Glaceon 20](https://images.pokemontcg.io/dp5/20.png)
[Haunter 42](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Arceus.pdf)
[Onix 57](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/UL/UL_057_R_EN.png)
[Pupitar 39](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/hs-unleashed.pdf)
[Voltorb 81](https://images.pokemontcg.io/dp7/81.png)
[Dialga LV.X DP17](https://images.pokemontcg.io/dpp/DP17.png)
[Dialga LV.X DP37](https://images.pokemontcg.io/dpp/DP37.png)

All 30 API tests pass, including the five previously failing cases and a new
round-trip through puzzle state validation. Across 30,610 numbered catalog
inputs, the only 18 differences resolve to the requested collector number.
Metadata lookups agree for all 15,750 registered canonical names.

The current ledger covers 95 upstream commits through `d3d7a0031`. Of the 38
commits titled `fix`, 12 are applied, four were already present, 11 are
inapplicable to the simulator and 11 are partial. None is wholly deferred.
The Ampharos bug was part of the separately tracked shared Ability-effects
refactor, so the title-based count does not measure individual gameplay bugs.

## Gameplay re-audit, batch 12

Hyper Blower respects Ability protection on the opponent's Active Pokémon.
The Ability can be used through protection, but Iron Bundle stays on the
Bench when the switch fails. The opponent can choose a protected Pokémon
from their Bench as the replacement for an unprotected Active. A successful
switch discards the entire Iron Bundle stack and clears the empty slot.
The same card can use its Ability again if it leaves play and returns.
Refrigerated Stream applies its attack lock only to the original defending
Evolution Pokémon, after damage and subject to attack-effect protection.
[Iron Bundle print](https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/series/sv04/56/)
[Official Hyper Blower rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%86%E3%83%84%E3%83%8E%E3%83%84%E3%83%84%E3%83%9F&regulation_faq_main_item1=all)
[Advanced rule E-12](https://asia.pokemon-card.com/my/wp-content/uploads/sites/6/2025/10/EN_advanced_manual-2025.pdf)

Sand Stream and Eerie Beam run protection checks for each recipient.
Ghost Veil and Mega Clefable ex respond to the shared target-side Ability
effect. Shocking Block applies after successful Energy attachment from the
hand, from Charjabug's owner, and includes V-UNION. Stealthy Hood and Fusion
Strike Energy use ownership for explicitly attributed Ability counters.
Legacy counter effects without an identified power retain their existing
behavior until their callers can supply the source. Torrential Heart's
bonus requires placement of its own five counters.
[Team Rocket's Tyranitar](https://asia.pokemon-card.com/sg/card-search/detail/19642/)
[Orbeetle VMAX](https://images.pokemontcg.io/swsh4/21.png)
[Mega Clefable ex](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/me03/119)
[Radiant Charjabug](https://www.pokemon.com/us/pokemon-news/mewtwo-vstar-rotom-vstar-and-more-in-pokemon-tcg-crown-zenith)
[V-UNION rule](https://www.pokemon.com/static-assets/content-assets/cms2/pdf/trading-card-game/rulebook/par_rulebook_en.pdf)
[Feraligatr](https://asia.pokemon-card.com/sg/card-search/detail/12131/)

Iron Jugulis responds to a positive attack hit in the Active Spot once,
including a lethal hit. Orthworm ex can also respond from the Bench and
places two counters per effective Metal Energy on the Pokémon that attacked
it. Zero damage and unrelated targets produce no retaliation. The local
Orthworm fix corrects the one-counter multiplier in upstream `49205ef174`.
[Iron Jugulis](https://asia.pokemon-card.com/sg/card-search/detail/12229/)
[Orthworm ex](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/sv07/162/)
[Official Orthworm ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%9F%E3%83%9F%E3%82%BA%E3%82%BAex&regulation_faq_main_item1=all)

In Grimothy Snarlson, both revisions promote Pidgeot ex and discard the same
Iron Bundle and Air Balloon with the same Prize counts. The updated Bench
slot clears the previous 90 damage. In Bundle of Joy, both revisions reject
Hyper Blower from the Active Spot with no opposing Bench.
Both puzzles were also solved from their published snapshots on both
revisions. The Grimothy Snarlson replay uses Hyper Blower to free the Bench
slot and takes all five Prizes in 23 steps. Bundle of Joy knocks out
Bloodmoon Ursaluna ex in 31 steps. The two solutions are saved under
`tools/.puzzle-playthrough` alongside the prior local replays.

All 25 focused checks pass. Eighteen reproduce failures on the prior
revision. The read-only comparison accepted all 559 compatible saved
states with identical serialized state and card identities. The expanded
validator response differs only by the new Iron Bundle marker metadata.
In the opening-action comparison, the three changed outcomes out of 3,635
were all Hyper Blower. One was from a nondeleted puzzle.
Rechecking the 40 snapshots containing an Iron Bundle print on the final
revision reproduced the same three changes, limited to empty-slot damage
and discard entries. The full engine suite passed all 7,170 cases in
257 files. The production package passed attestation and the mobile budget.
All ten standard packaged mouse and touch checks passed. Four additional
packaged mouse and touch checks covered Hyper Blower on the actual
Grimothy Snarlson board and a copy with a Ghost Veil Active.

The next Ability paths are still open. A real-store probe confirmed that
Toxic Powder poisons an opposing Ghost Veil Shuppet because the existing
condition effect identifies the recipient's side as the source. The other
verified paths in the three Ability refactors remain listed separately in
the ledger. Greninja XY's Mist Slash still needs review through the damage
pipeline.
[Brute Bonnet](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/sv04/207)

## Gameplay re-audit, batch 13

Special Conditions from the reviewed Abilities carry the Ability owner's
identity through protection checks. Toxic Powder still poisons Brute
Bonnet's own Active while Ghost Veil, Stealthy Hood, Fusion Strike Energy and
Mega Clefable ex can protect the opposing Active. Only the conditions that
reach their targets update the corresponding damage or coin-flip settings.
Drapion VSTAR's Hazard Star places three counters per Pokémon Checkup.
Wafting Scent checks effective Grass Energy and pays the discard before the
conditions take effect.
[Brute Bonnet](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/sv04/207)
[Drapion VSTAR](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/ss-series/swsh11/119/)

The reviewed hand-evolution Abilities use the accepted evolution event.
Hyper Hypnosis keeps its printed optional choice, and Bug Transmission and
Charmed Charm wait for accepted attachments from hand. Incandescent Body,
Effect Spore and Spiteful Spirit check the actual attacker and its
protection. Block checks suppression from Snorlax's side. Volt Tackle now
executes its independent self-damage. Mareep CRZ is an Evolving Skies
reprint and retains its existing attacks.
[Dustox](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/sm8/28/)
[Pokemon GO Snorlax](https://www.pokemon.com/br/pokemon-estampas-ilustradas/cartas-de-pokemon/series/pgo/55)

All 70 focused tests pass, including 42 that failed against the previous
engine. Saved-state comparison accepted the same 559 snapshots, including
401 nondeleted entries. Serialized states, card names and the expanded
validator state all matched. In Absol clutch, Adrena-Brain moves exactly
six counters onto Mega Kangaskhan ex, Subjugating Chains promotes and
poisons Mega Absol ex, and Terminal Period takes the remaining two Prizes.
The published puzzle reaches a win in seven actions on both revisions.
All eight recorded solutions reached a win in the rebuilt browser engine.
All 3,633 sampled opening actions matched across the 559 comparable saved
states. The full engine suite passed 7,240 tests in 258 files. The attested
production package passed the mobile size budget and all ten packaged
mouse and touch board checks.

The ledger still tracks open Ability paths. Direct Energy movement from
hand by card effects needs separate review for attachment notifications.
The Empoleon V path in `3348ebdc8` also needs review: the current probe
wrongly exempts a non-Rule-Box Basic when Empoleon itself has a Rule Box.
Greninja XY's Mist Slash remains open under `49205ef174`.

## Gameplay re-audit, batch 14

Emperor's Eyes checks each opposing Basic in play, including the Bench. It
removes the Ability from power queries and blocks its execution when the
recipient lacks a Rule Box and has no applicable protection. It checks
Empoleon V's own suppression as the owner, so Path to the Peak turns the
lock off. All three Battle Styles printings inherit the fix. The Rule Box
check shares the existing Path to the Peak card-level rules, including the
older lowercase ex exception. Thirteen focused checks passed.
Eight of those checks failed on the prior revision. The 559 compatible
saved states and 3,633 sampled opening actions matched the previous engine.
All eight recorded solutions reached a win. The full suite passed 7,253
tests in 259 spec files. The Emperor's Eyes and Special Condition tests
also passed with the local in-progress engine changes overlaid.
The attested production package passed its mobile size budget and all ten
mouse and touch board checks.
[Empoleon V print](https://asia.pokemon-card.com/sg/card-search/detail/1186/)
[Official Rule Box definition and Snorlax ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%AB%E3%83%BC%E3%83%AB%E3%82%92%E6%8C%81%E3%81%A4%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3&regulation=all)

The published What a mischievous lock! opening behaved identically on both
revisions. With one card in hand, Klefki blocked Mew ex's Restart. Counter
Catcher then promoted Pidgeot ex, and Restart drew three cards. This was
an opening playthrough and had no terminal result. The competing-lock
case remains open. The rules give the first player priority when Empoleon V
and Klefki both start Active, and the local reproduction still shows Klefki
keeping Mischievous Lock in that position. The earlier activation must also
remain authoritative after a switch or snapshot restore.
[Official Empoleon V and Klefki ruling](https://www.pokemon-card.com/rules/faq/search.php?page=10&regulation=all&sc_group_id=871)

Mist Slash remains open. The local Greninja XY dealt 100 into printed Water
Weakness and zero into an existing defending damage-prevention effect;
both should be 50. Mew SW copying Mist Slash dealt 30 through Psychic
Resistance instead of 50. Live Liepard Gentle Bite correctly prevents its damage
because it affects the attacker. A normally played Muscle Band increased
Mist Slash to 70, and Focus Sash still saved a full-HP Fighting Pokémon
from a lethal hit. The upstream attack-index change moves damage outside
the normal calculation and would drop existing attacker-side modifiers.
The follow-up must preserve damage modifiers on Greninja and effects that
resolve after damage while bypassing modifiers on the defending Pokémon.
[Official Mist Slash rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%B2%E3%83%83%E3%82%B3%E3%82%A6%E3%82%AC&page=11&regulation=all&regulation_faq_main_item1=all)
[Official Focus Sash ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%AE%E3%83%A9%E3%83%86%E3%82%A3%E3%83%8AEX&regulation_faq_main_item1=all)

## Gameplay re-audit, batch 15

The verified Active Ability interactions cover Empoleon V, Klefki, Flutter
Mane, Galarian Weezing and Wobbuffet, including their inherited printings.
When two Abilities can suppress each other at setup, the first player's
Ability takes precedence. During play, the earlier Active takes precedence
when both Abilities can suppress each other, including after switching and
restoring a compact snapshot. Older snapshots that contain two suppressors
and lack their activation history use the current turn player as the
fallback. The engine now promotes the player due to act next first when
both Active Pokémon are Knocked Out at the same time.
[Official Empoleon V and Klefki ruling](https://www.pokemon-card.com/rules/faq/search.php?page=10&regulation=all&sc_group_id=871)
[Official Empoleon V and Wobbuffet ruling](https://www.pokemon-card.com/rules/faq/search.php?page=2&regulation=all&sc_group_id=515)
[Advanced rulebook, D-1](https://asia.pokemon-card.com/sg/wp-content/uploads/sites/6/2025/10/EN_advanced_manual-2025.pdf)

All 12 focused cases pass. Seven fail on the previous engine. The existing
Emperor's Eyes, Hide n Sneak and copied-Ability suites also pass. The
precedence changes preserve the previous handling of target protection for
Klefki, Flutter Mane and Weezing. The direct Flutter Mane and Hide n Sneak
interaction has no verified ruling in this audit. The other legacy
suppression sources and Greninja XY's Mist Slash remain open.

Real Bench plays exposed a timing regression during review. Ruler's Roar
and Mind Report are in-play Abilities. Their older handlers probe before
placement, so the engine now checks them as entering the Bench. Excited
Dive is a hand Ability even when its resolution moves Talonflame ex to the
Bench. Neutralizing Gas permits it and Bide Barricade blocks it. The focused
checks use the normal PlayCardAction and inspect the resulting board and
prompts.
[Advanced rulebook, E-06](https://asia.pokemon-card.com/sg/wp-content/uploads/sites/6/2025/10/EN_advanced_manual-2025.pdf)
[Mega Rayquaza ex print](https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/series/me06/141/)
[Official Talonflame ex hand-Ability ruling](https://www.pokemon-card.com/rules/faq/search.php?page=5&regulation=all&sc_group_id=728%2F1000)

Final verification passed all 20 focused cases and all 7,273 engine tests
in 260 files. The validator kept the same 559 compatible saved states and
all 3,633 sampled first actions matched. Seven recorded solutions reached
wins. The published openings for You've Got Mail!, Cursed Blast, and What a
mischievous lock! verified suppression and recovery after switching. The
attested production package met the mobile size budget and passed all ten
mouse and touch checks.

## Gameplay re-audit, batch 16

The shared survival check now treats damage equal to HP as lethal before
applying a 10 HP survival effect. Surviving Pokémon clear the provisional
attack-damage Knock Out record. The historical upstream change
`3323d3aae` added the strict greater-than comparison, which is still present
at `d3d7a0031`.

Real attacks reproduced two incorrect Knock Outs. Trinity Nova dealt exactly
200 damage to a full-HP Pikachu ex with Resolute Heart, and Talon Hunt dealt
exactly 150 to a full-HP Machamp with Focus Sash. Both now leave 10 HP and
award zero Prizes. The overkill control still saves Machamp and discards
Focus Sash, and the pre-damaged Pikachu ex control still gives two Prizes.
[Official Pikachu ex print](https://www.pokemon-card.com/card-search/details.php/card/47157/regu/all)
[Official Focus Sash print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/xy3/91/)

The full suite passed 7,277 engine tests across 261 files. All 559 compatible
saved states and 3,633 sampled actions matched the previous engine. Seven
recorded solutions reached wins. The attested production package met the
mobile size budget and all ten mouse and touch checks passed.

The next provenance cases are under `bc849aeed`. Actual attacks showed that
Oh No You Don’t missed a live Benched Pecharunt ex when the historical player
flag was false. It also incorrectly reduced Prizes with a stale true flag
and after the explicit Knock Out effect from Frenzied Gouging. The official
Phantom Dive ruling requires three Prizes when Munkidori ex takes lethal
attack damage and Pecharunt ex is Knocked Out by counters in the same attack.
[Official Munkidori ex print](https://asia.pokemon-card.com/ph/card-search/detail/13759/)
[Official simultaneous Knock Out ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A2%E3%83%A2%E3%83%AF%E3%83%AD%E3%82%A6ex&regulation_faq_main_item1=all)

## Gameplay re-audit, batch 17

Munkidori ex, Mega Gengar ex, Legacy Energy, Gift Energy, Amulet of Hope,
Hero's Medal and Island Challenge Amulet now check which opponent's attack
actually dealt lethal damage to the target. Phantom Dive's damage counters
and Frenzied Gouging's Knock Out effect do not trigger these effects.
A simultaneous Knock Out retains the Pokémon that were in play before
removals, so Munkidori ex can use the actual Pecharunt ex in that group.
Phantom Dive takes three Prizes in the official Munkidori ex and Pecharunt
ex case. Shadowy Concealment applies once per Knock Out across copies and
can combine with Oh No You Don’t or Legacy Energy. A zero-Prize Knock Out
cannot subtract Prizes from another simultaneous Knock Out.
[Official Munkidori ex and Phantom Dive ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A2%E3%83%A2%E3%83%AF%E3%83%AD%E3%82%A6ex&regulation_faq_main_item1=all)
[Official Mega Gengar ex print](https://asia.pokemon-card.com/sg/card-search/detail/21904/)
[Official Legacy Energy print and rulings](https://asia.pokemon-card.com/sg/card-search/detail/12648/)

Gift Energy draws during the Knock Out. Amulet of Hope searches, moves the
chosen cards, and shuffles before Prizes are taken. Existing snapshots
with pending legacy markers can still resolve them. A Hero's Medal or
Island Challenge Amulet referenced by both attachment lists applies its
HP and Prize changes once. Two physically distinct Island Challenge Amulets
under Theta Double each apply their modifier. Standard Knock Outs discard
each physical Tool once even if an older slot has both references.
[Official Gift Energy print](https://asia.pokemon-card.com/ph/card-search/detail/2768/)
[Official Amulet of Hope print](https://www.pokemon-card.com/card-search/details.php/card/46438)
[Official Hero's Medal print](https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/series/swsh4/201)
[Official Island Challenge Amulet rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%81%97%E3%81%BE%E3%82%81%E3%81%90%E3%82%8A%E3%81%AE%E3%81%82%E3%81%8B%E3%81%97&regulation_faq_main_item1=all)

Verification passed all 26 focused cases. The prior engine failed 19 of
those cases and passed the seven controls. All 7,303 engine tests passed
across 262 files. The validator matched all 559 compatible saved puzzle
states and all 3,633 sampled opening actions. Seven recorded solutions
reached wins. The attested package met the mobile size budget and passed
all ten mouse and touch checks.

Amulet of Hope opens its search during the Knock Out and resolves it
before Prizes. The shared ordering of physical discard and asynchronous
Knock Out prompts still needs review. So does the timing of Ability
suppression when its source leaves play in the same Knock Out group.

Heavy Baton remains open. Real attacks reproduced its prompt with a
Retreat Cost modified to five, an explicit Knock Out, and a Benched
holder. The prompt also requires a single destination and permits zero
transfers. The printed rule requires a Retreat Cost of exactly four on the
Active, allows splitting Basic Energy across the Bench, and requires a
transfer when a legal move is available.
[Official Heavy Baton print](https://www.pokemon-card.com/card-search/details.php/card/45283/regu/all)
[Official Heavy Baton rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%86%E3%83%84%E3%83%8E%E3%82%AB%E3%82%A4%E3%83%8A&regulation_faq_main_item1=all)

## Gameplay re-audit, batch 18

Heavy Baton uses a Retreat Cost of exactly four after modifiers. It requires
a transfer when at least one Basic Energy and a legal Benched recipient are
available, and it allows splitting up to three Energy across the Bench.
Wishful Baton sends its Energy to one Benched Pokémon. Both use the Active
position at the time of opposing attack damage, so a forced switch after
lethal damage still permits the effect. A Tool lock that applies when the
Knock Out resolves can block a Baton. Gravity Gemstone adds one to Retreat
Cost per physical Tool, including the official Revavroom ex ruling with
three copies.
[Heavy Baton rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%98%E3%83%93%E3%83%BC%E3%83%90%E3%83%88%E3%83%B3&regulation_faq_main_item1=all)
[Wishful Baton rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%81%AD%E3%81%8C%E3%81%84%E3%81%AE%E3%83%90%E3%83%88%E3%83%B3&regulation_faq_main_item1=all)

Exp. Share is optional per copy and transfers one Basic Energy. The turn
player chooses the order of competing Tool effects for the same Knock Out
under the February 2026 rules update. Each card's owner makes that card's
transfer choice with the Energy left after earlier transfers. This allows
two Wishful Batons under Theta Double to move four Energy. Huntail checks
effective Water type and returns only the remaining Basic Water Energy.
Gift Energy and Amulet of Hope finish their draws or search before discard.
PrizeMap's optional deck-search rule permits zero cards for Amulet of Hope.
The official search rule requires at least one card from a nonempty deck.
Tyranitar-GX's Lost Out checks the actual attacker and sends the remaining
attachments to the Lost Zone after transfers. Lost City's discard preserves
attachments that older saves stored only in the separate attachment lists.
[Exp. Share print](https://www.pokemon-card.com/card-search/details.php/card/43122)
[Huntail print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/sv10/55/)
[Knock Out timing, rule E-04](https://asia.pokemon-card.com/hk-en/wp-content/uploads/sites/6/2022/08/advanced-manual_EN.pdf)
[Official February 2026 rules update](https://professorprogram.pokemon.com/news/11473085)
[Tyranitar-GX print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/sm8/121)

The 26 focused cases all passed. The preceding engine failed 23 and passed
three controls. All 7,329 engine tests passed across 263 files. An isolated
build with the checkout's pending simulator changes applied passed 105
focused and simulator tests. All 559 compatible saved states and 3,633
sampled opening actions matched. Seven recorded solutions reached wins.
The five-step published BloodMoon Trick opening matched on both engines.
The current Retreat Cost was two before Counter Catcher removed the
Gravity Gemstone holder from the Active Spot and one afterward.
The production package met the mobile size budget and passed all ten
mouse and touch checks. The built client engine offered both valid Tool
orders to the human and reached a win after either choice.

The selected ordering applies to registered effects on the same Knock Out.
Applying all effects across a simultaneous group before any removal remains
part of the wider engine audit.

The next verified failures are in Rescue Energy, Rescue Scarf, Lucky Egg
and Farewell Bell. Rescue Energy and Rescue Scarf leave the Pokémon in
discard when the final Prize ends the game. Rescue Scarf also returns a
Pokémon after Frenzied Gouging. Lucky Egg AR draws after Lost City routes
its holder to the Lost Zone, and misses a lethal Dual Bolt against its
Benched holder. Playing Farewell Bell from hand fails to attach it as a
Tool. Rescue Energy's ruling with Lost Crisis also requires separate
destinations for the Pokémon and its attachments when Rescue Energy
resolves first.
[Rescue Energy rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%AC%E3%82%B9%E3%82%AD%E3%83%A5%E3%83%BC%E3%82%A8%E3%83%8D%E3%83%AB%E3%82%AE%E3%83%BC&regulation_faq_main_item1=all)
[Rescue Scarf print](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/bw_dragons_exalted.pdf)
[Lucky Egg errata](https://play.pokemon.com/fr-ca/resources/documents/tcg-errata/)

## Gameplay re-audit, batch 19

Rescue Energy and Rescue Scarf return the evolution stack before the final
Prize, including after lethal recoil. An explicit Knock Out or damage from
Pokémon Checkup does not trigger either card. The turn player chooses the
order of competing effects on the same Knock Out. If Rescue Energy resolves
before Lost Crisis, the Pokémon goes to hand and the remaining attachments
go to the Lost Zone. Lost City sends only the Pokémon to the Lost Zone if it
wins the ordering choice. Legacy attachment lists preserve physical cards
without duplicating them.
[Rescue Energy rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%AC%E3%82%B9%E3%82%AD%E3%83%A5%E3%83%BC%E3%82%A8%E3%83%8D%E3%83%AB%E3%82%AE%E3%83%BC&regulation_faq_main_item1=all)
[Rescue Scarf rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%AC%E3%82%B9%E3%82%AD%E3%83%A5%E3%83%BC%E3%82%B9%E3%82%AB%E3%83%BC%E3%83%95&regulation_faq_main_item1=all)
[Lost City rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%AD%E3%82%B9%E3%83%88%E3%82%B7%E3%83%86%E3%82%A3&regulation_sidebar_form=all)

Lucky Egg AR checks that its holder actually reached discard. Lucky Egg SSH
uses its own wording and draws even when Lost City sends the holder to the
Lost Zone. Farewell Bell can be attached as a Tool and searches after a
qualifying VMAX Knock Out. Reversal Trigger checks Team Plasma and lethal
damage from the opponent's attack. Both searches retain the simulator's
optional deck-search behavior. Tool Jammer now disables Tools attached to
the opposing Active Pokémon, with the printed exception for Tool Jammer.
[Lucky Egg errata](https://play.pokemon.com/fr-ca/resources/documents/tcg-errata/)
[Lucky Egg SSH print](https://www.pokemon-card.com/card-search/details.php/card/37727/regu/all)
[Farewell Bell print](https://www.pokemon.com/fr/jcc-pokemon/cartes-pokemon/series/swsh8/234/)
[Reversal Trigger print](https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/series/bw10/86)
[Tool Jammer print](https://www.pokemon-card.com/card-search/details.php/card/39194/regu/all)

All 32 focused tests pass. The preceding engine failed 21 of those tests.
The full engine suite passed 7,361 tests across 264 spec files. The isolated
build with the checkout's pending work applied passed 137 focused and
simulator tests. The validator matched all 559 comparable saved states and
3,633 sampled opening actions. Seven recorded solutions reached wins.
The attested production package passed the mobile size budget and all ten
mouse and touch board checks. The packaged browser engine completed both
Rescue Energy and Lost Crisis resolution orders with the expected destinations.

The next probes reproduced five failures across four implementations.
Wish Connector misses Jirachi V's own Knock Out and incorrectly triggers
after Frenzied Gouging. Deep Sea King misses attached Wash Water Energy.
Both tested Energy Grounding printings prompt for a Basic Energy but fail
to attach it to Lanturn. Celestial Storm requires damage from an opposing
attack. Hidden Legends takes Basic Energy from discard after a qualifying
Knock Out and is limited to one use per turn. Ordering across different
Pokémon in a simultaneous Knock Out group remains open.
[Wish Connector rulings](https://www.pokemon-card.com/rules/faq/search.php?page=241&regulation=all&sc_group_id=849%2F1000)
[Deep Sea King print](https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/series/swsh10tg/TG03/)
[Celestial Storm Lanturn print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/sm7/50/)
[Hidden Legends Lanturn print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/ex5/38/)

## Gameplay re-audit, batch 20

Wish Connector now uses the specific Basic Pokémon V Knock Out, including
Jirachi V itself and Benched targets. Each copy can move one remaining
Basic Energy to another Pokémon. Deep Sea King moves any attached card
currently providing Water Energy, including Wash Water Energy, Aurora
Energy and Pokémon attached as Energy. It honors effects such as Temple of
Sinnoh and retains the order of the physical attachments in the prompt.
Moving Splash Energy first prevents its rescue. Resolving Splash Energy
first returns the Pokémon and discards Splash Energy. An ineligible Splash
Energy also discards itself without taking the entire Pokémon stack.
[Wish Connector rulings](https://www.pokemon-card.com/rules/faq/search.php?page=241&regulation=all&sc_group_id=849%2F1000)
[Deep Sea King rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%AD%E3%83%B3%E3%82%B0%E3%83%89%E3%83%A9&page=1&regulation=all&regulation_faq_main_item1=all)
[Moving Holon's Castform as Energy](https://www.pokemon-card.com/rules/faq/search.php?page=1119&regulation=all)
[Splash Energy rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%B9%E3%83%97%E3%83%A9%E3%83%83%E3%82%B7%E3%83%A5%E3%82%A8%E3%83%8D%E3%83%AB%E3%82%AE%E3%83%BC)

Celestial Storm Lanturn uses Energy Grounding once per qualifying damage
Knock Out before discard, including two targets Knocked Out together.
Hidden Legends follows its English print. The Poké-Power can transfer one
Basic Energy from the actual discard pile per opponent turn, even if two
Lanturn are in play. A lethal attack effect with explicit provenance also
qualifies, including Frenzied Gouging and Phantom Dive's counters. Direct
damage-counter mutations without source information still require a
separate review. Both Lightning Strike attacks discard only Energy that
currently provides Lightning and apply the correct damage after the choice.
[Celestial Storm English card text](https://assets.pokemon.com/assets/cms2-ru-ru/pdf/trading-card-game/tcg_sun_moon_7_card_translation.pdf)
[Celestial Storm Energy Grounding rulings](https://www.pokemon-card.com/rules/faq/search.php?page=578&regulation=all)
[Hidden Legends English card text](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/EX_Hidden_Legends.pdf)
[Hidden Legends Energy Grounding rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A9%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%B3&page=2&regulation=all)

The candidate passes all 30 focused regressions. The preceding engine
failed 24 and passed six. The complete engine and client card suites
passed 7,391 tests across 265 files. An isolated build with the pending
simulator work applied passed 167 focused and simulator tests. All 559
comparable saved states and 3,633 sampled opening actions matched. Seven
recorded puzzle solutions reached wins. The attested package met the mobile
size budget and passed all ten mouse and touch board checks. The packaged
client completed both Splash Energy and Deep Sea King effect orders with
the expected destinations.

The next action probes reproduced eight cases across Vengeful Punch, Spell
Tag, Golem FST, Qwilfish CRE and Maractus JTG. Vengeful Punch misses the
Benched holder and places eight counters on the replacement Active after
Hit and Run. Spell Tag misses a Benched Psychic holder and can apply
twice on a non-Psychic holder. Desperate Blast bypasses Ghost Veil and
Bursting Needles triggers on nonlethal damage. Maractus retaliates from the
Bench. Vengeful Punch can also leave a lethally damaged attacker in play
when the attacker takes its final Prize. That case requires checking the
new Knock Out before evaluating both players' win conditions. Ordering
effects across separate Pokémon in the same Knock Out group remains open.
[Vengeful Punch print](https://www.pokemon-card.com/card-search/details.php/card/43944/regu/all)
[Vengeful Punch ruling after the attacker switches](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%A6%25E&page=28&regulation=all)
[Maractus print](https://www.pokemon-card.com/card-search/details.php/card/47221)
[Simultaneous win conditions](https://assets.pokemon.com/assets/cms2-fi-fi/pdf/trading-card-game/rulebook/svi_rulebook_en.pdf)
[February 2026 tiebreaker update](https://professorprogram.pokemon.com/news/11473085)

## Gameplay re-audit, batch 21

Vengeful Punch now places four counters on the original attacker, including
after it switches to the Bench. A replacement Active receives none when the
attacker leaves play. The Tool can trigger from a Benched holder and respects
Tool Jammer. A physical Tool stored in both attachment lists resolves once.
Both Spell Tag printings place exactly four counters after a Psychic holder
takes lethal attack damage. The owner can split those counters across
opposing Pokémon. These Tools still work through Ghost Veil.
[Vengeful Punch print and switching rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%AA%E3%83%99%E3%83%B3%E3%82%B8%E3%83%91%E3%83%B3%E3%83%81&regulation_faq_main_item1=all)
[Spell Tag print](https://www.pokemon-card.com/card-search/details.php/card/35281)

Desperate Blast, Bursting Needles and Explosive Needle require lethal
opposing attack damage to the Active holder. They place Ability-sourced
counters after the complete attack, so Ghost Veil can prevent them. The
official Draining Kiss case heals before Desperate Blast resolves.
[Golem print and healing ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%B4%E3%83%AD%E3%83%BC%E3%83%8B%E3%83%A3&regulation_faq_main_item1=all)
[Qwilfish print](https://www.pokemon-card.com/card-search/details.php/card/39406)
[Maractus print](https://www.pokemon-card.com/card-search/details.php/card/47221)

The turn player can order registered effects across different Pokémon in
the same Knock Out group. The next turn player chooses during Pokémon
Checkup. The engine resolves the queued effects before removing their
holders, then processes any new Knock Outs before awarding Prizes to both
players. It evaluates the ordinary winner once both sides receive their
Prizes, then applies the existing PrizeMap win-condition overrides. Two
fulfilled win conditions beat one. Equal claims start fresh six-Prize
tiebreaker setup, and simultaneous Prizes count for both sides before
checking for a lead. A shortened board that lacks the cards for a new game
ends as a draw. Legacy immediate Knock Out handlers still need review.
[Knock Out sequence and simultaneous win conditions](https://www.pokemon-card.com/assets/document/advanced_manual.pdf)
[February 2026 ordering and tiebreaker update](https://professorprogram.pokemon.com/news/11473085)

All 32 focused cases pass, including 23 failures on the preceding engine.
All 7,423 tests across 266 files passed. The combined source with the
checkout's pending work applied passed 199 focused and simulator tests.
All 559 compatible saved states serialized and loaded identically. The
opening-action comparison matched 3,616 of 3,633 cases exactly. Fifteen
changes were confined to Prize statistic or Bench-reconciliation fields.
An active Poison Chain case awards the opponent a previously skipped
simultaneous Prize and still records the same winner. An archived Frenzied
Gouging case now opens a tiebreaker because both players take their final
Prizes and both have no Pokémon left in play. The prior result gave the
turn player an early win. All seven recorded solutions still reach wins.
The attested production package passed the mobile size budget and all ten
mouse and touch checks. Its browser engine also verified both cross-Pokémon
effect orders and the final Prize case with and without the mustLose rule.

The next attack probes confirmed seven further failures across Gengar CRE,
Manaphy PLS, Komala LOR, Jynx SIT, Reuniclus SIT and Aegislash UNM. Last Gift
and Final Wish trigger after Frenzied Gouging and All Just a Dream incorrectly
withholds the Prize. Selfish Lips fails against an actual Pokémon V,
including Regieleki V after it switches out. Persistent Cells and Durable
Blade leave their holder in discard when the attacker takes its final Prize.
Mantine's Bounce into Arceus V is a passing control for Selfish Lips.

## Gameplay re-audit, batch 22

Last Gift and Final Wish use the exact Knock Out caused by opposing attack
damage. They search and shuffle before the attacking player takes Prizes.
The shared PrizeMap rule lets the owner take zero cards from these searches.
All Just a Dream checks Komala's Sleep after the attack finishes. Selfish
Lips recognizes Pokémon V, VMAX, VSTAR and V-UNION and identifies the original
attacker even after Switching Bolt. Both Abilities prevent any Prizes for
that Pokémon, including the extra Prizes from an attack.
[Gengar print](https://www.pokemon-card.com/card-search/details.php/card/39458)
[Manaphy print](https://www.pokemon-card.com/card-search/details.php/card/28244/regu/DP)
[Komala and Powder Snow ruling](https://www.pokemon-card.com/rules/faq/search.php?page=2&regulation_faq_main=&sc_group_id=740)
[Komala and Whirlwind ruling](https://www.pokemon-card.com/rules/faq/search.php?page=4&regulation_faq_main=&sc_group_id=850)
[Jynx rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%AB%E3%83%BC%E3%82%B8%E3%83%A5%E3%83%A9&regulation_faq_main_item1=all)

Persistent Cells and Durable Blade return the full evolution stack before
Prizes. The turn player can order either Ability with Lost City. Attached
cards follow their own rules. Pokémon acting as Energy are discarded, and
Recycle Energy returns itself after being discarded from play.
[Reuniclus rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A9%E3%83%B3%E3%82%AF%E3%83%AB%E3%82%B9&regulation_faq_main_item1=all)
[Aegislash rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%AE%E3%83%AB%E3%82%AC%E3%83%AB%E3%83%89&regulation_faq_main_item1=all)
[February 2026 ordering update](https://professorprogram.pokemon.com/news/11473085)

All 26 focused tests pass, with 15 failures on the preceding engine. The
full engine passed 7,449 tests in 267 files. The changes combined with the
checkout’s pending work passed 225 focused and simulator tests. All 559
compatible saved puzzle states and 3,633 sampled opening actions matched
exactly. Seven saved solutions reached wins. The attested production package
met the mobile size budget and passed all ten mouse and touch checks. Both
Durable Blade and Lost City orders reached the correct final Prize and card
destinations in the browser engine.

Subsequent real-action probes confirmed six open failures. Spiritomb LOR’s
Cursed Message and Weezing PLS’s Aftermath trigger against Frenzied Gouging.
Arbok HIF’s Last Pattern fails to discard after lethal attack damage.
A Pokémon VSTAR still takes a Prize for Trevenant LOR despite Elder Tree Barrier.
Black Market Prism Star reduces Prizes after Frenzied Gouging. Gengar POR’s
Infinite Shadow fails to return its evolution stack before the final Prize.
The ledger still marks `bc849aeed` partial.

## Gameplay re-audit, batch 23

Cursed Message, Aftermath and Last Pattern all require lethal opposing attack
damage. Cursed Message uses PrizeMap’s existing optional search rule and
shuffles before Prizes. Aftermath discards up to three cards from the top of
the attacker’s deck. Last Pattern discards up to two distinct random cards
from the attacker’s hand before Prizes enter it. The turn player can order
simultaneous Knock Out effects. Emptying the attacker’s deck waits for the
next mandatory draw before it causes a loss.
[Spiritomb print](https://www.pokemon-card.com/card-search/details.php/card/41565)
[Weezing print](https://www.pokemon-card.com/card-search/details.php/card/28255)
[Arbok print](https://www.pokemon-card.com/card-search/details.php/card/36681/regu/all)
[Arbok rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%A2%E3%83%BC%E3%83%9C%E3%83%83%E3%82%AF&regulation_faq_main_item1=all)

Elder Tree Barrier shares Selfish Lips’ original-attacker check and covers
Pokémon V, VMAX, VSTAR and V-UNION. Both Black Market Prism Star catalog names
use the same implementation. Black Market checks the Knock Out before any
Energy is transferred and applies its reduction to the final Prize count.
Glutton-GX still adds two Prizes before the reduction. Draconic Disaster
removes a qualifying Stadium before the Knock Out and sends a Prism Star
Stadium to the Lost Zone.
[Trevenant official expansion rules](https://www.pokemon-card.com/ex/s11/index.html)
[Black Market rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%96%E3%83%A9%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%B1%E3%83%83%E3%83%88)

Infinite Shadow returns the full Gengar evolution stack before Prizes.
It works on the Bench and discards the attachments. Lucky Egg and Infinite
Shadow use the engine’s Knock Out order choice. Choosing Lucky Egg first
draws up to seven before the stack returns, as in the published card ruling.
[Gengar print](https://www.pokemon-card.com/card-search/details.php/card/49682/)
[Gengar rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%B2%E3%83%B3%E3%82%AC%E3%83%BC)
[February 2026 ordering rules](https://professorprogram.pokemon.com/news/11473085)

All 31 focused tests pass. Seventeen fail on the preceding engine. The full
engine passed 7,480 tests in 268 files. The combined pending work passed 256
focused and simulator tests. All 559 compatible puzzle payloads and card
identities matched exactly. Four deserialized states carried the intentional
Gengar Ability text and metadata changes and otherwise matched exactly.
No compatible snapshot contained the old Infinite Shadow marker. All 3,633
sampled opening actions matched. Seven saved solutions reached wins. The
attested package met the mobile size budget and passed all ten mouse and
touch checks. Its browser engine also verified the final-Prize interactions
for Black Market with Glutton-GX and Infinite Shadow with Lucky Egg.

Six further real-action failures are confirmed. Gold Coffin searches after
Frenzied Gouging. Bully of the Sands fails on lethal damage to Active
Krookodile. Revenge incorrectly boosts Stunfisk’s damage after an explicit
Knock Out. Shadowy Side Kick and Butterfly Edge fail to protect their user
after a lethal hit. Stoutland’s Arf Arf Bark can use a stale damage flag
after Frenzied Gouging. These paths are part of the ongoing review.

## Gameplay re-audit, batch 24

Gold Coffin searches and shuffles before Prizes when opposing attack damage
Knocks Out Cofagrigus ex in either position. PrizeMap preserves its existing
optional search rule. Bully of the Sands and Arf Arf Bark offer their optional
discard after an accepted hand evolution or lethal opposing attack damage
to the Active holder. Arf Arf Bark uses the current opposing Active after
any attack switch. It can discard an attached Energy that currently provides
no Energy. Stunfisk’s Revenge uses shared exact Knock Out history and accepts
the legacy marker when a saved state already has it.
[Cofagrigus ex print and rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%87%E3%82%B9%E3%82%AB%E3%83%BC%E3%83%B3ex&regulation_faq_main_item1=all)
[Krookodile print](https://www.pokemon-card.com/card-search/details.php/card/41874/regu/all)
[Stoutland rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A0%E3%83%BC%E3%83%A9%E3%83%B3%E3%83%89&regulation_faq_main_item1=all)
[Stunfisk rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%9E%E3%83%83%E3%82%AE%E3%83%A7&page=4&regulation=all)

Shadowy Side Kick and Butterfly Edge arm protection when the final Knock Out
check confirms lethal damage from the real attack. The protection applies to
the Pokémon that used or copied the attack and expires after the opposing
turn. It blocks damage and attack effects. Shred bypasses the damage
protection. The Robo Substitute case still qualifies with zero Prizes, and
the Bide case at 10 HP leaves protection inactive.
[Marshadow print](https://www.pokemon-card.com/card-search/details.php/card/47765/regu/all)
[Beautifly print](https://www.pokemon-card.com/card-search/details.php/card/35245/regu/all)
[Beautifly rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%A2%E3%82%B2%E3%83%8F%E3%83%B3%E3%83%88&regulation_faq_main_item1=all)

All 25 focused tests pass. Fourteen fail on the preceding engine. The full
engine passed 7,505 tests in 269 files. The combined pending work passed
281 focused and simulator tests. All 559 compatible saved puzzle states
and 3,633 sampled opening actions matched exactly. Seven saved solutions
replayed to wins. The attested production package met the mobile size
budget and passed all ten mouse and touch checks. The browser engine also
confirmed protection for both attacks when copied with Genome Hacking.

Eight additional failures are confirmed. Heads for Guts still allows lethal
damage to discard Heracross BUS and Hariyama FST. Whirlwind’s switch loses the
damage history used by Dhelmise V’s Anchor Anger and Accelgor’s Retribution.
Discarding Benched Robo Substitute incorrectly changes the Active Spot or
clears its effects. Star Order loses its bonus before the Knock Out check.
Beast Bringer grants Prizes for another Pokémon’s attack. Altered
Creation-GX grants an extra Prize for an explicit Knock Out.

## Gameplay re-audit, batch 25

Guts on Heracross BUS and Hariyama FST flips only when final attack damage
would be lethal. Heads leaves the Pokémon at 10 HP before the Knock Out
check and keeps Butterfly Edge from gaining protection. Anchor Anger and
Retribution remember the Knock Out even if Whirlwind moves the victim to
the Bench. Retribution returns the original defender's attached Energy
after dealing damage, including when the defender will be Knocked Out.
Both catalog names for Robo Substitute discard only their own stack and
attachments. Removing it from the Bench preserves the Active Pokémon's
effects. Removing the only Pokémon ends the game without awarding Prizes.
[Heracross print](https://www.pokemon-card.com/card-search/details.php/card/33867/regu/XY)
[Hariyama print and expansion](https://www.pokemon-card.com/products/s/s7.html)
[Beautifly rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%A2%E3%82%B2%E3%83%8F%E3%83%B3%E3%83%88&regulation_faq_main_item1=all)
[Dhelmise V print](https://www.pokemon-card.com/card-search/details.php/card/37614/regu/all)
[Accelgor rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%A2%E3%82%AE%E3%83%AB%E3%83%80%E3%83%BC&regulation_faq_main_item1=all)
[Robo Substitute print](https://www.pokemon-card.com/card-search/details.php/card/30551/regu/DP)

Star Order lasts for the current turn and applies to a qualifying Basic
Pokémon V even after the holder switches or the Tool leaves play. Beast
Bringer requires the actual attacking Ultra Beast to hold the Tool and
have six Prizes remaining. A physical Tool in both legacy attachment lists
counts once. Altered Creation-GX applies its damage and Prize bonuses from
the player even after the original Pokémon leaves play. Its Prize bonus
requires lethal attack damage dealt to an Active Pokémon. Pokémon Ranger
removes both effects while the GX attack remains used.
[Sky Seal Stone rulings](https://asia.pokemon-card.com/hk-en/rules/search/?keyword=Sky+Seal+Stone)
[Beast Bringer print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/sm10/229/)
[Altered Creation-GX rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%91%E3%83%AB%E3%82%AD%E3%82%A2GX&regulation_faq_main_item1=all)
[Altered Creation-GX and Whirlwind ruling](https://www.pokemon-card.com/rules/faq/search.php?page=11&regulation=all&sc_group_id=655)

All 22 focused checks pass, including 15 failures on the preceding engine.
The complete engine passed 7,527 cases across 270 specs in two invocations.
The changes combined with the checkout's pending work passed 303 focused
and simulator checks. All 559 comparable saved states and all 3,633 sampled
opening actions exactly match. Seven recorded solutions replayed to wins.
The attested package met the mobile size budget and passed all ten
mouse and touch checks. Its browser engine verified Star Order taking the
final three Prizes and Guts preventing a puzzle win on heads.

Five open cases have been reproduced for the next review. Tenacious Body
on Mega Hawlucha ex and Durable Body on Annihilape M5 skip the flip if
previous damage makes the incoming hit lethal. Hoppip and Skiploom TRR do
not survive a lethal attack through Buffer. The original Buffer wording
also requires checking how it applies to attack effects that directly cause
a Knock Out. One Aurora Energy currently qualifies for the extra Water
on Altered Creation-GX even though it was used to pay the Metal cost.
Review direct and copied attack costs against the actual Energy paid.
[Mega Hawlucha ex rulings](https://professorprogram.pokemon.com/news/11464646)
[EX Team Rocket Returns official card text](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/EX_Team_Rocket_Returns.pdf)
[Altered Creation-GX print](https://www.pokemon-card.com/card-search/details.php/card/37382/regu/XY)

## Gameplay re-audit, batch 26

Tenacious Body, Durable Body and both registered Buffer Poké-Bodies
resolve a coin flip once final attack damage would Knock Out the holder.
Heads leaves 10 HP. Tenacious Body still works against Shred. The Buffer
errata restricts it to opposing attack damage. Skiploom's Miracle Powder
deals the printed 10 damage before the flip. Hoppip's version has no damage.
Time Crystal suppresses applicable Poké-Bodies on either side of the board.
Toxicroak G's visible Pokémon SP tag preserves its printed exception.
[Mega Hawlucha ex rulings](https://professorprogram.pokemon.com/news/11464646)
[Annihilape print](https://www.pokemon-card.com/card-search/details.php/card/50258/regu/all)
[Hoppip and Skiploom prints](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/EX_Team_Rocket_Returns.pdf)
[Archived April 2005 Buffer errata](https://doczz.net/doc/193314/rulings-compendium-lvx---pokemon-rulings-compendium)
[Dialga G LV.X and Toxicroak G prints](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Platinum.pdf)

Altered Creation-GX now requires a distinct Water unit beyond the
effective attack cost. One Aurora Energy or one Blend Energy cannot
supply both Metal and the extra Water. Double Dragon Energy can supply
both. Cost increases, type changes and the cost of a copying attack are
included. Perfection checks the selected attack's cost. Nine-Tailed
Shapeshifter and Trace use the cost paid by the copying attack.
[Altered Creation-GX print](https://www.pokemon-card.com/card-search/details.php/card/37382/regu/XY)
[Official Nine-Tailed Shapeshifter ruling](https://www.pokemon-card.com/rules/faq/search.php?page=3&regulation_faq_main=&sc_group_id=655)

All 30 focused cases pass, with 17 failures on the preceding engine.
The full engine passed 7,557 tests in 271 specs. The changes combined
with pending work passed 349 focused and simulator checks. All 559
comparable saved states and 3,633 sampled opening actions match exactly.
Seven recorded solutions reached wins. The attested production package
met its mobile size budget and passed all ten mouse and touch checks.
The browser engine verified survival at 10 HP on all four cards and the
two Ninetales V Energy cases from the published ruling.

Seven further red cases are reproduced. Critical Cut grants protection
when Guts saves its target. Sky Hunting fails to switch Staraptor after
lethal damage. Grandiose Fangs fails to grant Sandile's next-turn bonus.
Briar can award Prizes on a later turn and after Technical Machine:
Devolution. Anthea & Concordia can also award Prizes after Devolution.
Legendary Summit can zero the base Prize too early, preventing a legal
Glutton-GX bonus. These cases belong to the ongoing damage Knock Out
review. Runtime inventory also found 73 registered printings whose legacy
`_tags` includes Pokémon SP while the public `tags` field omits it.
Other attack bonuses requiring extra Energy still need individual
verification.

## Gameplay re-audit, batch 27

Critical Cut arms attack protection after a confirmed damage Knock Out.
A target that survives with Guts leaves Golisopod unprotected. A successful
Critical Cut protects from damage and attack effects during the opponent's
next turn. Sky Hunting switches the actual attacker after damage and survival
effects resolve and before the opponent promotes. It also works on a Knock Out
worth zero Prizes. Grandiose Fangs applies its 120 damage bonus to the next
turn's attacks against the opposing Active, before Weakness and Resistance.
The bonus belongs to the Pokémon that actually attacked, including copies,
and clears when the Pokémon switches out or the bonus turn ends.
[Golisopod print](https://www.pokemon-card.com/card-search/details.php/card/50110)
[Staraptor print](https://www.pokemon-card.com/card-search/details.php/card/34169/)
[Sky Hunting ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A0%E3%82%AF%E3%83%9B%E3%83%BC%E3%82%AF&regulation_faq_main_item1=all)
[Sandile print](https://www.pokemon-card.com/card-search/details.php/card/36378)

Briar and Anthea & Concordia apply their bonuses during the turn they are
played and check the attacker and defender recorded for each lethal hit.
A Knock Out through Devolution gives the base Prize count. Legendary
Summit subtracts one after all eligible bonuses have been added. Either
played half produces the same reduction. A regular Colorless Knock Out
can leave zero Prizes, and Glutton-GX against the same target yields two.
[Briar print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/sv07/163/)
[Anthea & Concordia print](https://asia.pokemon-card.com/sg/card-search/detail/24835/)
[Legendary Summit rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E4%BC%9D%E8%AA%AC%E3%81%AE%E5%B1%B1%E9%A0%82&regulation_faq_main_item1=all)

All 19 focused cases pass, with 12 failures on the preceding engine. The
full engine passed 7,576 tests in 272 specs. The changes combined with the
checkout’s pending work passed 404 focused and simulator checks. All
559 comparable saved puzzle states match exactly. Of 3,633 sampled
opening actions, 3,631 match exactly. The two successful Briar actions
differ only by the saved, turn-scoped Prize bonus. Their board, zones,
Prizes, prompts, phase and events agree. Seven recorded solutions still
reach wins. The attested package meets the mobile budget and passed ten
mouse and touch checks. Its browser engine verified winning Prize counts
for Briar and Legendary Summit with Glutton-GX, and the switch after a
copied Sky Hunting. A serialized board retained Briar’s bonus when
reloaded before the attack.

Seven further failures were reproduced. Burning Coat fails to discard
after lethal Blaze Roar. Darkness Wing fails to retrieve the selected
card. Revenge Seed misses a prior lethal attack. Spiteful Spirit misses
the attacker if Whirlwind moves Jellicent after lethal damage. Water
Rescue handles a direct Knock Out and omits the choice to decline.
N's Zekrom's Shred fails to deal damage through Critical Cut protection.

## Gameplay re-audit, batch 28

Burning Coat discards three cards for each opponent's Pokémon Knocked Out by
Entei's attack damage, including Bench damage and a deck-out before the
opponent's draw. Blaze Roar uses the current erratum's two Energy cards on
tails. Darkness Wing offers a choice from the actual attacker's discard after
lethal damage, including a copied attack. Revenge Seed uses the opposing
attack's Knock Out and applies its bonus before Weakness and Resistance.
Spiteful Spirit checks where the defender was when it took damage and poisons
and confuses the attacker if it is still Active.
[Entei errata](https://play.pokemon.com/en-gb/resources/documents/tcg-errata/)
[Honchkrow print](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_SecretWonders.pdf)
[Shaymin print](https://www.pokemon-card.com/card-search/details.php/card/23530/regu/all)
[Spiteful Spirit ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%96%E3%83%AB%E3%83%B3%E3%82%B2%E3%83%AB&page=2&regulation_faq_main_item1=all)

Water Rescue asks the owner whether to recover the Pokémon and attachments
that reached the discard pile through an opposing attack damage Knock Out.
Effective Water typing qualifies, a direct Knock Out does not qualify,
and Lost City prevents recovery. Lucky Egg draws before this choice.
[Water Rescue print](https://www.pokemon-card.com/card-search/details.php/card/22109/regu/DP)
[Water Rescue rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%95%E3%83%AD%E3%83%BC%E3%82%BC%E3%83%AB&page=2&regulation=all&regulation_faq_main_item1=all)

N's Zekrom's Shred keeps the attacker's modifiers, printed Weakness and
Resistance, and Tenacious Body's survival flip. It bypasses Critical Cut,
shared damage-reduction mechanics, and the reviewed card-specific damage
modifiers, including Cornerstone Stance through Night Joker. The attack flags
used during resolution are transient. Other legacy Shred attacks and custom
damage modifiers still need individual review.
[N's Zekrom print](https://www.pokemon-card.com/card-search/details.php/card/49970/regu/all)
[Official damage calculation](https://www.pokemon-card.com/howtoplay/index.html)
[Tenacious Body ruling](https://professorprogram.pokemon.com/news/11464646)
[Intimidating Pattern ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%A2%E3%83%BC%E3%83%9C%E3%83%83%E3%82%AF&regulation_faq_main_item1=all)
[Adrena-Pheromone ruling](https://www.pokemon-card.com/rules/faq/search.php?page=121)

All 24 focused cases pass, with 19 failures on the previous engine. The
full engine suite passed 7,600 tests in 273 specs. The changes combined
with the checkout's pending work passed 428 checks. All 559 comparable
saved states and 3,633 sampled opening actions matched exactly. The seven
recorded solutions reached a win. The attested simulator package passed the
mobile size budget and ten mouse and touch board checks. Its browser engine
also verified Darkness Wing's discard choice and copied Shred damage
through Cornerstone Stance.

The next real attack probes confirmed two more failures. Kingler GE takes
zero recoil after Scissor Blow Knocks Out the defender, and Golisopod M4 26
gains no protection from a lethal Critical Slash.

## Gameplay re-audit, batch 29

Scissor Blow applies recoil when its attack damage would Knock Out the
defender, even if the defender survives. The Pokémon that actually used the
attack takes the recoil, including Mew ex using Versatile. Its own Weakness
and Resistance apply to that damage. A lethal hit and lethal recoil award
Prizes for both Knock Outs. The archived Darkness Wing ruling likewise
allows recovery when Strong-Willed saves the defender. This corrects the
survival expectation from batch 28.
[Kingler Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_GreatEncounters.pdf)
[Kingler rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%AD%E3%83%B3%E3%82%B0%E3%83%A9%E3%83%BC&regulation_faq_main_item1=all)
[Darkness Wing and Strong-Willed rulings](https://doczz.net/doc/193314/rulings-compendium-lvx---pokemon-rulings-compendium)

Strong-Willed flips on the following opposing turn, after resolving attack
effects and their prompts. A defender still Active after a lethal hit survives
at 10 HP on heads. Whirlwind clears the effect by switching the defender out,
and a copied Strong-Willed protects the copycat. No Guard applies its two
damage modifiers at their printed points in the calculation and also increases
recoil, as in Machamp using Submission from an earlier stage.
[Machamp LV.X print](https://www.pokemon-card.com/card-search/details.php/card/19176/regu/DP)
[No Guard rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%8E%E3%83%BC%E3%82%AC%E3%83%BC%E3%83%89&regulation_faq_main_item1=all)

The alternate Golisopod M4 26 printing keeps its Critical Slash identity and
uses the same confirmed Knock Out protection as Critical Cut. The actual
attacker gains both kinds of protection for the opposing turn, including
a copycat. Shred also bypasses the old protection marker on saved M4 boards.
[Golisopod M4 26 print](https://www.pokemon-card.com/card-search/details.php/card/50110)
[Golisopod CRI 26 print](https://www.pokemon.com/br/pokemon-estampas-ilustradas/cartas-de-pokemon/series/me04/26)

All 19 new cases and the corrected Honchkrow case pass. Thirteen of those
cases failed on the previous revision. The full engine suite passed 7,619
tests in 274 specs, and the changes combined with the checkout's pending
work passed 447 checks. All 559 comparable saved states and 3,633 sampled
opening actions matched exactly. The seven recorded solutions reached a win.
The package passed the mobile size budget and ten mouse and touch checks.
Its engine also verified the two Scissor Blow Prizes and a restored
Strong-Willed board where Honchkrow recovers a card without taking a Prize.

Three related failures remain reproduced. Special Darkness Energy SW gives
no damage bonus to an eligible attacker. Weavile's Dark Engage can be cleared
by querying the opposing Pokémon's type. The official Dark Engage and Kingler
interaction still deals 30 recoil where Special Darkness Energy should raise
it to 40. Review each Special Darkness Energy printing's text and timing
before changing the shared parent.
[Special Darkness Energy SW print](https://www.pokemon-card.com/card-search/details.php/card/3117)

## Gameplay re-audit, batch 30

Special Darkness Energy follows each printing's damage step. Neo Genesis
adds damage after Weakness and Resistance when damage remains and retains
its end-of-turn counter rule. The six registered EX-era printings add damage
before Weakness and Resistance and include the Dark-name exception. The five
later printings apply the bonus to Darkness-type holders and have no
end-of-turn penalty. The Kingler ruling verifies the later printings' bonus
on Active self-damage as well as damage to the opposing Active.
[Secret Wonders Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_SecretWonders.pdf)
[EX Holon Phantoms Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/EX_Holon_Phantoms.pdf)
[Rising Rivals Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Rising_Rivals.pdf)
[Undaunted Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/hs_undaunted.pdf)
[Kingler ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%AD%E3%83%B3%E3%82%B0%E3%83%A9%E3%83%BC&regulation_faq_main_item1=all)

Weavile SW starts as a Water Pokémon with Metal Weakness. Dark Engage
tracks the affected Pokémon for that turn, survives unrelated type queries,
and clears when it leaves the Active Spot. Weavile and Porygon-Z resolve their
type changes in play order, and Porygon-Z retains Conversion when it moves to
the Bench. Shadow Charge can choose both Basic and Special Darkness Energy.
[Weavile Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_SecretWonders.pdf)
[Dark Engage and Conversion ruling](https://www.pokemon-card.com/rules/faq/search.php?page=2&regulation=all&sc_group_id=3)
[Shadow Charge ruling](https://www.pokemon-card.com/rules/faq/search.php?page=3&regulation=all&sc_group_id=218)

The shared attachment prompts move the physical selected card from the deck,
discard pile, or detached top-deck selection. Subsequent effects receive
only completed attachments. Tests check Mirage Gate, Electric Generator,
Garchomp BKP and Shadow Charge, including the hand-only Special Energy lock
and shuffling after a zero-card choice.
[Mirage Gate print](https://www.pokemon-card.com/card-search/details.php/card/41896/regu/all)

The full engine suite passed 7,652 tests in 275 specs. The batch also passed
549 focused checks alongside the checkout's pending work. All 559 comparable
saved states and 3,633 sampled opening actions matched exactly, and all seven
recorded solutions reached a win. The browser package passed the mobile size
budget and ten mouse and touch board checks. Its engine verified the restored
Dark Engage and Scissor Blow interaction and confirmed that both Shadow Charge
selections physically moved out of the deck.

Next confirmed cases include four Special Metal Energy failures. The Secret
Wonders print wrongly reduces outgoing and incoming damage on non-Metal
Pokémon. The Neo Genesis print applies its outgoing reduction after Weakness.
Special Metal Energy UD currently reduces Shred damage. A real Charging
Trumpet evolution also leaves a selected Energy in the deck while recording
it as attached. Direct legacy attachment callers need the same source review
as the shared prompts.

## Gameplay re-audit, batch 31

Neo Genesis and Aquapolis Special Metal Energy reduce the non-Metal
holder's outgoing damage before Weakness and Resistance, including
attack damage to a Benched Pokémon. Their defensive reduction applies
after Weakness and Resistance. The later printings reduce attack damage
only when attached to a Metal Pokémon. Each attached copy stacks and
defensive reductions are ignored by Shred. The four Diamond & Pearl and
Platinum reprints now use the same rule as Undaunted.
[Neo Genesis print](https://images.pokemontcg.io/neo1/19_hires.png)
[Aquapolis print](https://images.pokemontcg.io/ecard2/143_hires.png)
[EX Delta Species print](https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/series/ex11/107)
[Secret Wonders Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_SecretWonders.pdf)
[Special Metal Energy damage rulings](https://www.pokemon-card.com/rules/faq/search.php?page=2&regulation=all&sc_group_id=219)

Charging Trumpet runs after a completed evolution from hand during the
player's turn. Its chosen Basic Energy leaves the viewed top three and
the remainder is shuffled. Bea puts the five cards in the discard pile
before offering their Energy and checks effective type on the Bench.
Melmetal's Energy Link moves the chosen Energy from the discard pile
after damage. Applying upstream `c00300bac` alone would leave Charging
Trumpet recording a ghost attachment because it still calls
`AttachEnergyEffect` without the detached source.
[Trumbeak print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/swsh4/144)
[Bea official card preview](https://www.pokemon-card.com/info/2020/20200821_002539.html)
[Melmetal print](https://www.pokemon-card.com/card-search/details.php/card/40127/regu/all)
[Upstream movement refactor](https://github.com/the-epsd/twinleafgg/commit/c00300bac7c729d4add18f596443d6ed32ca7e8a)

Lugia LEGEND exposes both halves' tags through the fork's public tag
property. Assembly from either half requires its complementary printing
and places the top half above the bottom half. Ocean Grow shows the five
viewed cards, attaches each Basic or Special Energy, and discards the
remaining cards. Two copies of the same half cannot form a Pokémon.
[HeartGold & SoulSilver Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/heartgoldsoulsilver.pdf)

All 25 focused cases passed. Seventeen failed before the changes. The
engine suite passed 7,677 tests in 276 specs, and the checkout's pending
work passed 608 combined checks. All 559 supported saved states and
3,633 sampled opening actions matched exactly. All seven recorded
solutions reached a win. The 2.46 MiB ZIP passed attestation and the
mobile package budget. Ten board interaction checks passed. The built
client also verified the Neo Genesis and Secret Wonders damage difference
and physically moved both selected Charging Trumpet cards.

Real actions reproduced nine more ghost attachments in Emolga-EX XY,
Solgaleo-GX SUM and UPR, Raichu UNB, Solgaleo Prism Star UPR, Steelix GL RR,
Trapinch RR, Victini VMAX BST, and Blissey MT. Ho-Oh LEGEND and Raikou &
Suicune LEGEND also failed assembly with complementary halves. Audit
these paths and the fork's other inherited protected-tag definitions
against upstream `21842b2e0`.

## Gameplay re-audit, batch 32

Nine card paths now move each selected Energy from the deck or discard
pile to its intended Pokémon. Sol Burst-GX for both prints supports
Basic and Special Energy and shuffles after taking zero cards. Emolga
switches only after Energy Glide actually attaches a card and shuffles.
Never Give Up moves every eligible Lightning Energy with a three-Prize
deficit. Radiant Star moves as many eligible Metal Energy as the opponent
has Pokémon in play, or all available when fewer remain.
[Emolga-EX print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/xy1/143/)
[Solgaleo-GX print](https://www.pokemon.com/de/pokemon-sammelkartenspiel/pokemon-karten/series/sm1/143/)
[Raichu print](https://images.pokemontcg.io/sm10/55.png)
[Solgaleo Prism Star print](https://images.pokemontcg.io/sm5/89.png)

Steelix GL's Mend heals only after a Metal Energy moves from the discard
pile. Gather Sand attaches Basic Fighting Energy to Active Trapinch.
Happy Chance counts the attacking Pokémon's Energy after the optional
attachment. Spreading Flames attaches the chosen Fire Energy to its
selected targets. Both Victini VMAX prints also use the printed 310 HP
and 120 bonus damage for Max Victory against Pokémon V.
[Rising Rivals Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Rising_Rivals.pdf)
[Mysterious Treasures Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_MysteriousTreasures.pdf)
[Victini VMAX print](https://images.pokemontcg.io/swsh5/22.png)

Ho-Oh LEGEND and Raikou & Suicune LEGEND assemble from their complementary
halves. Ho-Oh and Lugia award one Prize each and Raikou & Suicune awards
two. The latter recognizes both Lightning and Water typing and both
printed Weaknesses. Sacred Rainbow converts Energy to Fire, including
both units of Double Colorless Energy.
[HeartGold & SoulSilver Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/heartgoldsoulsilver.pdf)
[HS—Unleashed Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/hs-unleashed.pdf)

All 32 focused cases passed, including 21 that failed on the earlier
revision. The full engine suite passed 7,709 tests in 277 specs. The
checkout's pending work passed 653 combined checks. All 559 supported
saved states and 3,633 sampled opening actions matched exactly, and all
seven recorded solutions reached a win. The 2.46 MiB ZIP passed attestation,
the mobile package budget, and ten board interaction checks. Its engine
also attached both selected Sol Burst-GX cards and assembled Raikou &
Suicune from a saved board. The previous Charging Trumpet regression now
forces the Moonlit Miracle coin result so it always exercises evolution.

The built catalog still contains 177 printings with protected tags
missing from their public tags. Of those, 32 have a tag that affects Prizes.
Real Knock Outs gave one Prize each for Maushold ex PAR, Eevee ex MEE, and
Mega Floette ex M4 35. A direct resolution of Never Give Up could submit
Water Energy despite the preset Lightning filter. The shared prompt uses
its filter for presentation without checking the selection against it.
Audit those live paths against the public tag and filter contracts before
applying the changes across the catalog.
[Upstream tag accessor refactor](https://github.com/the-epsd/twinleafgg/commit/21842b2e06790ec47546cf2518513c4e558ba3c1)

## Gameplay re-audit, batch 33

Restored public card tags in 30 source definitions covering all 32
registered prints that lacked a tag used to award Prizes. Real Knock
Outs verified two Prizes for Pokémon ex, Pokémon-EX, Pokémon-GX and
Pokémon V, and three for Mega Evolution Pokémon ex. Associated Tera,
Team Rocket's and Future tags were restored on the same definitions.
The built catalog contains 15,750 cards with no remaining protected
Prize tags missing from their public tags.
[Pokémon TCG Rulebook](https://assets.pokemon.com/assets/cms2/pdf/trading-card-game/rulebook/mew_rulebook_en.pdf)
[Mega Evolution ex rules](https://www.pokemon-card.com/info/004859.html?rss=250228)
[POP Series 3 Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/POP_Series_3_Promo_cards.pdf)
[Eevee ex Starter Set](https://www.pokemon-card.com/ex/me/)
[Mega Heatran ex promo](https://www.pokemon-card.com/info/005705.html?ui=en)
[Mega Tatsugiri ex promo](https://www.pokemon-card.com/card-search/details.php/card/50471)

The Energy prompt validates eligibility, type limits and target
restrictions together. The Angular UI and simple bot share the same
checks. The engine rejects off-type Never Give Up selections, duplicate
types for Tar Generator and repeated recipients for Geomancy. Joltik's
Jolting Charge can still attach two Grass and two Lightning Energy in
any distribution. The older cardType and provides filter shapes also
resolve against Energy cards.
[Coalossal print](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/swsh2/107/)
[Stellar Crown Joltik](https://www.pokemon.com/uk/features/scarlet-violet-stellar-crown-triple-play-cinderace-ex-lapras-ex-galvantula-ex)

The suite passed 7,750 engine tests, 694 combined checks alongside the
checkout's pending work, and 209 frontend specs. The 41 new engine
cases include 36 that failed on the prior revision. All 559 supported
saved states still load with identical serialized payloads and card
identities. Four in-memory states differ exclusively in the restored
tags for Koraidon ex ASC or Team Rocket's Kangaskhan ex ASC. All 3,633
sampled opening actions matched, and all seven recorded solutions won.
The 2.46 MiB ZIP passed attestation, the mobile package budget and ten
board interaction checks. A simple-bot run also confirmed that it can
skip the off-type card and duplicate Fire Energy before assigning one
Fire and one Fighting Energy.

The remaining 145 printed tag omissions include Pokémon SP, LV.X,
Delta Species and other classifications. A real Poké Turn play was
rejected with Forretress G RR as the only eligible Pokémon. The same
action succeeded when its printed SP tag was visible to the game.

## Gameplay re-audit, batch 34

Made the remaining 145 missing printed classifications visible to the engine,
across 132 definitions and their reprints. The regression suite checks each
exact print and exercises Pokémon SP pickup and Level-Up, Delta Rainbow
Energy, Rocket's Hideout, owner-specific Energy and searches.
[Supreme Victors rulebook](https://assets.pokemon.com/assets/cms/pdf/tcg/rulebooks/Supreme_Victors_Rulebook.pdf)
[Rising Rivals Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Rising_Rivals.pdf)
[EX Holon Phantoms Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/EX_Holon_Phantoms.pdf)

Poké Turn returns each physical card once, including Tools that appear in
both attachment lists on older boards. Before the fix, returning Steelix GL
with one Energy and one Tool put the same Energy ID into the hand twice and
left a Tool reference in the empty slot. Sneasel's Rob now returns both
Technical Machines and Pokémon Tools. Damage Porter requires three Colorless
Energy and uses the number of damage counters on the Pokémon using the attack.
[Platinum Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Platinum.pdf)
[Legends Awakened Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_LegendsAwakened.pdf)
[Rising Rivals Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Rising_Rivals.pdf)

Deck validation counts Diamond & Pearl Unown letters independently and keeps
the shared count for the registered older Neo and EX prints. The Arceus
exception applies to the card that prints it, including promo DP50. A separate
card's four-copy limit applies regardless of where Arceus appears in the list.
[Diamond & Pearl rules change bulletin](https://www.pokebeach.com/news/0507/dprules.pdf)
[Arceus Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Arceus.pdf)

All 7,913 engine tests passed, including 163 focused cases. Of those focused
cases, 160 failed on the prior revision. The combined engine suite passed 791
checks alongside the pending checkout changes. All 559 supported saved states
loaded with identical serialized payloads, identities and deserialized state.
All 3,633 sampled opening actions matched, and all seven recorded puzzle
solutions reached a win. The 2.46 MiB ZIP passed attestation and the mobile
package budget. The built catalog has
15,750 prints and zero nonempty protected tags missing from their public tags.

A separate real-attack reproduction found that Arceus AR9's Metal Barrier
blocks Rookidee's Flap even though Rookidee is a Basic Pokémon. On Rookidee's
following turn, the original marker still blocks Flap. The printed effect is
limited to attacks from Pokémon LV.X during the opponent's next turn. Keep
that reproduction for the next pass on temporary attack protection.
[Metal Barrier print text](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Arceus.pdf)

## Gameplay re-audit, batch 35

Ported Metal Barrier and Moon Barrier from the upstream attack-effect refactor
to the local next-turn protection lifecycle. Metal Barrier scopes both damage
and secondary effects to Pokémon LV.X. Moon Barrier checks the attacker's
effective Dragon type and permits damage from attacks such as Shred that
ignore effects on the defending Pokémon.
[Upstream attack-effect refactor](https://github.com/the-epsd/twinleafgg/commit/343b9ae4294d0af4521da998475640ff643427b8)
[Metal Barrier card text](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Arceus.pdf)
[BREAKpoint Clefable print](https://images.pokemontcg.io/xy9/82_hires.png)

Mind Bend now applies Confusion through the attack that caused it, including
when a Pokémon LV.X inherits the attack. Severe Poison applies its 40-damage
Checkup value only when the attack actually Poisons the target. Focused
regressions play real attacks, Level-Up, Boss's Orders and copy effects, and
check the protection after a compact snapshot round-trip. Eight of the twelve
cases reproduce failures on the prior revision. The saved puzzle inventory
contains no legacy Metal Barrier markers.
[Mind Bend card text](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Arceus.pdf)
[BREAKpoint Dragalge print](https://images.pokemontcg.io/xy9/86_hires.png)
[Arceus rulebook](https://assets.pokemon.com/assets/cms/pdf/tcg/rulebooks/Arceus_Rulebook.pdf)

All 7,925 engine tests, 420 combined-checkout checks and 209 frontend
specs passed. All 559 supported saved states matched in serialization and
deserialized state. All 3,633 sampled opening actions matched, and all seven
recorded solutions reached a win. The 2.46 MiB ZIP passed attestation, its
mobile package budget and ten packaged board interaction checks.

A separate reproduction found that Silver Tempest Dragonair's Wrap still
Paralyzes Finneon after Elegant Swim prevents damage and attack effects.
The attack calls a helper that reports its condition as a power effect.
A syntax scan found 969 such helper calls inside attack branches across
914 definitions. Those calls are candidates for printed-rule and
runtime validation. The two lifecycle points are effects applied while the
attack runs and effects applied after damage or a prompt.

## Gameplay re-audit, batch 36

Migrated Special Conditions on 265 card definitions across 28 sets. The
selection matched the exact set, collector number, attack text and named
Active target against the English print data. The suite exercises every
attack with and without Finneon's Elegant Swim. It checks the printed damage
at the point the condition is applied, including attacks with a coin flip.
All 530 paired cases fail on the prior revision, which can apply a condition
through protection or reports it as a power effect in the unprotected case.
[Official attack resolution order](https://assets.pokemon.com/assets/cms2/pdf/trading-card-game/rulebook/par_rulebook_en.pdf)
[Silver Tempest Dragonair](https://asia.pokemon-card.com/sg/card-search/detail/3308/)
[Twilight Masquerade Brute Bonnet](https://images.pokemontcg.io/sv6/118_hires.png)
[Unified Minds Magnemite](https://images.pokemontcg.io/sm11/58_hires.png)

After-attack handlers now retain the resolved attack, including its actual
attacking Pokémon. Both Mew ex's delegated copy and Mimikyu's previous-attack
copy carry the copier's context through their Special Conditions. The
printed status-only attacks Poison Spray and Supersonic move into the
after-attack phase. Brute Bonnet's Toxic Powder still follows Ability rules.

All 8,460 engine tests, 713 combined-checkout checks and 209 frontend
specs passed. All 559 supported saved states matched in serialization and
deserialized state. All 3,633 sampled opening actions matched, and all seven
recorded solutions reached a win. The 2.46 MiB ZIP passed attestation,
the mobile package budget and ten packaged board interaction checks.

The syntax audit has 704 calls in 649 further definitions. The same printed
text and target test identified 397 further definitions, mostly from older
sets. Baseline plays reproduced the shield bypass for all 397. Of the
paired unprotected controls, 394 matched the printed damage when the
condition resolved. Icy Wind (Cryogonal NVI), Shake Vine (Bulbasaur SW)
and Soothing Scent (Leafeon UD) require a separate check of damage and
effect timing as part of that migration.

## Gameplay re-audit, batch 37

Migrated 397 more printed status attacks to the resolved attack source.
The paired test suite now covers 662 attacks from this pass and the prior
one. Each has a real play with and without Finneon's Elegant Swim, with the
printed damage checked at the point the condition resolves. Zero-damage
Paralyzing Gaze, Poisonpowder and Confuse Ray now resolve in the after-attack
phase alongside the other status attacks.
[Official attack order](https://assets.pokemon.com/assets/cms2/pdf/trading-card-game/rulebook/par_rulebook_en.pdf)

Corrected four card definitions against their exact English prints. Cryogonal
NVI 32 deals no damage with Icy Wind. Bulbasaur SW flips four coins for Bullet
Seed and only applies Sleep for Shake Vine. Leafeon UD multiplies the damage
of Miasma Wind by the number of Special Conditions, and Soothing Scent deals
30 before it applies Sleep.
[Noble Victories Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/bw_noble_victories.pdf)
[Secret Wonders Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_SecretWonders.pdf)
[Undaunted Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/hs_undaunted.pdf)

Cryogonal NVI 33 now has its printed Ice Chain and Frost Vanish. Ice Chain
costs one Water Energy and lets the attacker choose the opposing Benched
Pokémon. Frost Vanish deals 40 before offering to return the attacker and
each physical attachment. Tests cover the attacker declining, a Tool
referenced in both attachment lists, and Mew ex returning itself after
copying Frost Vanish.
[Noble Victories Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/bw_noble_victories.pdf)
[Pokémon Organized Play switching rulings](https://doczz.net/doc/193314/rulings-compendium-lvx---pokemon-rulings-compendium)

All 9,264 engine tests, 1,517 combined-checkout checks and 209 frontend
specs passed. All 559 supported saved states and 3,633 sampled opening
actions matched the prior build. All seven recorded solutions reached a win.
The 2.46 MiB package passed attestation, the mobile budget and ten packaged
board interaction checks.

The tracked audit has 306 calls across 251 remaining definitions. Printed
attack text has been associated with 219 of those calls. Baseline plays
confirm protection bypasses on Team Rocket's Nidoking ex's Dirty Horns,
Accelgor's Poisonous Ploy, and Butterfree's Scale Hurricane. Dirty Horns
still causes 80 Poison damage in Checkup. Poisonous Ploy still applies both
conditions and switches Accelgor. Scale Hurricane still applies Paralysis.

## Gameplay re-audit, batch 38

Corrected 144 Special Condition attacks against their printed text. Attack
handlers that calculate damage or flip coins can now queue conditions after
damage using the original attack source. This lets attack protection prevent
Dirty Horns' eight-counter Poison, Poisonous Ploy's Confusion and Poison,
and Scale Hurricane's Paralysis. Poisonous Ploy still switches the attacker.
Mew ex's copied Scale Hurricane applies Paralysis on exactly two heads and
checks protection against Mew itself.
[Team Rocket’s Nidoking ex](https://asia.pokemon-card.com/sg/card-search/detail/19764/)
[Pokémon TCG attack order](https://assets.pokemon.com/assets/cms2/pdf/trading-card-game/rulebook/par_rulebook_en.pdf)

The checks cover independent effects on the attacker, including switching,
discarding, drawing and healing, as well as Pokémon Checkup.
Dark Corridor deals damage and applies Poison before Gengar-EX switches.
Radiating Pulse deals damage, discards two Energy and then applies Paralysis
if the defending Pokémon is unprotected. The legacy discard prompt had no
valid selection in a real game.
[Gengar-EX attack order](https://www.pokemon.com/us/play-pokemon/worlds/2015/decks/popular-decks)
[Luxray V](https://asia.pokemon-card.com/ph/card-search/detail/2318/)

Caterpie BS, Mudkip RS and Marshtomp RS now apply Paralysis on heads.
Flareon SK applies Burn. Treecko CG and Deino SV11W apply Paralysis to the
opposing Active. Ivysaur DEX deals 20 with Sleep Powder and 50 with Poison
Powder. Poison Spike checks for existing damage before applying its own
damage. Swirling Ripple checks the entire opposing board for a Water
Pokémon. Porygon2 UF draws with Data Retrieval and grants the Scramble
Energy bonus and Confusion only on Scramble Trip.
[EX Ruby and Sapphire Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/EX_Ruby_and_Sapphire.pdf)
[Dark Explorers Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/bw_dark_explorers.pdf)
[EX Unseen Forces Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/EX_Unseen_Forces.pdf)

This pass resolves 169 of the 306 tracked call sites and brings the total
to 806 tested Special Condition attacks across batches 36–38. The
remaining queue contains 137 calls across 121 definitions. 51 of those
calls have matching printed text in local card data. Priorities include
opponent switches followed by status, Perish Dream's delayed Knock Out,
and remaining alternate prints. Upstream main is still at `d3d7a0031`.

All 9,600 engine tests, 1,773 checks with the existing local client edits
and 209 frontend specs passed. The build passed package attestation, the
mobile size budget at 2.46 MiB and ten packaged board checks. All 559
supported saved states and 3,633 sampled opening actions matched the
previous build. All seven recorded solutions reached a win.

## Gameplay re-audit, batch 39

Corrected 19 attacks involving switches, Special Conditions and delayed
Knock Outs. Six attacks place their condition on the selected Benched
Pokémon only after a successful switch. A protected Active may be switched
out by these attacks. A protected Benched Pokémon cannot be switched in.
An empty Bench leaves no new defender to receive the condition. This follows
the official ruling for Froslass GL's Sleep Inducer. Wake-Up Slap calculates
damage with the defender's conditions in place and clears them afterward.
[Official Froslass GL ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A6%E3%82%AD%E3%83%A1%E3%83%8E%E3%82%B3&page=3&regulation=all&regulation_faq_main=)
[Rising Rivals Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Rising_Rivals.pdf)
[Advanced rulebook, C-04 and C-05](https://asia.pokemon-card.com/sg/wp-content/uploads/sites/6/2025/10/EN_advanced_manual-2025.pdf)

Poison Rub offers the attacker a switch before damage. The Pokémon
that actually defends takes the hit and receives Poison afterward.
If protection blocks the incoming Pokémon from switching, Poison Rub
resolves against the original defender. In singles, Flick Poison lets
the attacker choose the incoming Bench target. The attack's instruction
for the opponent refers to choosing between defending Active Pokémon.
[Official Poison Rub print](https://www.pokemon-card.com/card-search/details.php/card/3055)
[Official Poison Rub ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%8B%E3%83%89%E3%82%AD%E3%83%B3%E3%82%B0&page=2&regulation=all&regulation_faq_main_item1=all)
[Legend Maker Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/EX_Legend_Maker.pdf)

Perish Dream, Doom Desire, Doom News, Doom Curse, Word of Ruin and
Pale Moon-GX now apply a preventable attack effect. The delayed Knock Out
resolves when the defender's turn ends, even if the attacker has left play.
Switching the defender to the Bench or evolving it clears the effect.
Transformation Tome keeps it on the replacement Pokémon. The mark survives
a saved-state round trip with the actual attacker as its source, including
Mew ex copying Perish Dream. Existing marker formats are still accepted.
Jirachi's self-Sleep and the attacks' Energy return and discard effects
follow their printed conditions. The legacy Hisuian Zoroark ASR identity
retains the Doom Curse it exposes to saved boards.
[Perish Dream rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%B8%E3%83%A9%E3%83%BC%E3%83%81%E2%97%87&regulation_faq_main_item1=all)
[Doom Desire ruling on switching](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%B8%E3%83%A9%E3%83%BC%E3%83%81&page=8&regulation_faq_main=)
[Legends Awakened Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_LegendsAwakened.pdf)
[Supreme Victors Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Supreme_Victors.pdf)
[Word of Ruin](https://asia.pokemon-card.com/ph/card-search/detail/1514/)
[Doom Curse](https://asia.pokemon-card.com/ph/card-search/detail/2673/)
[Pale Moon-GX](https://www.pokemon-card.com/card-search/details.php/card/37447)

This batch resolves 14 of the previously tracked status call sites. The
remaining queue contains 123 calls in 112 card definitions. Baseline
plays reproduced four additional issues. Paralyzing Bolt applies
Paralysis before damage and before payment. Poison Experiment applies
Poison when payment is prevented. Ice Bind prompts for discard before
damage. Leaf Hurricane checks remaining HP before its own damage.
[Paldea Evolved Bellibolt ex print](https://asia.pokemon-card.com/ph/card-search/detail/6891/)
[Platinum Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Platinum.pdf)
[Secret Wonders Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_SecretWonders.pdf)

All 9,675 engine tests, 2,055 checks with the existing working-tree edits
and 209 frontend specs passed. The 2.46 MiB package passed attestation,
the mobile size budget and ten packaged board checks. All 559 supported
saved states and 3,633 sampled opening actions matched batch 38. All
seven recorded puzzle solutions reached a win.

## Gameplay re-audit, batch 40

Bellibolt ex PAL’s Paralyzing Bolt offers an optional discard of two
Lightning Energy after damage. A qualifying Counter Energy pays both
units. The defending Pokémon becomes Paralyzed after the selected Energy
is discarded. Jumping Press can also target the Active Pokémon, where
Weakness and Resistance apply. Cacturne PL’s Poison Experiment uses
the Energy the card provides in play. A discarded Rainbow Energy applies
both conditions. The payment checks accept the Prism Star discard rule
that sends the card to the Lost Zone and reject repeated selection of
the same attached card.
[Paldea Evolved Bellibolt ex print](https://asia.pokemon-card.com/ph/card-search/detail/6891/)
[Official Bellibolt ex FAQ](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%8F%E3%83%A9%E3%83%90%E3%83%AA%E3%83%BCex&regulation_faq_main_item1=all)
[Official Poison Experiment ruling](https://www.pokemon-card.com/rules/faq/search.php?page=22&regulation_faq_main=&sc_group_id=105)
[Platinum Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Platinum.pdf)

Walrein MT’s Ice Bind asks the defender whether to discard after damage.
Wormadam Plant Cloak SW’s Leaf Hurricane measures each Pokémon’s
remaining HP after damage. The printed attack checks also corrected
Drapion M3’s self-damage, Buneary LA’s Rest sequence, Larvitar MT’s discard
requirement, Parasect MT’s same-turn evolution condition, and Porygon2 DS’s
recognition of an attached Technical Machine.
[Secret Wonders Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_SecretWonders.pdf)
[Legends Awakened Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_LegendsAwakened.pdf)
[Drapion print](https://asia.pokemon-card.com/sg/card-search/detail/25067/)

This batch verifies 72 attacks and resolves 81 of the 123 tracked calls.
The remaining 42 calls span 41 card definitions. A print comparison also
found five Black & White definitions with attacks assigned to the wrong
collector number. They remain queued for exact-print and saved-puzzle
verification.
[Black & White Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/black_white.pdf)

The 189 focused card cases passed, including 152 that failed on the old
engine. All 9,865 engine tests, 2,050 checks with the existing working-tree
edits, and 209 frontend specs passed. The 2.46 MiB package passed build
attestation, the mobile size budget, and ten browser board checks. All 559
supported saved states and 3,633 sampled opening actions matched batch 39.
All seven recorded puzzle solutions reached a win.

## Gameplay re-audit, batch 41

Five Black & White definitions now use the attacks and stats for their
collector numbers. Venipede 52 uses Ram and Rollout. Whirlipede 53's
Poison Sting deals 20 and applies ordinary Poison after damage, including
when copied. Zebstrika 43's Electrispark deals 70 to the Active Pokémon
and 10 to each Benched Pokémon without applying Bench Weakness or
Resistance. Musharna 49's Hypnotic Ray applies Sleep after damage. Dream
Eater costs two Psychic Energy and deals damage only to a sleeping
defender. Patrat 78's Hyper Fang deals 30 on heads. The five saved card
names and collector numbers remain valid.
[Black & White Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/black_white.pdf)

Clefairy RCL keeps its saved name and now uses collector number 74,
Shining Fingers and Magical Shot. Numbered deck imports resolve
Clefairy 74 and Palossand 82 separately with their own artwork. Golduck
SW's optional Break Beam Confusion applies after the 60 damage and is
attributed to the attack.
[Clefairy scan](https://assets.pokemon.com/assets/cms2/img/cards/web/SWSH2/SWSH2_EN_74.png)
[Rebel Clash checklist](https://www.pokemon.com/static-assets/content-assets/cms2/pdf/trading-card-game/checklist/swsh2_web_cardlist_en.pdf)
[Secret Wonders Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_SecretWonders.pdf)

All 17 focused tests passed. Fourteen reproduced failures on the prior
engine. All 9,882 engine tests, 377 checks with the existing working edits,
209 frontend specs and 30 simulator API tests passed. The 2.46 MiB
package passed build attestation, the mobile size budget and ten browser
board checks. All 559 supported saved states and 3,633 sampled opening
actions matched batch 40. None of the seven corrected card definitions
occurred in those snapshots. All seven recorded solutions reached a win.

The Special Condition queue now contains 35 calls in 34 definitions.
A two-copy playthrough reproduced Needle Shock reapplying both conditions
on the next turn after switching to a different Beedrill RR. The card
checks whether any of the player's Pokémon used it on their preceding
turn. The Sword & Shield checklist also confirms legacy collector-number
mismatches for Galvantula, Galarian Ponyta and Clobbopus. These cases
remain open for implementation and verification.
[Rising Rivals Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Rising_Rivals.pdf)
[Sword & Shield checklist](https://assets.pokemon.com/assets/cms2/pdf/trading-card-game/checklist/swsh1_web_cardlist_en.pdf)

## Gameplay re-audit, batch 42

Needle Shock uses the attacker's player history for the previous turn.
Consecutive uses by different Beedrill or by a Pokémon copying the attack
still deal 30 damage. The defender receives Paralysis and Poison only when
the player did not use Needle Shock on their preceding turn. The history
survives save and restore. Legacy card-scoped markers retain their meaning
and expire on the correct turn. Flutter Wings can be used once per turn by
each Beedrill that meets its printed conditions.
[Rising Rivals Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Rising_Rivals.pdf)

Smogscreen, Sand Attack and the shared one-turn restriction now make the
original defender flip only after a legal attack is declared. That roll
precedes Confusion. An attack effect shield blocks the restriction while
ordinary damage can still land. Weezing DX, Koffing GE and Dustox PL apply
Smogscreen's Poison after damage. Chaos Rising Octillery checks both flips
through the ordinary attack sequence. Its legacy alias keeps the Corner
Stop attack name used in existing clients. Octazooka persists while the
affected Pokémon remains Active and multiple applications still require
one flip. Saved Weezing and Octillery marker names remain supported and
the editor API still returns them.
[Advanced player's rulebook](https://asia.pokemon-card.com/my/wp-content/uploads/sites/6/2022/08/advanced-manual_EN.pdf)
[EX Deoxys Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/EX_Deoxys.pdf)
[Great Encounters Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_GreatEncounters.pdf)
[Platinum Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/Platinum.pdf)
[Octazooka rulings](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%AA%E3%82%AF%E3%82%BF%E3%83%B3&page=2&regulation_faq_main=)
[Chaos Rising Octillery print](https://asia.pokemon-card.com/my/card-search/detail/25208/)

The Sword & Shield legacy aliases now use Galarian Ponyta 81, Galvantula
71 and Clobbopus 111. Both deck import endpoints resolve the correct
collector number, including the distinct Clobbopus 112 and the existing
numbered Galvantula. The saved full names and neighboring printed
identities are retained. This batch resolves eight calls. The remaining
Special Condition queue has 27 calls in 27 card definitions.
[Sword & Shield checklist](https://assets.pokemon.com/assets/cms2/pdf/trading-card-game/checklist/swsh1_web_cardlist_en.pdf)

All 44 focused cases passed, including 25 that failed on the prior engine.
All 9,926 engine tests, 367 checks with the existing working edits,
209 frontend specs and 32 simulator API tests passed. The 2.46 MiB
package passed attestation, the mobile size budget and ten browser board
checks. All 559 supported saved states and 3,633 sampled opening actions
matched batch 41. All seven recorded solutions reached a win.

Three baseline checks reproduced the next issues. Energy Antics can move
Energy out of a protected source or onto a protected destination. The
official ruling keeps the Energy on a protected source and discards it
when only the destination blocks the transfer. Graffiti currently adds
the attack cost through effect protection. Its self-Sleep is independent.
[Energy Antics source ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A0%E3%83%81%E3%83%A5%E3%83%BC%E3%83%AB&regulation_faq_main_item1=all)
[Energy Antics destination ruling](https://www.pokemon-card.com/rules/faq/details.php?id=8063)
[HeartGold & SoulSilver Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/heartgoldsoulsilver.pdf)

## Gameplay re-audit, batch 43

Smoochum's Energy Antics moves one attachment between two opposing
Pokémon before applying its own Sleep. An effect-protected source keeps
its Energy. Choosing an effect-protected destination sends the Energy
to the opponent's discard. The same prompt handles both saved attachment
layouts and rejects empty, wrong-side and repeated selections. Graffiti
applies self-Sleep independently and increases the original defender's
attack cost only if that Pokémon accepts the effect.
[HeartGold & SoulSilver Card-Dex](https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/heartgoldsoulsilver.pdf)
[Energy Antics source ruling](https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%A0%E3%83%81%E3%83%A5%E3%83%BC%E3%83%AB&regulation_faq_main_item1=all)
[Energy Antics destination ruling](https://www.pokemon-card.com/rules/faq/details.php?id=8063)

The remaining 27 Special Condition calls use their actual attack as
the source and resolve in printed order. The checked prints include
30th Celebration, Ascended Heroes, Delta Reign, Chaos Rising, Japanese
PCG promos, Gym Heroes, POP Series, Southern Islands, Nintendo promos,
HeartGold & SoulSilver and Black & White promos. Both Chaos Rising
Mareep aliases now use Thunder Wave's printed 20 damage. Tropical Vibes
applies Sleep before drawing. Voltaic Hammer counts Basic Energy that
actually leaves Electivire for discard.
[Erika's Tangela](https://asia.pokemon-card.com/sg/card-search/detail/24799/)
[Chaos Rising Mareep](https://asia.pokemon-card.com/sg/card-search/detail/25218/)
[Delta Reign Electivire scan](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/DLR/DLR_031_R_EN.png)
[Pikachu scan](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/30C/30C_043_R_EN.png)
[Pichu Bros. scan](https://images.pokemontcg.io/pop3/16.png)
[Forretress scan](https://images.pokemontcg.io/pop3/9.png)

LaRousse's Munchlax damages only the Pokémon chosen for Bass Control.
PokéPark's Munchlax uses the shared next-turn damage protection for
Defense Curl. Miraculous Light heals and cures the actual attacker.
Natural Cure on PokéPark's Celebi and Sea's Manaphy requires a successful
Energy attachment from hand.
[LaRousse's Munchlax scan](https://www.serebii.net/card/pcgpromos/20.jpg)
[PokéPark's Munchlax scan](https://www.serebii.net/card/pcgpromos/40.jpg)
[PokéPark's Celebi scan](https://www.serebii.net/card/pcgpromos/44.jpg)
[Sea's Manaphy 139 scan](https://www.serebii.net/card/pcgpromos/139.jpg)
[Sea's Manaphy 154 scan](https://www.serebii.net/card/pcgpromos/154.jpg)

All 106 focused cases passed. Eighty-five failed on the preceding engine.
All 10,032 engine tests, 443 checks with the existing working edits, 209
frontend specs and 32 simulator API tests passed. The 2.46 MiB package
passed attestation, the mobile size budget and ten packaged board checks.
A packaged Chromium test moved a cards-only Energy with the mouse and
an energies-only attachment with touch, then read back both changes.
All 559 supported saved states and 3,633 sampled opening actions matched
batch 42. All seven recorded solutions reached a win.

## Gameplay re-audit, batch 44

Thirteen hand-evolution Abilities now run after the evolved Pokémon is in
play. The check uses the actual source zone and the current player's turn.
Manectric's High Speed offers the optional draw, and Clefable's Moonlit
Miracle can evolve the same Manectric from the top of the deck without
drawing it into the hand. Feraligatr's Rowdy still flips automatically.
Haphazard Hammer asks before flipping. Cast-Off Shell on both Ninjask
prints can be declined without shuffling, and a full Bench or empty deck
no longer prevents evolution. Fumbling Hands and Cast-Off Shell respect
Ability suppression after the evolution.

The print review covers Manectric, Banette VIV, Ninjask VIV, Clefable RCL,
Granbull FST, Feraligatr FST, Thievul EVS, Ninjask LOT, Pupitar LOT, Blissey GRI,
Hariyama MEG, Tinkatuff MEG and Ninjask MEG.
[High Speed](https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/series/swsh4/52/)
[Rowdy](https://assets.pokemon.com/assets/cms2/img/cards/web/SWSH8/SWSH8_EN_57.png)
[Haphazard Hammer](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/MEG/MEG_097_R_EN.png)
[Cast-Off Shell](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/MEG/MEG_017_R_EN.png)

The focused suite passes 54 cases. Fifty fail on the previous implementation.
All 559 comparable saved states matched, including 401 active states. All
3,633 sampled Trainer, attack and Ability opening actions matched. A separate
comparison verified 242 matching opening evolutions in the same corpus.
Seven recorded solutions reached a win. The packaged build, API suite and
Angular service and board checks passed. Upstream main remains at
`d3d7a0031`. There are 52 remaining card definitions using the legacy
evolution helper. The next pass still needs to check their printed trigger
wording and resolve each case individually.

## Gameplay re-audit, batch 45

Checked the English prints for all 52 remaining card definitions that used
`JUST_EVOLVED` and removed that helper. The hand-triggered effects now wait
for the evolved Pokémon to be in play. Salazzle SCR keeps the printed
exception. Sudden Scorching checks whether the card actually evolved from
Salandit that turn, works through Ability suppression, and discards a short
hand to the opponent's discard pile. Summon Minions on Dark Dragonite
requires a hand play and offers the search without an Ability confirmation.

Emerge Charge now attaches from the discard pile. Raging Roar can attach to
a Benched Tyranitar. Greedy Evolution lets the player select which Darkness
Energy to attach. Evolutionary Vitality can be declined or gather every
revealed Energy, and Blissful Nurse clears the actual attached cards on the
healed Pokémon. Cast-off Shell can select Shedinja from either printed source.
Mapping can be declined without a shuffle. Sunshine Song uses the shared
deck-evolution lifecycle, and Shadow Pain runs target-side Ability protection.
[Salazzle SCR 24](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SCR/SCR_024_R_EN.png)
[Flygon ex LM 87](https://images.pokemontcg.io/ex12/87_hires.png)
[Sharpedo UNB 111](https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/UNB/UNB_111_R_EN.png)
[Croconaw MT 44](https://images.pokemontcg.io/dp2/44_hires.png)
[Stormfront Torterra 11](https://images.pokemontcg.io/dp7/11_hires.png)

All 167 focused cases passed. The previous build failed those cases.
All 559 comparable saved states matched, including 401 active states. All
3,633 sampled Trainer, attack and Ability openings and 242 sampled opening
evolutions matched. Seven recorded solutions reached a win. The independent
simulator API passed 32 tests. The full engine suite passed 10,253 tests.
The worktree with the existing local edits passed 535 targeted cases. The
2.46 MiB packaged build passed attestation, 10 board scenarios and 209
Angular service and component checks. Upstream main remains at
`d3d7a0031`.

The remaining direct `EvolveEffect` calls span 29 card definitions, including
permission checks that intentionally run before play. Review each against
its print before moving it. Po Town, Galactic HQ and Wyndon Stadium are
first in the next comparison because their printed hand-only effects
currently listen to deck evolutions as well.

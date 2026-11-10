# Upstream Twinleaf sync record

`upstream-sync-ledger.json` records each commit observed after the previous
upstream tracking point, including partial ports and deferred work. The latest
observed SHA is **not** an applied watermark: this fork has deliberately
different card paths, local print aliases, engine behavior and UI. Never replace
the simulator's source with upstream wholesale or assume a merge is safe.

For a future sync:

1. Fetch `upstream`, then run `node tools/upstream-sync-ledger.cjs refresh`.
   `status` reports commits not yet recorded without modifying the ledger.
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

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

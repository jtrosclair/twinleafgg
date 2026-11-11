# Pokémon-as-Energy restoration and deferred lifecycle research

## Reviewed restoration-only change (2026-11-10)

The reviewed change restores the derived ENERGY form after `StateSerializer`
has hydrated cards and resolved references. Six trusted card implementations
opt in through a prototype method: the five Holon cards listed below and
Charjabug UNB. The helper requires a distinct in-play Pokémon holder, one
physical placement, and one matching Energy mirror. It leaves ordinary Pokémon,
ambiguous placements, malformed lists, and shared printed templates untouched.
It adds no wire fields and changes no move implementation or attack handler.

`restoration-only.manifest.tsv` records the exact pre-change and reviewed file
hashes. `restoration-only.results.json` records the focused tests, frozen engine
bundles, and a single repeatable-read corpus comparison: 534 saved states and
3,487 first-action outcomes matched. The dedicated regression suite covers real
hand attachments for all six cards, direct and copied Swagger, multiple copies,
discard/return/reattachment, Ref identity, and public ClientSimulator push/undo/
reset. These corpus action checks compare initial actions; they are not an
exhaustive proof of every possible action sequence.

The earlier `state-serializer.experiment.ts` and Shinx fixtures below are
historical research, not the reviewed implementation. Do not overlay that
name-specific experimental serializer onto the current tree.

## Deferred movement and Buzzap counterexamples

The restoration-only change deliberately preserves existing movement behavior.
`movement-alias.red.spec.fixture.ts` documents five remaining failures, with
four passing controls. Whole-Pokémon bounce/direct `moveTo` can duplicate both
the Holon card and basic Energy because the Energy mirror is moved before the
same physical cards in the main list. Moving a bare Energy mirror can leave its
physical placement behind. Reattaching a duplicated returned Holon can then
throw `CANNOT_USE_POWER`. Normal KnockOutEffect/MoveCardsEffect discard and a
proper PokémonCardList attachment transfer remain unique. The
`moveToTopOfDestination` control preserves its current copy-helper semantics;
blindly clearing its source would break callers that use temporary lists.

`buzzap-choice.red.spec.fixture.ts` separately constructs a post-Buzzap Electrode
BS attachment. Its live two-Water control works, but the snapshot omits the
chosen Energy type and provided symbols, so restoration cannot infer them from
the attachment zone. This is one deliberately failing spec. Electrode BS is
not opted into the six-card fix; no Energy choice is invented. The fixture
isolates saved-state field loss and does not replay Buzzap's power itself.

`deferred-lifecycle.results.json` preserves compact observations and source
hashes. Twelve movement scenarios have the same signatures in the restored
candidate as live Energy form, including the existing failures. Discarded cards
still reconcile their printed Pokémon form on their next ordinary reducer
effect. A card in the Lost Zone is not fanned out and can retain its live Energy
form until restored; this existing behavior is also outside the fix.

Run the intentionally red fixtures only in a disposable checkout:

```sh
cp docs/fixtures/round29-holon-energy/movement-alias.red.spec.fixture.ts /path/to/checkout/ptcg-server/src/sets/tests/holon-movement-research.spec.ts
cp docs/fixtures/round29-holon-energy/buzzap-choice.red.spec.fixture.ts /path/to/checkout/ptcg-server/src/sets/tests/buzzap-choice-research.spec.ts
cd /path/to/checkout/ptcg-server
node scripts/test-card-regressions.cjs '--filter=(holon-movement-research|buzzap-choice-research)'
```

Expect four passes and six failures across these ten research specs. A broader
movement repair must establish atomic physical/mirror ownership and distinguish
transfer from intentional list-copy operations before it can be proposed.

## Original round29 investigation

The deferred Shinx AR 74 candidate exposes a pre-existing snapshot problem. A
Holon's Magnemite attached as Energy is in both the Pokémon slot's `cards` and
`energies.cards`. `StateSerializer` serializes a card by id and recreates it from
the printed template, so the two lists still reference the same card but the
attached card's runtime `superType` reverts from ENERGY to POKEMON. Shinx's shared
Energy-discard prefab filters by superType, and therefore cannot select this
attached Energy after restoration. Live attachment works. `CheckProvidedEnergyEffect`
still finds its single provided symbol.

The six code implementations that mutate Pokémon superType when attached are
Holon's Magnemite DS 70, Holon's Voltorb DS 71, Holon's Magneton DS 22,
Holon's Electrode DS 21, Holon's Castform HP 44, and Charjabug UNB 58. The
attached zone and hand control tests cover the same print as separate physical
cards. These fixtures construct the already-attached state directly, rather than
replaying the original attach action.

## Reproduce

Use a disposable checkout of the post-round-28 simulator, with dependencies and
Node installed. Run the copy command below from this repository root. The `fixture/ptcg-server/` tree contains only the deferred Shinx
class, its helper, and the reproduction spec. Copy it over that checkout; check
for pre-existing files before overwriting. The spec registers the temporary card
through CardManager and does not require a shipping set registration change.

```sh
cp -R docs/fixtures/round29-holon-energy/fixture/ptcg-server/src/. /path/to/checkout/ptcg-server/src/
cd /path/to/checkout/ptcg-server
node scripts/test-card-regressions.cjs --filter=round29-holon-repro
```

Expect restored direct and copied Swagger and six attached-form checks to fail
on the baseline; the live direct control should pass. If the checkout already
registers a different `Shinx AR` printing, remove that temporary collision in
the disposable checkout before running; do not alter production registration.

## Experimental normalization

`state-serializer.experiment.ts` is an isolated prototype based on the baseline
serializer SHA-256 `51f02059d9f13a655c648fb8536a65315b2ff65603d58ce1f98445b8811d9801`. After reference resolution it restores
ENERGY superType only for the six exact existing prints when present in *both*
the active or Benched slot's card and Energy lists. It is not production-ready
or a patch for unrelated card implementations. Initial testing in the isolated
round29 candidate passed 14/14, including all six attachment identities, separate
same-print hand cards, direct and copied Swagger, and Pokémon type after discard.
Baseline with equivalent intended assertions had 6 passes and 8 failures. The
prototype still needs independent review, attach/reattach/reuse, old payload and
malformed-state compatibility, performance checks, broader card interactions,
and tests against the actual integration baseline. Do not blindly overlay it.

Separately, Buizel Splash About's revised candidate uses the upstream
`CheckProvidedEnergyEffect` rather than the number of physical Energy cards.
An independent direct/copied Mew test passed for live and restored Holon Energy,
and the batch's Double Turbo test expects two provided Energy. Historical PUI
Rules Team guidance for Breloom Drain Punch is consistent with counting provided
Energy: https://doczz.net/doc/193314/rulings-compendium-lvx---pokemon-rulings-compendium
The official card text is in https://assets.pokemon.com/assets/cms/pdf/tcg/carddex/DiamondPearl_SecretWonders.pdf
This is an analogous ruling, not a located ruling specific to Buizel.

The fixture baseline returned 1 pass and 8 expected failures. With the prototype and Shinx absent from the catalogue, the fixture registered Shinx locally and passed 9/9. No production code is changed by these materials.

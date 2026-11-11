# First-pass suppression participant classification

This is a manually grouped companion to `pure-suppression-inventory.json`.
`pure-suppression-classification.json` assigns all 71 direct conditional
branches found by that scan to one of the categories below. The labels group
code for review; **they are not pure-hook implementations, no-op certificates,
or proof that all runtime suppression has been found**. A condition's nested
body can contain a throw unrelated to that condition. Each listed rule still
needs its own source and interaction review before a capability registry can
claim completeness.

| Group | Branches | Status and scope |
|---|---:|---|
| Five research rule families | 5 | Galarian Weezing SHF, Empoleon V BST, Iron Thorns ex TWM, Victreebel UNB and Arbok XY have an unwired fixture and limited legacy parity tests. They are not production capabilities. |
| Ability marker or card-state scoped | 4 | Hex Maniac, Canceling Cologne, Greninja BKP and Aerodactyl VSTAR; inspect affected player, marker/card-state source identity, duration and removal. Aerodactyl's enclosing `ancientStarActive` branch invokes an Ability check before examining effect type, so the direct-conditional scan alone misses that nested path. Victreebel and Arbok are counted with the five research rules. |
| Ability source / target scoped | 19 | Garbodor BKP/DRX, Lunatone CES, Mimikyu CEC, Gorebyss FST, Wobbuffet LOT/PHF, Golduck and Psyduck promos, Spiritomb and Ting-Lu ex PAL, Klefki SVI, Alolan Muk, Gastrodon SSP, Flutter Mane TEF, Glaceon GX UPR and the VIV Flareon/Jolteon/Vaporeon family. These vary by owner, in-play slot, target type, stage, tags, damage, paired Pokémon or Tool, and often recursively check the suppressor's own Ability. |
| Stadium or Tool PowerEffect locks | 9 | Path to the Peak, Legendary Lava Lake, Team Rocket's Watchtower, Cessation Crystal, Space Center, Battle Frontier, Energy Root, Silent Lab and Power Plant. Some apply to legacy Poké-Powers/Poké-Bodies or inspect whether the card has a particular power rather than just the queried power type. A pure query also needs Stadium/Tool availability, dynamic type checks and effect protection. |
| Legacy Power / Poké-Body and related rules | 18 | Jirachi ex, Sceptile ex, Gardevoir ex, Muk ex, Medicham ex, Latias HOL, Girafarig/Lunatone/Muk/Solrock LMR, Umbreon ex and Ursaring UF, Fossil Muk, Mesprit LA, Dark Feraligatr, Dialga G Lv.X, Gardevoir SW and Goop Gas Attack. Dark Feraligatr's scanned condition is a Baby Rule rather than a Poké-Body. These matter if the future query covers Zapdos AQ/Moltres SK or other legacy cards. |
| Power observer or effect-protection branch | 2 | Shiftry ex CG reacts to an actual Poké-Power rather than simply blocking; Mega Clefable ex has an Ability-effect protection branch. These cannot be silently discarded as no-ops without reviewing the calling phase and `preventDefault` behavior. |
| Nested own-activation guard | 1 | Audino BCR's scanned `PowerEffect` guard is nested inside `WAS_POWER_USED` for its own Ability. The enclosing branch must be considered when classifying it. |
| Own power-identity condition | 13 | Darkrai & Cresselia Legend, Zoroark BKP, Sky Seal Stone, Emboar LTR, Call Energy, Chien-Pao ex, Rillaboom, Shining Genesect, Forest Seal Stone, Greninja V-UNION and three test-card branches compare against their own power object. This is not an automatic no-op certificate: legacy suppression checks can recursively dispatch a suppressor's actual power object. |

Important implementation details found during this pass:

- **Empoleon V:** current code checks the Rule Box of both Active Pokémon,
  including Empoleon V itself. The fixture preserves this existing behavior;
  correcting the card is a separate gameplay change requiring its own tests.
- **Iron Thorns ex:** current code checks a specific tag list and whether an
  `EffectOfAbilityEffect` target was removed. It does not simply check the
  effect's `preventDefault`; neither a generic boolean protection flag nor an
  inferred printed-card interpretation is a proven substitute.
- **Garbodor DRX:** both source ownership and Stealthy Hood protection matter.
  Its opponent/friendly cases and prevention contract must be retained when
  moving to pure hooks. Multiple other cards recursively query suppression.
- **Types and reprints:** some conditions ask `CheckPokemonTypeEffect` rather
  than the card's printed type; actual top Pokémon, evolution stack, card tags,
  markers and physical source identity must be represented. `PowerEffect`
  overrides, old card print aliases and future upstream changes need separate
  inventory beyond this direct-conditional scan.
- **Unknowns:** generic `PowerEffect` observers, helpers, effect-of-Ability
  protection, dynamically supplied formats and marker hooks can run outside the
  listed branches. Do not infer that the 71 rows exhaust the runtime or that a
  nested call is pure because the state is cloned.

Recommended review order: (1) Ability markers and the common Garbodor/Stadium
families plus Ability-effect protection; (2) remaining Ability source/target
rules with owner/type/stage/tag matrices; (3) legacy Poké-Body/Pokémon Power
and Tool rules; (4) own-activation and observer branches, format overrides and
indirect helpers. Test each pure hook against the existing reducer in isolated
fixtures, then test suppression-of-suppressor cycles, incomplete coverage and
external side effects. Production dispatch must remain unchanged until every
reachable participant for the relevant query is covered.

To refresh the source scan and reapply this first-pass grouping after a sync:

```sh
node tools/inventory-suppression.cjs --write docs/pure-suppression-inventory.json
python3 tools/classify-suppression.py --write docs/pure-suppression-classification.json
```

New unmatched branches appear as `unclassified`; manually review them instead
of assuming their behavior. Changing an already grouped handler can invalidate
its category, so every upstream diff still needs review even if its path remains
recognized.

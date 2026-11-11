import json
from pathlib import Path
import sys
root=Path(__file__).resolve().parent.parent; entries=json.load(open(root/'docs/pure-suppression-inventory.json'))['branches']
groups={
'experimental_five': ['set-shining-fates/galarian-weezing.ts','set-battle-styles/empoleon-v.ts','set-twilight-masquerade/iron-thorns-ex.ts','set-unbroken-bonds/victreebel.ts','set-x-and-y/arbok.ts'],
'ability_marker_or_state_scoped':['set-ancient-origins/hex-maniac.ts','set-astral-radiance/canceling-cologne.ts','set-breakpoint/greninja.ts','set-lost-origin/aerodactyl-vstar.ts'],
'ability_in_play_global_or_target_scoped':['set-breakpoint/garbodor.ts','set-dragons-exalted/garbodor.ts','set-celestial-storm/lunatone.ts','set-cosmic-eclipse/mimikyu-2.ts','set-fusion-strike/gorebyss.ts','set-lost-thunder/wobbuffet.ts','set-mega-evolution-promos/golduck.ts','set-mega-evolution-promos/psyduck.ts','set-paldea-evolved/spiritomb.ts','set-paldea-evolved/ting-lu-ex.ts','set-phantom-forces/wobbuffet.ts','set-scarlet-and-violet/klefki.ts','set-sun-and-moon/alolan-muk.ts','set-surging-sparks/gastrodon.ts','set-temporal-forces/flutter-mane.ts','set-ultra-prism/glaceon-gx.ts','set-vivid-voltage/flareon.ts','set-vivid-voltage/jolteon.ts','set-vivid-voltage/vaporeon.ts'],
'stadium_or_tool_power_lock':['set-chilling-reign/path-to-the-peak.ts','set-delta-reign/legendary-stadiums.ts','set-destined-rivals/team-rockets-watchtower.ts','set-ex-crystal-guardians/cessation-crystal.ts','set-ex-deoxys/space-center.ts','set-ex-power-keepers/battle-frontier.ts','set-ex-unseen-forces/energy-root.ts','set-primal-clash/silent-lab.ts','set-unbroken-bonds/power-plant.ts'],
'legacy_power_or_pokebody_lock':['set-ex-crystal-guardians/jirachi-ex.ts','set-ex-crystal-guardians/sceptile-ex.ts','set-ex-dragon-frontiers/gardevoir-ex.ts','set-ex-dragon/muk-ex.ts','set-ex-emerald/medicham-ex.ts','set-ex-holon-phantoms/latias.ts','set-ex-legend-maker/girafarig.ts','set-ex-legend-maker/lunatone.ts','set-ex-legend-maker/muk.ts','set-ex-legend-maker/solrock.ts','set-ex-unseen-forces/umbreon-ex.ts','set-ex-unseen-forces/ursaring.ts','set-fossil/muk.ts','set-legends-awakened/mesprit.ts','set-neo-destiny/dark-feraligatr.ts','set-platinum/dialga-g-lv-x.ts','set-secret-wonders/gardevoir.ts','set-team-rocket/goop-gas-attack.ts'],
'power_observer_or_effect_protection':['set-ex-crystal-guardians/shiftry-ex.ts','set-perfect-order/mega-clefable-ex.ts'],
'own_activation_nested_guard':['set-boundaries-crossed/audino.ts']}
lookup={name:group for group,names in groups.items() for name in names}
for e in entries:
 e['reviewCategory']=lookup.get(e['file']) or ('own_power_identity_condition' if e['possibleSelfOnly'] else 'unclassified')
 e['migrationStatus']='research fixture only' if e['reviewCategory']=='experimental_five' else 'not migrated'
out={'schema':1,'scope':'Manual first-pass classification of direct conditional branches only; not a complete registry or no-op certification. See migration guide.','branches':entries}
output=json.dumps(out,indent=2)+'\n'
if len(sys.argv)==3 and sys.argv[1]=='--write': Path(sys.argv[2]).write_text(output)
elif len(sys.argv)==1: sys.stdout.write(output)
else: raise SystemExit('Usage: python3 tools/classify-suppression.py [--write output.json]')

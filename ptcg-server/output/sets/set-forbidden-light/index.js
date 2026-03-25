"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setForbiddenLight = void 0;
const abomasnow_1 = require("./abomasnow");
const aegislash_1 = require("./aegislash");
const alolan_exeggutor_1 = require("./alolan-exeggutor");
const alolan_marowak_1 = require("./alolan-marowak");
const amaura_1 = require("./amaura");
const araquanid_1 = require("./araquanid");
const arceus_1 = require("./arceus");
const aurorus_1 = require("./aurorus");
const avalugg_1 = require("./avalugg");
const azelf_1 = require("./azelf");
const barbaracle_1 = require("./barbaracle");
const bergmite_1 = require("./bergmite");
const binacle_1 = require("./binacle");
const braixen_1 = require("./braixen");
const bunnelby_1 = require("./bunnelby");
const buzzwole_1 = require("./buzzwole");
const clauncher_1 = require("./clauncher");
const clawitzer_1 = require("./clawitzer");
const cubone_1 = require("./cubone");
const dedenne_1 = require("./dedenne");
const delphox_1 = require("./delphox");
const dewpider_1 = require("./dewpider");
const dialga_gx_1 = require("./dialga-gx");
const diancie_1 = require("./diancie");
const diancie_prism_star_1 = require("./diancie-prism-star");
const diggersby_1 = require("./diggersby");
const honedge_2_1 = require("./honedge-2");
const doublade_1 = require("./doublade");
const dragalge_1 = require("./dragalge");
const espurr_1 = require("./espurr");
const exeggcute_1 = require("./exeggcute");
const fennekin_1 = require("./fennekin");
const fennekin_2_1 = require("./fennekin-2");
const flabebe_1 = require("./flabebe");
const flabebe_2_1 = require("./flabebe-2");
const floette_1 = require("./floette");
const florges_1 = require("./florges");
const froakie_1 = require("./froakie");
const froakie_2_1 = require("./froakie-2");
const frogadier_1 = require("./frogadier");
const furfrou_1 = require("./furfrou");
const gabite_1 = require("./gabite");
const gogoat_1 = require("./gogoat");
const goodra_1 = require("./goodra");
const goomy_1 = require("./goomy");
const goomy_2_1 = require("./goomy-2");
const greninja_gx_1 = require("./greninja-gx");
const guzzlord_1 = require("./guzzlord");
const hawlucha_1 = require("./hawlucha");
const heliolisk_1 = require("./heliolisk");
const helioptile_1 = require("./helioptile");
const honedge_1 = require("./honedge");
const hoopa_1 = require("./hoopa");
const infernape_1 = require("./infernape");
const inkay_1 = require("./inkay");
const klefki_1 = require("./klefki");
const litleo_1 = require("./litleo");
const lycanroc_1 = require("./lycanroc");
const magnemite_1 = require("./magnemite");
const magnezone_1 = require("./magnezone");
const malamar_1 = require("./malamar");
const meowstic_1 = require("./meowstic");
const mesprit_1 = require("./mesprit");
const naganadel_gx_1 = require("./naganadel-gx");
const noibat_1 = require("./noibat");
const noivern_1 = require("./noivern");
const pancham_1 = require("./pancham");
const pangoro_1 = require("./pangoro");
const pheromosa_1 = require("./pheromosa");
const poipole_1 = require("./poipole");
const pyroar_1 = require("./pyroar");
const rockruff_1 = require("./rockruff");
const rotom_1 = require("./rotom");
const scatterbug_1 = require("./scatterbug");
const scatterbug_2_1 = require("./scatterbug-2");
const skiddo_1 = require("./skiddo");
const skrelp_1 = require("./skrelp");
const sliggoo_1 = require("./sliggoo");
const spewpa_1 = require("./spewpa");
const sylveon_1 = require("./sylveon");
const tyrantrum_1 = require("./tyrantrum");
const tyrunt_1 = require("./tyrunt");
const ultra_necrozma_gx_1 = require("./ultra-necrozma-gx");
const uxie_1 = require("./uxie");
const vivillon_1 = require("./vivillon");
const volcanion_1 = require("./volcanion");
const volcanion_prism_star_1 = require("./volcanion-prism-star");
const xerneas_gx_1 = require("./xerneas-gx");
const xurkitree_1 = require("./xurkitree");
const yveltal_gx_1 = require("./yveltal-gx");
const zygarde_1 = require("./zygarde");
const zygarde_2_1 = require("./zygarde-2");
const zygarde_gx_1 = require("./zygarde-gx");
const beast_ring_1 = require("./beast-ring");
const bonnie_1 = require("./bonnie");
const crasher_wake_1 = require("./crasher-wake");
const diantha_1 = require("./diantha");
const eneporter_1 = require("./eneporter");
const fossil_excavation_map_1 = require("./fossil-excavation-map");
const lysandre_1 = require("./lysandre");
const lysandre_labs_1 = require("./lysandre-labs");
const lysandre_prism_star_1 = require("./lysandre-prism-star");
const metal_frying_pan_1 = require("./metal-frying-pan");
const mysterious_treasure_1 = require("./mysterious-treasure");
const ultra_recon_squad_1 = require("./ultra-recon-squad");
const ultra_space_1 = require("./ultra-space");
const beast_energy_prism_star_1 = require("./beast-energy-prism-star");
const unit_energy_fdy_1 = require("./unit-energy-fdy");
const other_prints_1 = require("./other-prints");
exports.setForbiddenLight = [
    // Pokemon
    new abomasnow_1.Abomasnow(),
    new aegislash_1.Aegislash(),
    new alolan_exeggutor_1.AlolanExeggutor(),
    new alolan_marowak_1.AlolanMarowak(),
    new amaura_1.Amaura(),
    new araquanid_1.Araquanid(),
    new arceus_1.Arceus(),
    new aurorus_1.Aurorus(),
    new avalugg_1.Avalugg(),
    new azelf_1.Azelf(),
    new barbaracle_1.Barbaracle(),
    new bergmite_1.Bergmite(),
    new binacle_1.Binacle(),
    new braixen_1.Braixen(),
    new bunnelby_1.Bunnelby(),
    new buzzwole_1.Buzzwole(),
    new clauncher_1.Clauncher(),
    new clawitzer_1.Clawitzer(),
    new cubone_1.Cubone(),
    new dedenne_1.Dedenne(),
    new delphox_1.Delphox(),
    new dewpider_1.Dewpider(),
    new dialga_gx_1.DialgaGX(),
    new diancie_1.Diancie(),
    new diancie_prism_star_1.DianciePrismStar(),
    new diggersby_1.Diggersby(),
    new doublade_1.Doublade(),
    new dragalge_1.Dragalge(),
    new espurr_1.Espurr(),
    new exeggcute_1.Exeggcute(),
    new fennekin_1.Fennekin(),
    new fennekin_2_1.Fennekin2(),
    new flabebe_1.Flabebe(),
    new flabebe_2_1.Flabebe2(),
    new floette_1.Floette(),
    new florges_1.Florges(),
    new froakie_1.Froakie(),
    new froakie_2_1.FroakieFrubbles(),
    new frogadier_1.Frogadier(),
    new furfrou_1.Furfrou(),
    new gabite_1.Gabite(),
    new gogoat_1.Gogoat(),
    new goodra_1.Goodra(),
    new goomy_1.Goomy(),
    new goomy_2_1.Goomy2(),
    new greninja_gx_1.GreninjaGX(),
    new guzzlord_1.Guzzlord(),
    new hawlucha_1.Hawlucha(),
    new heliolisk_1.Heliolisk(),
    new helioptile_1.Helioptile(),
    new honedge_1.Honedge(),
    new honedge_2_1.Honedge2(),
    new hoopa_1.Hoopa(),
    new infernape_1.Infernape(),
    new inkay_1.Inkay(),
    new klefki_1.Klefki(),
    new litleo_1.Litleo(),
    new lycanroc_1.Lycanroc(),
    new magnemite_1.Magnemite(),
    new magnezone_1.Magnezone(),
    new malamar_1.Malamar(),
    new meowstic_1.Meowstic(),
    new mesprit_1.Mesprit(),
    new naganadel_gx_1.NaganadelGX(),
    new noibat_1.Noibat(),
    new noivern_1.Noivern(),
    new pancham_1.Pancham(),
    new pangoro_1.Pangoro(),
    new pheromosa_1.Pheromosa(),
    new poipole_1.Poipole(),
    new pyroar_1.Pyroar(),
    new rockruff_1.Rockruff(),
    new rotom_1.Rotom(),
    new scatterbug_1.Scatterbug(),
    new scatterbug_2_1.Scatterbug2(),
    new skiddo_1.Skiddo(),
    new skrelp_1.Skrelp(),
    new sliggoo_1.Sliggoo(),
    new spewpa_1.Spewpa(),
    new sylveon_1.Sylveon(),
    new tyrantrum_1.Tyrantrum(),
    new tyrunt_1.Tyrunt(),
    new ultra_necrozma_gx_1.UltraNecrozmaGX(),
    new uxie_1.Uxie(),
    new vivillon_1.Vivillon(),
    new volcanion_1.Volcanion(),
    new volcanion_prism_star_1.VolcanionPrismStar(),
    new xerneas_gx_1.XerneasGX(),
    new xurkitree_1.Xurkitree(),
    new yveltal_gx_1.YveltalGX(),
    new zygarde_1.Zygarde(),
    new zygarde_2_1.Zygarde2(),
    new zygarde_gx_1.ZygardeGx(),
    // Trainers
    new beast_ring_1.BeastRing(),
    new bonnie_1.Bonnie(),
    new crasher_wake_1.CrasherWake(),
    new diantha_1.Diantha(),
    new eneporter_1.Eneporter(),
    new fossil_excavation_map_1.FossilExcavationMap(),
    new lysandre_1.Lysandre(),
    new lysandre_labs_1.LysandreLabs(),
    new lysandre_prism_star_1.LysandrePrismStar(),
    new metal_frying_pan_1.MetalFryingPan(),
    new mysterious_treasure_1.MysteriousTreasure(),
    new ultra_recon_squad_1.UltraReconSquad(),
    new ultra_space_1.UltraSpace(),
    // Energy
    new beast_energy_prism_star_1.BeastEnergy(),
    new unit_energy_fdy_1.UnitEnergyFDY(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.LadyFLI(),
    new other_prints_1.MysteriousTreasureFLI(),
    new other_prints_1.JudgeULFLI(),
    new other_prints_1.UnidentifiedFossilFLI(),
    new other_prints_1.GreninjaGX2FLI(),
    new other_prints_1.NaganadelGX2FLI(),
    new other_prints_1.LucarioGXFLI(),
    new other_prints_1.YveltalGX2FLI(),
    new other_prints_1.DialgaGX2FLI(),
    new other_prints_1.XerneasGX2FLI(),
    new other_prints_1.UltraNecrozmaGX2FLI(),
    new other_prints_1.Diantha2FLI(),
    new other_prints_1.GreninjaGX3FLI(),
    new other_prints_1.NaganadelGX3FLI(),
    new other_prints_1.LucarioGX2FLI(),
    new other_prints_1.YveltalGX3FLI(),
    new other_prints_1.DialgaGX3FLI(),
    new other_prints_1.XerneasGX3FLI(),
    new other_prints_1.UltraNecrozmaGX3FLI(),
    new other_prints_1.BeastRing3FLI(),
    new other_prints_1.EnergyRecyclerFLI(),
    new other_prints_1.MetalFryingPan3FLI(),
    new other_prints_1.MysteriousTreasure3FLI(),
    new other_prints_1.UnitEnergyFDY2FLI(),
    new other_prints_1.AlolanExeggutor2FLI(),
    new other_prints_1.BeastRing2FLI(),
    new other_prints_1.MetalFryingPan2FLI(),
    new other_prints_1.SnoverFLI(),
    new other_prints_1.HeatranFLI(),
    new other_prints_1.PalkiaGxFLI(),
    new other_prints_1.MagnetonFLI(),
    new other_prints_1.TorterraFLI(),
    new other_prints_1.GibleFLI(),
    new other_prints_1.GarchompFLI(),
    new other_prints_1.CroagunkFLI(),
    new other_prints_1.ToxicroakFLI(),
    new other_prints_1.EmpoleonFLI(),
    new other_prints_1.PalkiaGx2(),
    new other_prints_1.ZygardeGx2(),
    new other_prints_1.Bonnie2(),
    new other_prints_1.CrasherWake2(),
    new other_prints_1.UltraReconSquad2(),
    new other_prints_1.PalkiaGx3(),
    new other_prints_1.ZygardeGx3(),
    new other_prints_1.Eneporter2(),
];

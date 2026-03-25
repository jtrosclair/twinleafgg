"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFatesCollide = void 0;
const aerodactyl_1 = require("./aerodactyl");
const alakazam_ex_1 = require("./alakazam-ex");
const altaria_ex_1 = require("./altaria-ex");
const audino_ex_1 = require("./audino-ex");
const barbaracle_1 = require("./barbaracle");
const binacle_1 = require("./binacle");
const braixen_1 = require("./braixen");
const bronzong_1 = require("./bronzong");
const bronzong_break_1 = require("./bronzong-break");
const bronzor_1 = require("./bronzor");
const burmy_1 = require("./burmy");
const carbink_1 = require("./carbink");
const carbink_2_1 = require("./carbink-2");
const carbink_break_1 = require("./carbink-break");
const cinccino_1 = require("./cinccino");
const cinccino_2_1 = require("./cinccino-2");
const cottonee_1 = require("./cottonee");
const deerling_1 = require("./deerling");
const delphox_1 = require("./delphox");
const delphox_break_1 = require("./delphox-break");
const dewgong_1 = require("./dewgong");
const diancie_ex_1 = require("./diancie-ex");
const diglett_1 = require("./diglett");
const duosion_1 = require("./duosion");
const exploud_1 = require("./exploud");
const fennekin_1 = require("./fennekin");
const fennekin_2_1 = require("./fennekin-2");
const genesect_ex_1 = require("./genesect-ex");
const genesect_ex_2_1 = require("./genesect-ex-2");
const glaceon_ex_1 = require("./glaceon-ex");
const gothita_1 = require("./gothita");
const grumpig_1 = require("./grumpig");
const hawlucha_1 = require("./hawlucha");
const jigglypuff_1 = require("./jigglypuff");
const kabuto_1 = require("./kabuto");
const kabutops_1 = require("./kabutops");
const kangaskhan_1 = require("./kangaskhan");
const kingdra_ex_1 = require("./kingdra-ex");
const koffing_1 = require("./koffing");
const larvitar_1 = require("./larvitar");
const larvitar_2_1 = require("./larvitar-2");
const loudred_1 = require("./loudred");
const lucario_1 = require("./lucario");
const lucario_2_1 = require("./lucario-2");
const lugia_1 = require("./lugia");
const lugia_break_1 = require("./lugia-break");
const mega_alakazam_ex_1 = require("./mega-alakazam-ex");
const m_altaria_ex_1 = require("./m-altaria-ex");
const mega_audino_ex_1 = require("./mega-audino-ex");
const mandibuzz_1 = require("./mandibuzz");
const marowak_1 = require("./marowak");
const meowth_1 = require("./meowth");
const mew_1 = require("./mew");
const minccino_1 = require("./minccino");
const minccino_2_1 = require("./minccino-2");
const moltres_1 = require("./moltres");
const mothim_1 = require("./mothim");
const mr_mime_1 = require("./mr-mime");
const omanyte_1 = require("./omanyte");
const omastar_1 = require("./omastar");
const omastar_break_1 = require("./omastar-break");
const pupitar_1 = require("./pupitar");
const regirock_ex_1 = require("./regirock-ex");
const reuniclus_1 = require("./reuniclus");
const riolu_1 = require("./riolu");
const riolu_2_1 = require("./riolu-2");
const rotom_1 = require("./rotom");
const seel_1 = require("./seel");
const serperior_1 = require("./serperior");
const servine_1 = require("./servine");
const shuckle_1 = require("./shuckle");
const snivy_1 = require("./snivy");
const snorlax_1 = require("./snorlax");
const snubbull_1 = require("./snubbull");
const solosis_1 = require("./solosis");
const spoink_1 = require("./spoink");
const tyranitar_1 = require("./tyranitar");
const umbreon_ex_1 = require("./umbreon-ex");
const vullaby_1 = require("./vullaby");
const weezing_1 = require("./weezing");
const whimsicott_1 = require("./whimsicott");
const whismur_1 = require("./whismur");
const white_kyurem_1 = require("./white-kyurem");
const wigglytuff_1 = require("./wigglytuff");
const wormadam_1 = require("./wormadam");
const wormadam_2_1 = require("./wormadam-2");
const wormadam_3_1 = require("./wormadam-3");
const zygarde_1 = require("./zygarde");
const zygarde_2_1 = require("./zygarde-2");
const zygarde_ex_1 = require("./zygarde-ex");
const alakazam_spirit_link_1 = require("./alakazam-spirit-link");
const altaria_spirit_link_1 = require("./altaria-spirit-link");
const audino_spirit_link_1 = require("./audino-spirit-link");
const bent_spoon_1 = require("./bent-spoon");
const chaos_tower_1 = require("./chaos-tower");
const dome_fossil_kabuto_1 = require("./dome-fossil-kabuto");
const energy_pouch_1 = require("./energy-pouch");
const energy_reset_1 = require("./energy-reset");
const fairy_drop_1 = require("./fairy-drop");
const fossil_excavation_kit_1 = require("./fossil-excavation-kit");
const helix_fossil_omanyte_1 = require("./helix-fossil-omanyte");
const lasss_special_1 = require("./lasss-special");
const mega_catcher_1 = require("./mega-catcher");
const n_1 = require("./n");
const old_amber_aerodactyl_1 = require("./old-amber-aerodactyl");
const power_memory_1 = require("./power-memory");
const team_rockets_handiwork_1 = require("./team-rockets-handiwork");
const other_prints_1 = require("./other-prints");
exports.setFatesCollide = [
    // Pokemon
    new aerodactyl_1.Aerodactyl(),
    new alakazam_ex_1.AlakazamEx(),
    new altaria_ex_1.AltariaEx(),
    new audino_ex_1.AudinoEx(),
    new barbaracle_1.Barbaracle(),
    new binacle_1.Binacle(),
    new braixen_1.Braixen(),
    new bronzong_1.Bronzong(),
    new bronzong_break_1.BronzongBREAK(),
    new bronzor_1.Bronzor(),
    new burmy_1.Burmy(),
    new carbink_1.Carbink(),
    new carbink_2_1.Carbink2(),
    new carbink_break_1.CarbinkBreak(),
    new cinccino_1.Cinccino(),
    new cinccino_2_1.Cinccino2(),
    new cottonee_1.Cottonee(),
    new deerling_1.Deerling(),
    new delphox_1.Delphox(),
    new delphox_break_1.DelphoxBreak(),
    new dewgong_1.Dewgong(),
    new diancie_ex_1.DiancieEx(),
    new diglett_1.Diglett(),
    new duosion_1.Duosion(),
    new exploud_1.Exploud(),
    new fennekin_1.Fennekin(),
    new fennekin_2_1.Fennekin2(),
    new genesect_ex_1.GenesectEx(),
    new genesect_ex_2_1.GenesectEx2(),
    new glaceon_ex_1.GlaceonEx(),
    new gothita_1.Gothita(),
    new grumpig_1.Grumpig(),
    new hawlucha_1.Hawlucha(),
    new jigglypuff_1.Jigglypuff(),
    new kabuto_1.Kabuto(),
    new kabutops_1.Kabutops(),
    new kangaskhan_1.Kangaskhan(),
    new kingdra_ex_1.KingdraEx(),
    new koffing_1.Koffing(),
    new larvitar_1.Larvitar(),
    new larvitar_2_1.Larvitar2(),
    new loudred_1.Loudred(),
    new lucario_1.Lucario(),
    new lucario_2_1.Lucario2(),
    new lugia_1.Lugia(),
    new lugia_break_1.LugiaBreak(),
    new mega_alakazam_ex_1.MAlakazamEx(),
    new m_altaria_ex_1.MAltariaEx(),
    new mega_audino_ex_1.MAudinoEx(),
    new mandibuzz_1.Mandibuzz(),
    new marowak_1.Marowak(),
    new meowth_1.Meowth(),
    new mew_1.Mew(),
    new minccino_1.Minccino(),
    new minccino_2_1.Minccino2(),
    new moltres_1.Moltres(),
    new mothim_1.Mothim(),
    new mr_mime_1.MrMime(),
    new omanyte_1.Omanyte(),
    new omastar_1.Omastar(),
    new omastar_break_1.OmastarBreak(),
    new pupitar_1.Pupitar(),
    new regirock_ex_1.RegirockEx(),
    new reuniclus_1.Reuniclus(),
    new riolu_1.Riolu(),
    new riolu_2_1.Riolu2(),
    new rotom_1.Rotom(),
    new seel_1.Seel(),
    new serperior_1.Serperior(),
    new servine_1.Servine(),
    new shuckle_1.Shuckle(),
    new snivy_1.Snivy(),
    new snorlax_1.Snorlax(),
    new snubbull_1.Snubbull(),
    new solosis_1.Solosis(),
    new spoink_1.Spoink(),
    new tyranitar_1.Tyranitar(),
    new umbreon_ex_1.UmbreonEx(),
    new vullaby_1.Vullaby(),
    new weezing_1.Weezing(),
    new whimsicott_1.Whimsicott(),
    new whismur_1.Whismur(),
    new white_kyurem_1.WhiteKyurem(),
    new wigglytuff_1.Wigglytuff(),
    new wormadam_1.Wormadam(),
    new wormadam_2_1.Wormadam2(),
    new wormadam_3_1.Wormadam3(),
    new zygarde_1.Zygarde(),
    new zygarde_2_1.Zygarde2(),
    new zygarde_ex_1.ZygardeEx(),
    // Trainers
    new alakazam_spirit_link_1.AlakazamSpiritLink(),
    new altaria_spirit_link_1.AltariaSpiritLink(),
    new audino_spirit_link_1.AudinoSpiritLink(),
    new bent_spoon_1.BentSpoon(),
    new chaos_tower_1.ChaosTower(),
    new dome_fossil_kabuto_1.DomeFossilKabuto(),
    new energy_pouch_1.EnergyPouch(),
    new energy_reset_1.EnergyReset(),
    new fairy_drop_1.FairyDrop(),
    new fossil_excavation_kit_1.FossilExcavationKit(),
    new helix_fossil_omanyte_1.HelixFossilOmanyte(),
    new lasss_special_1.LasssSpecial(),
    new mega_catcher_1.MegaCatcher(),
    new n_1.N(),
    new old_amber_aerodactyl_1.OldAmberAerodactyl(),
    new power_memory_1.PowerMemory(),
    new team_rockets_handiwork_1.TeamRocketsHandiwork(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.RegirockEx2(),
    new other_prints_1.ZygardeEx2(),
    new other_prints_1.DevolutionSprayFCO(),
    new other_prints_1.FairyGardenFCO(),
    new other_prints_1.N2(),
    new other_prints_1.PokemonFanClubFCO(),
    new other_prints_1.RandomReceiverFCO(),
    new other_prints_1.ScorchedEarthFCO(),
    new other_prints_1.ShaunaFCO(),
    new other_prints_1.Shauna2(),
    new other_prints_1.UltraBallFCO(),
    new other_prints_1.DoubleColorlessEnergyFCO(),
    new other_prints_1.StrongEnergyFCO(),
    new other_prints_1.GlaceonEx2(),
    new other_prints_1.AlakazamEx2(),
    new other_prints_1.MAlakazamEx2(),
    new other_prints_1.UmbreonEx2(),
    new other_prints_1.MAltariaEx2(),
    new other_prints_1.KingdraEx2(),
    new other_prints_1.AltariaEx2(),
    new other_prints_1.TeamRocketsHandiwork2(),
    new other_prints_1.AlakazamEx3(),
];

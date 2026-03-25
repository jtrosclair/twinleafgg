"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setChillingReign = void 0;
const abomasnow_1 = require("./abomasnow");
const aggron_1 = require("./aggron");
const ampharos_1 = require("./ampharos");
const aron_1 = require("./aron");
const banette_1 = require("./banette");
const beedrill_1 = require("./beedrill");
const blaziken_v_1 = require("./blaziken-v");
const blaziken_vmax_1 = require("./blaziken-vmax");
const blissey_v_1 = require("./blissey-v");
const blitzle_1 = require("./blitzle");
const bounsweet_1 = require("./bounsweet");
const castform_1 = require("./castform");
const castform_rainy_form_1 = require("./castform-rainy-form");
const castform_snowy_form_1 = require("./castform-snowy-form");
const castform_sunny_form_1 = require("./castform-sunny-form");
const celebi_v_1 = require("./celebi-v");
const celebi_vmax_1 = require("./celebi-vmax");
const cinderace_1 = require("./cinderace");
const clobbopus_1 = require("./clobbopus");
const cobalion_1 = require("./cobalion");
const crabominable_1 = require("./crabominable");
const crabrawler_1 = require("./crabrawler");
const cresselia_1 = require("./cresselia");
const deerling_1 = require("./deerling");
const delibird_1 = require("./delibird");
const diglett_1 = require("./diglett");
const drizzile_1 = require("./drizzile");
const dugtrio_1 = require("./dugtrio");
const electrode_1 = require("./electrode");
const flaaffy_1 = require("./flaaffy");
const froslass_1 = require("./froslass");
const furfrou_1 = require("./furfrou");
const galarian_articuno_v_1 = require("./galarian-articuno-v");
const galarian_farfetchd_1 = require("./galarian-farfetchd");
const galarian_moltres_v_1 = require("./galarian-moltres-v");
const galarian_rapidash_v_1 = require("./galarian-rapidash-v");
const galarian_runerigus_1 = require("./galarian-runerigus");
const galarian_sirfetchd_1 = require("./galarian-sirfetchd");
const galarian_slowking_1 = require("./galarian-slowking");
const galarian_slowking_v_1 = require("./galarian-slowking-v");
const galarian_slowking_vmax_1 = require("./galarian-slowking-vmax");
const galarian_slowpoke_1 = require("./galarian-slowpoke");
const galarian_weezing_1 = require("./galarian-weezing");
const galarian_yamask_1 = require("./galarian-yamask");
const galarian_zapdos_v_1 = require("./galarian-zapdos-v");
const gallade_1 = require("./gallade");
const gardevoir_1 = require("./gardevoir");
const gastly_1 = require("./gastly");
const gengar_1 = require("./gengar");
const golett_1 = require("./golett");
const golurk_1 = require("./golurk");
const grapploct_1 = require("./grapploct");
const greedent_1 = require("./greedent");
const grookey_1 = require("./grookey");
const hatenna_1 = require("./hatenna");
const hatterene_1 = require("./hatterene");
const hattrem_1 = require("./hattrem");
const haunter_1 = require("./haunter");
const heracross_1 = require("./heracross");
const ice_rider_calyrex_v_1 = require("./ice-rider-calyrex-v");
const ice_rider_calyrex_vmax_1 = require("./ice-rider-calyrex-vmax");
const inkay_1 = require("./inkay");
const inteleon_1 = require("./inteleon");
const kakuna_1 = require("./kakuna");
const kecleon_1 = require("./kecleon");
const kirlia_1 = require("./kirlia");
const kubfu_1 = require("./kubfu");
const lairon_1 = require("./lairon");
const lapras_1 = require("./lapras");
const larvesta_1 = require("./larvesta");
const ledian_1 = require("./ledian");
const ledyba_1 = require("./ledyba");
const liepard_v_1 = require("./liepard-v");
const lycanroc_1 = require("./lycanroc");
const malamar_1 = require("./malamar");
const mareep_1 = require("./mareep");
const metagross_v_1 = require("./metagross-v");
const metagross_vmax_1 = require("./metagross-vmax");
const passimian_1 = require("./passimian");
const porygon_1 = require("./porygon");
const porygon_z_1 = require("./porygon-z");
const porygon2_1 = require("./porygon2");
const qwilfish_1 = require("./qwilfish");
const raboot_1 = require("./raboot");
const ralts_1 = require("./ralts");
const rapid_strike_urshifu_1 = require("./rapid-strike-urshifu");
const rillaboom_1 = require("./rillaboom");
const rockruff_1 = require("./rockruff");
const sandaconda_v_1 = require("./sandaconda-v");
const sandaconda_vmax_1 = require("./sandaconda-vmax");
const sawsbuck_1 = require("./sawsbuck");
const scolipede_1 = require("./scolipede");
const scorbunny_1 = require("./scorbunny");
const sealeo_1 = require("./sealeo");
const seviper_1 = require("./seviper");
const shadow_rider_calyrex_v_1 = require("./shadow-rider-calyrex-v");
const shadow_rider_calyrex_vmax_1 = require("./shadow-rider-calyrex-vmax");
const shaymin_1 = require("./shaymin");
const shuppet_1 = require("./shuppet");
const single_strike_urshifu_1 = require("./single-strike-urshifu");
const skwovet_1 = require("./skwovet");
const slurpuff_1 = require("./slurpuff");
const sneasel_1 = require("./sneasel");
const snorunt_1 = require("./snorunt");
const snover_1 = require("./snover");
const sobble_1 = require("./sobble");
const spheal_1 = require("./spheal");
const spiritomb_1 = require("./spiritomb");
const steenee_1 = require("./steenee");
const swirlix_1 = require("./swirlix");
const tapu_fini_1 = require("./tapu-fini");
const tauros_1 = require("./tauros");
const thundurus_1 = require("./thundurus");
const thwackey_1 = require("./thwackey");
const tornadus_v_1 = require("./tornadus-v");
const tornadus_vmax_1 = require("./tornadus-vmax");
const tsareena_1 = require("./tsareena");
const volcanion_v_1 = require("./volcanion-v");
const volcarona_1 = require("./volcarona");
const walrein_1 = require("./walrein");
const weavile_1 = require("./weavile");
const weedle_1 = require("./weedle");
const weezing_1 = require("./weezing");
const whirlipede_1 = require("./whirlipede");
const zangoose_1 = require("./zangoose");
const zarude_1 = require("./zarude");
const zebstrika_1 = require("./zebstrika");
const zeraora_v_1 = require("./zeraora-v");
const agatha_1 = require("./agatha");
const avery_1 = require("./avery");
const brawly_1 = require("./brawly");
const caitlin_1 = require("./caitlin");
const crushing_gloves_1 = require("./crushing-gloves");
const doctor_1 = require("./doctor");
const dyna_tree_hill_1 = require("./dyna-tree-hill");
const echoing_horn_1 = require("./echoing-horn");
const expedition_uniform_1 = require("./expedition-uniform");
const fire_resistant_gloves_1 = require("./fire-resistant-gloves");
const flannery_1 = require("./flannery");
const fog_crystal_1 = require("./fog-crystal");
const galarian_chestplate_1 = require("./galarian-chestplate");
const honey_1 = require("./honey");
const justified_gloves_1 = require("./justified-gloves");
const karens_conviction_1 = require("./karens-conviction");
const klara_1 = require("./klara");
const melony_1 = require("./melony");
const old_cemetery_1 = require("./old-cemetery");
const path_to_the_peak_1 = require("./path-to-the-peak");
const peonia_1 = require("./peonia");
const peony_1 = require("./peony");
const rapid_strike_scroll_of_the_skies_1 = require("./rapid-strike-scroll-of-the-skies");
const rugged_helmet_1 = require("./rugged-helmet");
const siebold_1 = require("./siebold");
const single_strike_scroll_of_piercing_1 = require("./single-strike-scroll-of-piercing");
const weeding_gloves_1 = require("./weeding-gloves");
const welcoming_lantern_1 = require("./welcoming-lantern");
const impact_energy_1 = require("./impact-energy");
const lucky_energy_1 = require("./lucky-energy");
const spiral_energy_1 = require("./spiral-energy");
const other_prints_1 = require("./other-prints");
exports.setChillingReign = [
    // Pokemon
    new abomasnow_1.Abomasnow(),
    new aggron_1.Aggron(),
    new ampharos_1.Ampharos(),
    new aron_1.Aron(),
    new banette_1.Banette(),
    new beedrill_1.Beedrill(),
    new blaziken_v_1.BlazikenV(),
    new blaziken_vmax_1.BlazikenVMAX(),
    new blissey_v_1.BlisseyV(),
    new blitzle_1.Blitzle(),
    new bounsweet_1.Bounsweet(),
    new castform_1.Castform(),
    new castform_rainy_form_1.CastformRainyForm(),
    new castform_snowy_form_1.CastformSnowyForm(),
    new castform_sunny_form_1.CastformSunnyForm(),
    new celebi_v_1.CelebiV(),
    new celebi_vmax_1.CelebiVmax(),
    new cinderace_1.Cinderace(),
    new clobbopus_1.Clobbopus(),
    new cobalion_1.Cobalion(),
    new crabominable_1.Crabominable(),
    new crabrawler_1.Crabrawler(),
    new cresselia_1.Cresselia(),
    new deerling_1.Deerling(),
    new delibird_1.Delibird(),
    new diglett_1.Diglett(),
    new drizzile_1.Drizzile(),
    new dugtrio_1.Dugtrio(),
    new electrode_1.Electrode(),
    new flaaffy_1.Flaaffy(),
    new froslass_1.Froslass(),
    new furfrou_1.Furfrou(),
    new galarian_articuno_v_1.GalarianArticunoV(),
    new galarian_farfetchd_1.GalarianFarfetchd(),
    new galarian_moltres_v_1.GalarianMoltresV(),
    new galarian_rapidash_v_1.GalarianRapidashV(),
    new galarian_runerigus_1.GalarianRunerigus(),
    new galarian_sirfetchd_1.GalarianSirfetchd(),
    new galarian_slowking_1.GalarianSlowking(),
    new galarian_slowking_v_1.GalarianSlowkingV(),
    new galarian_slowking_vmax_1.GalarianSlowkingVmax(),
    new galarian_slowpoke_1.GalarianSlowpoke(),
    new galarian_weezing_1.GalarianWeezing(),
    new galarian_yamask_1.GalarianYamask(),
    new galarian_zapdos_v_1.GalarianZapdosV(),
    new gallade_1.Gallade(),
    new gardevoir_1.Gardevoir(),
    new gastly_1.Gastly(),
    new gengar_1.Gengar(),
    new golett_1.Golett(),
    new golurk_1.Golurk(),
    new grapploct_1.Grapploct(),
    new greedent_1.Greedent(),
    new grookey_1.Grookey(),
    new hatenna_1.Hatenna(),
    new hatterene_1.Hatterene(),
    new hattrem_1.Hattrem(),
    new haunter_1.Haunter(),
    new heracross_1.Heracross(),
    new ice_rider_calyrex_v_1.IceRiderCalyrexV(),
    new ice_rider_calyrex_vmax_1.IceRiderCalyrexVMAX(),
    new inkay_1.Inkay(),
    new inteleon_1.Inteleon(),
    new kakuna_1.Kakuna(),
    new kecleon_1.Kecleon(),
    new kirlia_1.Kirlia(),
    new kubfu_1.Kubfu(),
    new lairon_1.Lairon(),
    new lapras_1.Lapras(),
    new larvesta_1.Larvesta(),
    new ledian_1.Ledian(),
    new ledyba_1.Ledyba(),
    new liepard_v_1.LiepardV(),
    new lycanroc_1.Lycanroc(),
    new malamar_1.Malamar(),
    new mareep_1.Mareep(),
    new metagross_v_1.MetagrossV(),
    new metagross_vmax_1.MetagrossVmax(),
    new passimian_1.Passimian(),
    new porygon_1.Porygon(),
    new porygon_z_1.PorygonZ(),
    new porygon2_1.Porygon2(),
    new qwilfish_1.Qwilfish(),
    new raboot_1.Raboot(),
    new ralts_1.Ralts(),
    new rapid_strike_urshifu_1.RapidStrikeUrshifu(),
    new rillaboom_1.Rillaboom(),
    new rockruff_1.Rockruff(),
    new sandaconda_v_1.SandacondaV(),
    new sandaconda_vmax_1.SandacondaVmax(),
    new sawsbuck_1.Sawsbuck(),
    new scolipede_1.Scolipede(),
    new scorbunny_1.Scorbunny(),
    new sealeo_1.Sealeo(),
    new seviper_1.Seviper(),
    new shadow_rider_calyrex_v_1.ShadowRiderCalyrexV(),
    new shadow_rider_calyrex_vmax_1.ShadowRiderCalyrexVMAX(),
    new shaymin_1.Shaymin(),
    new shuppet_1.Shuppet(),
    new single_strike_urshifu_1.SingleStrikeUrshifu(),
    new skwovet_1.Skwovet(),
    new slurpuff_1.Slurpuff(),
    new sneasel_1.Sneasel(),
    new snorunt_1.Snorunt(),
    new snover_1.Snover(),
    new sobble_1.Sobble(),
    new spheal_1.Spheal(),
    new spiritomb_1.Spiritomb(),
    new steenee_1.Steenee(),
    new swirlix_1.Swirlix(),
    new tapu_fini_1.TapuFini(),
    new tauros_1.Tauros(),
    new thundurus_1.Thundurus(),
    new thwackey_1.Thwackey(),
    new tornadus_v_1.TornadusV(),
    new tornadus_vmax_1.TornadusVmax(),
    new tsareena_1.Tsareena(),
    new volcanion_v_1.VolcanionV(),
    new volcarona_1.Volcarona(),
    new walrein_1.Walrein(),
    new weavile_1.Weavile(),
    new weedle_1.WeedleCRE(),
    new weezing_1.Weezing(),
    new whirlipede_1.Whirlipede(),
    new zangoose_1.Zangoose(),
    new zarude_1.Zarude(),
    new zebstrika_1.Zebstrika(),
    new zeraora_v_1.ZeraoraV(),
    // Trainers
    new agatha_1.Agatha(),
    new avery_1.Avery(),
    new brawly_1.Brawly(),
    new caitlin_1.Caitlin(),
    new crushing_gloves_1.CrushingGloves(),
    new doctor_1.Doctor(),
    new dyna_tree_hill_1.DynaTreeHill(),
    new echoing_horn_1.EchoingHorn(),
    new expedition_uniform_1.ExpeditionUniform(),
    new fire_resistant_gloves_1.FireResistantGloves(),
    new flannery_1.Flannery(),
    new fog_crystal_1.FogCrystal(),
    new galarian_chestplate_1.GalarianChestplate(),
    new honey_1.Honey(),
    new justified_gloves_1.JustifiedGloves(),
    new karens_conviction_1.KarensConviction(),
    new klara_1.Klara(),
    new melony_1.Melony(),
    new old_cemetery_1.OldCemetery(),
    new path_to_the_peak_1.PathToThePeak(),
    new peonia_1.Peonia(),
    new peony_1.Peony(),
    new rapid_strike_scroll_of_the_skies_1.RapidStrikeScrollOfTheSkies(),
    new rugged_helmet_1.RuggedHelmet(),
    new siebold_1.Siebold(),
    new single_strike_scroll_of_piercing_1.SingleStrikeScrollOfPiercing(),
    new weeding_gloves_1.WeedingGloves(),
    new welcoming_lantern_1.WelcomingLantern(),
    // Energy
    new impact_energy_1.ImpactEnergy(),
    new lucky_energy_1.LuckyEnergy(),
    new spiral_energy_1.SpiralEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.BronzongCRE(),
    new other_prints_1.BlazikenV2CRE(),
    new other_prints_1.IceRiderCalyrexV2CRE(),
    new other_prints_1.IceRiderCalyrexV3CRE(),
    new other_prints_1.GalarianArticunoV2CRE(),
    new other_prints_1.GalarianArticunoV3CRE(),
    new other_prints_1.ShadowRiderCalyrexV2CRE(),
    new other_prints_1.ShadowRiderCalyrexV3CRE(),
    new other_prints_1.GalarianZapdosV2CRE(),
    new other_prints_1.GalarianZapdosV3CRE(),
    new other_prints_1.GalarianMoltresV2CRE(),
    new other_prints_1.GalarianMoltresV3CRE(),
    new other_prints_1.BlisseyV2CRE(),
    new other_prints_1.BlisseyV3CRE(),
    new other_prints_1.Agatha2CRE(),
    new other_prints_1.Avery2CRE(),
    new other_prints_1.Brawly2CRE(),
    new other_prints_1.Caitlin2CRE(),
    new other_prints_1.Flannery2CRE(),
    new other_prints_1.KarensConviction2CRE(),
    new other_prints_1.Klara2CRE(),
    new other_prints_1.Melony2CRE(),
    new other_prints_1.Peonia2CRE(),
    new other_prints_1.Peony2CRE(),
    new other_prints_1.BlazikenVMAX2CRE(),
    new other_prints_1.BlazikenVMAX3CRE(),
    new other_prints_1.IceRiderCalyrexVMAX2CRE(),
    new other_prints_1.IceRiderCalyrexVMAX3CRE(),
    new other_prints_1.ShadowRiderCalyrexVMAX2CRE(),
    new other_prints_1.ShadowRiderCalyrexVMAX3CRE(),
    new other_prints_1.Agatha3CRE(),
    new other_prints_1.Avery3CRE(),
    new other_prints_1.Brawly3CRE(),
    new other_prints_1.Caitlin3CRE(),
    new other_prints_1.Flannery3CRE(),
    new other_prints_1.KarensConviction3CRE(),
    new other_prints_1.Klara3CRE(),
    new other_prints_1.Melony3CRE(),
    new other_prints_1.Peonia3CRE(),
    new other_prints_1.Peony3CRE(),
    new other_prints_1.SnorlaxCRE(),
    new other_prints_1.EchoingHorn2CRE(),
    new other_prints_1.FanOfWavesCRE(),
    new other_prints_1.FogCrystal2CRE(),
    new other_prints_1.UrnOfVitalityCRE(),
    new other_prints_1.WaterEnergyCRE(),
    new other_prints_1.PsychicEnergyCRE(),
    new other_prints_1.FightingEnergyCRE(),
    new other_prints_1.KoffingCRE(),
    new other_prints_1.VenipedeCRE(),
    new other_prints_1.CelebiV2(),
    new other_prints_1.VolcanionV2(),
    new other_prints_1.ZeraoraV2(),
    new other_prints_1.ZeraoraV3(),
    new other_prints_1.GalarianRapidashV2(),
    new other_prints_1.SandacondaV2(),
    new other_prints_1.GalarianSlowkingV2(),
    new other_prints_1.GalarianSlowkingV3(),
    new other_prints_1.LiepardV2(),
    new other_prints_1.MetagrossV2(),
    new other_prints_1.TornadusV2(),
    new other_prints_1.TornadusV3(),
    new other_prints_1.Doctor2(),
    new other_prints_1.Honey2(),
    new other_prints_1.Siebold2(),
    new other_prints_1.CelebiVmax2(),
    new other_prints_1.SandacondaVmax2(),
    new other_prints_1.GalarianSlowkingVmax2(),
    new other_prints_1.MetagrossVmax2(),
    new other_prints_1.TornadusVmax2(),
    new other_prints_1.Doctor3(),
    new other_prints_1.Siebold3(),
    new other_prints_1.RuggedHelmet2(),
    new other_prints_1.WelcomingLantern2(),
];

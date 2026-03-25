"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLostOrigin = void 0;
const abomasnow_1 = require("./abomasnow");
const aerodactyl_v_1 = require("./aerodactyl-v");
const aerodactyl_vstar_1 = require("./aerodactyl-vstar");
const aipom_1 = require("./aipom");
const ambipom_1 = require("./ambipom");
const ariados_1 = require("./ariados");
const banette_1 = require("./banette");
const barbaracle_1 = require("./barbaracle");
const beautifly_1 = require("./beautifly");
const binacle_1 = require("./binacle");
const bouffalant_1 = require("./bouffalant");
const bronzong_1 = require("./bronzong");
const bronzor_1 = require("./bronzor");
const carbink_1 = require("./carbink");
const cascoon_1 = require("./cascoon");
const chandelure_1 = require("./chandelure");
const clefable_1 = require("./clefable");
const clefairy_1 = require("./clefairy");
const comfey_1 = require("./comfey");
const cramorant_1 = require("./cramorant");
const cresselia_1 = require("./cresselia");
const darkrai_1 = require("./darkrai");
const delphox_v_1 = require("./delphox-v");
const dewgong_1 = require("./dewgong");
const dottler_1 = require("./dottler");
const drapion_v_1 = require("./drapion-v");
const drapion_vstar_1 = require("./drapion-vstar");
const dustox_1 = require("./dustox");
const eelektrik_1 = require("./eelektrik");
const eelektross_1 = require("./eelektross");
const electrike_1 = require("./electrike");
const enamorus_v_1 = require("./enamorus-v");
const falinks_1 = require("./falinks");
const finneon_1 = require("./finneon");
const galarian_perrserker_v_1 = require("./galarian-perrserker-v");
const galarian_stunfisk_1 = require("./galarian-stunfisk");
const gallade_v_1 = require("./gallade-v");
const gastly_1 = require("./gastly");
const gastrodon_1 = require("./gastrodon");
const gengar_1 = require("./gengar");
const giratina_v_1 = require("./giratina-v");
const giratina_vstar_1 = require("./giratina-vstar");
const glastrier_1 = require("./glastrier");
const gligar_1 = require("./gligar");
const gliscor_1 = require("./gliscor");
const gloom_1 = require("./gloom");
const greedent_1 = require("./greedent");
const hariyama_1 = require("./hariyama");
const haunter_1 = require("./haunter");
const hisuian_arcanine_1 = require("./hisuian-arcanine");
const hisuian_basculegion_1 = require("./hisuian-basculegion");
const hisuian_basculin_1 = require("./hisuian-basculin");
const hisuian_goodra_1 = require("./hisuian-goodra");
const hisuian_goodra_v_1 = require("./hisuian-goodra-v");
const hisuian_goodra_vstar_1 = require("./hisuian-goodra-vstar");
const hisuian_growlithe_1 = require("./hisuian-growlithe");
const hisuian_sliggoo_1 = require("./hisuian-sliggoo");
const hisuian_zoroark_1 = require("./hisuian-zoroark");
const hisuian_zoroark_v_1 = require("./hisuian-zoroark-v");
const hisuian_zoroark_vstar_1 = require("./hisuian-zoroark-vstar");
const hisuian_zorua_1 = require("./hisuian-zorua");
const honchkrow_1 = require("./honchkrow");
const hoopa_1 = require("./hoopa");
const horsea_1 = require("./horsea");
const inkay_1 = require("./inkay");
const jynx_1 = require("./jynx");
const kingdra_1 = require("./kingdra");
const komala_1 = require("./komala");
const kyurem_v_1 = require("./kyurem-v");
const kyurem_vmax_1 = require("./kyurem-vmax");
const lampent_1 = require("./lampent");
const landorus_1 = require("./landorus");
const lickilicky_1 = require("./lickilicky");
const lickitung_1 = require("./lickitung");
const litleo_1 = require("./litleo");
const litwick_1 = require("./litwick");
const lumineon_1 = require("./lumineon");
const luvdisc_1 = require("./luvdisc");
const machamp_1 = require("./machamp");
const machoke_1 = require("./machoke");
const machop_1 = require("./machop");
const magcargo_1 = require("./magcargo");
const magearna_1 = require("./magearna");
const magnezone_v_1 = require("./magnezone-v");
const magnezone_vstar_1 = require("./magnezone-vstar");
const makuhita_1 = require("./makuhita");
const malamar_1 = require("./malamar");
const manectric_1 = require("./manectric");
const mawile_1 = require("./mawile");
const medicham_1 = require("./medicham");
const meditite_1 = require("./meditite");
const mienfoo_1 = require("./mienfoo");
const mienshao_1 = require("./mienshao");
const mimikyu_1 = require("./mimikyu");
const mr_mime_1 = require("./mr-mime");
const nuzleaf_1 = require("./nuzleaf");
const oddish_1 = require("./oddish");
const orbeetle_1 = require("./orbeetle");
const paras_1 = require("./paras");
const parasect_1 = require("./parasect");
const phantump_1 = require("./phantump");
const pidgeot_v_1 = require("./pidgeot-v");
const pikachu_1 = require("./pikachu");
const politoed_1 = require("./politoed");
const poliwag_1 = require("./poliwag");
const poliwhirl_1 = require("./poliwhirl");
const poliwrath_1 = require("./poliwrath");
const porygon_1 = require("./porygon");
const porygon_z_1 = require("./porygon-z");
const porygon2_1 = require("./porygon2");
const pyroar_1 = require("./pyroar");
const radiant_gardevoir_1 = require("./radiant-gardevoir");
const radiant_hisuian_sneasler_1 = require("./radiant-hisuian-sneasler");
const radiant_steelix_1 = require("./radiant-steelix");
const raichu_1 = require("./raichu");
const relicanth_1 = require("./relicanth");
const rhydon_1 = require("./rhydon");
const rhyperior_1 = require("./rhyperior");
const rockruff_1 = require("./rockruff");
const roselia_1 = require("./roselia");
const roserade_1 = require("./roserade");
const rotom_v_1 = require("./rotom-v");
const sableye_1 = require("./sableye");
const seadra_1 = require("./seadra");
const seedot_1 = require("./seedot");
const seel_1 = require("./seel");
const seviper_1 = require("./seviper");
const shellos_1 = require("./shellos");
const shiftry_1 = require("./shiftry");
const shuppet_1 = require("./shuppet");
const silcoon_1 = require("./silcoon");
const skwovet_1 = require("./skwovet");
const slugma_1 = require("./slugma");
const snorlax_1 = require("./snorlax");
const snover_1 = require("./snover");
const spectrier_1 = require("./spectrier");
const spinarak_1 = require("./spinarak");
const spiritomb_1 = require("./spiritomb");
const stonjourner_1 = require("./stonjourner");
const sudowoodo_1 = require("./sudowoodo");
const swanna_1 = require("./swanna");
const torkoal_1 = require("./torkoal");
const trevenant_1 = require("./trevenant");
const tynamo_1 = require("./tynamo");
const vileplume_1 = require("./vileplume");
const wurmple_1 = require("./wurmple");
const arc_phone_1 = require("./arc-phone");
const arezu_1 = require("./arezu");
const box_of_disaster_1 = require("./box-of-disaster");
const colresss_experiment_1 = require("./colresss-experiment");
const damage_pump_1 = require("./damage-pump");
const fantina_1 = require("./fantina");
const iscan_1 = require("./iscan");
const lady_1 = require("./lady");
const lake_acuity_1 = require("./lake-acuity");
const lost_city_1 = require("./lost-city");
const lost_vacuum_1 = require("./lost-vacuum");
const mirage_gate_1 = require("./mirage-gate");
const miss_fortune_sisters_1 = require("./miss-fortune-sisters");
const panic_mask_1 = require("./panic-mask");
const riley_1 = require("./riley");
const thorton_1 = require("./thorton");
const tool_box_1 = require("./tool-box");
const volo_1 = require("./volo");
const windup_arm_1 = require("./windup-arm");
const gift_energy_1 = require("./gift-energy");
const other_prints_1 = require("./other-prints");
exports.setLostOrigin = [
    // Pokemon
    new abomasnow_1.Abomasnow(),
    new aerodactyl_v_1.AerodactylV(),
    new aerodactyl_vstar_1.AerodactylVstar(),
    new aipom_1.Aipom(),
    new ambipom_1.Ambipom(),
    new ariados_1.Ariados(),
    new banette_1.Banette(),
    new barbaracle_1.Barbaracle(),
    new beautifly_1.Beautifly(),
    new binacle_1.Binacle(),
    new bouffalant_1.Bouffalant(),
    new bronzong_1.Bronzong(),
    new bronzor_1.Bronzor(),
    new carbink_1.Carbink(),
    new cascoon_1.Cascoon(),
    new chandelure_1.Chandelure(),
    new clefable_1.Clefable(),
    new clefairy_1.Clefairy(),
    new comfey_1.Comfey(),
    new cramorant_1.Cramorant(),
    new cresselia_1.Cresselia(),
    new darkrai_1.Darkrai(),
    new delphox_v_1.DelphoxV(),
    new dewgong_1.Dewgong(),
    new dottler_1.Dottler(),
    new drapion_v_1.DrapionV(),
    new drapion_vstar_1.DrapionVSTAR(),
    new dustox_1.Dustox(),
    new eelektrik_1.Eelektrik(),
    new eelektross_1.Eelektross(),
    new electrike_1.Electrike(),
    new enamorus_v_1.EnamorusV(),
    new falinks_1.Falinks(),
    new finneon_1.Finneon(),
    new galarian_perrserker_v_1.GalarianPerrserkerV(),
    new galarian_stunfisk_1.GalarianStunfisk(),
    new gallade_v_1.GalladeV(),
    new gastly_1.Gastly(),
    new gastrodon_1.Gastrodon(),
    new gengar_1.Gengar(),
    new giratina_v_1.GiratinaV(),
    new giratina_vstar_1.GiratinaVSTAR(),
    new glastrier_1.Glastrier(),
    new gligar_1.Gligar(),
    new gliscor_1.Gliscor(),
    new gloom_1.Gloom(),
    new greedent_1.Greedent(),
    new hariyama_1.Hariyama(),
    new haunter_1.Haunter(),
    new hisuian_arcanine_1.HisuianArcanine(),
    new hisuian_basculegion_1.HisuianBasculegion(),
    new hisuian_basculin_1.HisuianBasculin(),
    new hisuian_goodra_1.HisuianGoodra(),
    new hisuian_goodra_v_1.HisuianGoodraV(),
    new hisuian_goodra_vstar_1.HisuianGoodraVSTAR(),
    new hisuian_growlithe_1.HisuianGrowlithe(),
    new hisuian_sliggoo_1.HisuianSliggoo(),
    new hisuian_zoroark_1.HisuianZoroark(),
    new hisuian_zoroark_v_1.HisuianZoroarkV(),
    new hisuian_zoroark_vstar_1.HisuianZoroarkVSTAR(),
    new hisuian_zorua_1.HisuianZorua(),
    new honchkrow_1.Honchkrow(),
    new hoopa_1.Hoopa(),
    new horsea_1.Horsea(),
    new inkay_1.Inkay(),
    new jynx_1.Jynx(),
    new kingdra_1.Kingdra(),
    new komala_1.Komala(),
    new kyurem_v_1.KyuremV(),
    new kyurem_vmax_1.KyuremVMAX(),
    new lampent_1.Lampent(),
    new landorus_1.Landorus(),
    new lickilicky_1.Lickilicky(),
    new lickitung_1.Lickitung(),
    new litleo_1.Litleo(),
    new litwick_1.Litwick(),
    new lumineon_1.Lumineon(),
    new luvdisc_1.Luvdisc(),
    new machamp_1.Machamp(),
    new machoke_1.Machoke(),
    new machop_1.Machop(),
    new magcargo_1.Magcargo(),
    new magearna_1.Magearna(),
    new magnezone_v_1.MagnezoneV(),
    new magnezone_vstar_1.MagnezoneVSTAR(),
    new makuhita_1.Makuhita(),
    new malamar_1.Malamar(),
    new manectric_1.Manectric(),
    new mawile_1.Mawile(),
    new medicham_1.Medicham(),
    new meditite_1.Meditite(),
    new mienfoo_1.Mienfoo(),
    new mienshao_1.Mienshao(),
    new mimikyu_1.Mimikyu(),
    new mr_mime_1.MrMime(),
    new nuzleaf_1.Nuzleaf(),
    new oddish_1.Oddish(),
    new orbeetle_1.Orbeetle(),
    new paras_1.Paras(),
    new parasect_1.Parasect(),
    new phantump_1.Phantump(),
    new pidgeot_v_1.PidgeotV(),
    new pikachu_1.Pikachu(),
    new politoed_1.Politoed(),
    new poliwag_1.Poliwag(),
    new poliwhirl_1.Poliwhirl(),
    new poliwrath_1.Poliwrath(),
    new porygon_1.Porygon(),
    new porygon_z_1.PorygonZ(),
    new porygon2_1.Porygon2(),
    new pyroar_1.Pyroar(),
    new radiant_gardevoir_1.RadiantGardevoir(),
    new radiant_hisuian_sneasler_1.RadiantHisuianSneasler(),
    new radiant_steelix_1.RadiantSteelix(),
    new raichu_1.Raichu(),
    new relicanth_1.Relicanth(),
    new rhydon_1.Rhydon(),
    new rhyperior_1.Rhyperior(),
    new rockruff_1.Rockruff(),
    new roselia_1.Roselia(),
    new roserade_1.Roserade(),
    new rotom_v_1.RotomV(),
    new sableye_1.Sableye(),
    new seadra_1.Seadra(),
    new seedot_1.Seedot(),
    new seel_1.Seel(),
    new seviper_1.Seviper(),
    new shellos_1.Shellos(),
    new shiftry_1.Shiftry(),
    new shuppet_1.Shuppet(),
    new silcoon_1.Silcoon(),
    new skwovet_1.Skwovet(),
    new slugma_1.Slugma(),
    new snorlax_1.Snorlax(),
    new snover_1.Snover(),
    new spectrier_1.Spectrier(),
    new spinarak_1.Spinarak(),
    new spiritomb_1.Spiritomb(),
    new stonjourner_1.Stonjourner(),
    new sudowoodo_1.Sudowoodo(),
    new swanna_1.Swanna(),
    new torkoal_1.Torkoal(),
    new trevenant_1.Trevenant(),
    new tynamo_1.Tynamo(),
    new vileplume_1.Vileplume(),
    new wurmple_1.Wurmple(),
    // Trainers
    new arc_phone_1.ArcPhone(),
    new arezu_1.Arezu(),
    new box_of_disaster_1.BoxOfDisaster(),
    new colresss_experiment_1.ColresssExperiment(),
    new damage_pump_1.DamagePump(),
    new fantina_1.Fantina(),
    new iscan_1.Iscan(),
    new lady_1.Lady(),
    new lake_acuity_1.LakeAcuity(),
    new lost_city_1.LostCity(),
    new lost_vacuum_1.LostVacuum(),
    new mirage_gate_1.MirageGate(),
    new miss_fortune_sisters_1.MissFortuneSisters(),
    new panic_mask_1.PanicMask(),
    new riley_1.Riley(),
    new thorton_1.Thorton(),
    new tool_box_1.ToolBox(),
    new volo_1.Volo(),
    new windup_arm_1.WindupArm(),
    // Energy
    new gift_energy_1.GiftEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.DelphoxV2LOR(),
    new other_prints_1.KyuremV2LOR(),
    new other_prints_1.MagnezoneV2LOR(),
    new other_prints_1.RotomV2LOR(),
    new other_prints_1.RotomV3LOR(),
    new other_prints_1.DrapionV2LOR(),
    new other_prints_1.GalarianPerrserkerV2LOR(),
    new other_prints_1.GalarianPerrserkerV3LOR(),
    new other_prints_1.GiratinaV2LOR(),
    new other_prints_1.GiratinaV3LOR(),
    new other_prints_1.HisuianGoodraV2LOR(),
    new other_prints_1.PidgeotV2LOR(),
    new other_prints_1.Arezu2LOR(),
    new other_prints_1.ColresssExperiment2LOR(),
    new other_prints_1.LadyFLI2LOR(),
    new other_prints_1.MissFortuneSisters2LOR(),
    new other_prints_1.Thorton2LOR(),
    new other_prints_1.Volo2LOR(),
    new other_prints_1.KyuremVMAX2LOR(),
    new other_prints_1.MagnezoneVSTAR2LOR(),
    new other_prints_1.DrapionVSTAR2LOR(),
    new other_prints_1.GiratinaVSTAR2LOR(),
    new other_prints_1.HisuianGoodraVSTAR2LOR(),
    new other_prints_1.HisuianZoroarkVSTAR2LOR(),
    new other_prints_1.Arezu3LOR(),
    new other_prints_1.ColresssExperiment3LOR(),
    new other_prints_1.LadyFLI3LOR(),
    new other_prints_1.MissFortuneSisters3LOR(),
    new other_prints_1.Thorton3LOR(),
    new other_prints_1.Volo3LOR(),
    new other_prints_1.GiratinaVSTAR3LOR(),
    new other_prints_1.HisuianZoroarkVSTAR3LOR(),
    new other_prints_1.BoxOfDisaster2LOR(),
    new other_prints_1.CollapsedStadiumLOR(),
    new other_prints_1.DarkPatchLOR(),
    new other_prints_1.LostVacuum2LOR(),
    new other_prints_1.CharizardLOR(),
    new other_prints_1.Pikachu2LOR(),
    new other_prints_1.Gengar2LOR(),
    new other_prints_1.Banette2LOR(),
    new other_prints_1.HisuianArcanine2LOR(),
    new other_prints_1.Snorlax2LOR(),
    new other_prints_1.CrobatVLOR(),
    new other_prints_1.EternatusVLOR(),
    new other_prints_1.EternatusVMAXLOR(),
    new other_prints_1.AdventurersDiscoveryLOR(),
    new other_prints_1.BossOrdersLOR(),
    new other_prints_1.CookLOR(),
    new other_prints_1.NessaLOR(),
    new other_prints_1.MewVMAXLOR(),
    new other_prints_1.BlipbugLOR(),
    new other_prints_1.DucklettLOR(),
    new other_prints_1.RhyhornLOR(),
    new other_prints_1.MurkrowLOR(),
    new other_prints_1.GoomyLOR(),
    new other_prints_1.HisuianElectrodeVLOR(),
    new other_prints_1.EnamorusV2(),
    new other_prints_1.AerodactylV2(),
    new other_prints_1.AerodactylV3(),
    new other_prints_1.Fantina2(),
    new other_prints_1.Iscan2(),
    new other_prints_1.AerodactylVstar2(),
    new other_prints_1.Fantina3(),
    new other_prints_1.Iscan3(),
];

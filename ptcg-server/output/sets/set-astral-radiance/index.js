"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAstralRadiance = void 0;
const absol_1 = require("./absol");
const azelf_1 = require("./azelf");
const bastiodon_1 = require("./bastiodon");
const beedrill_v_1 = require("./beedrill-v");
const bergmite_1 = require("./bergmite");
const bisharp_1 = require("./bisharp");
const bronzong_1 = require("./bronzong");
const bronzor_1 = require("./bronzor");
const chatot_1 = require("./chatot");
const combee_1 = require("./combee");
const cranidos_1 = require("./cranidos");
const cyndaquil_1 = require("./cyndaquil");
const darkrai_v_1 = require("./darkrai-v");
const darkrai_vstar_1 = require("./darkrai-vstar");
const dartrix_1 = require("./dartrix");
const diancie_1 = require("./diancie");
const drifblim_1 = require("./drifblim");
const drifloon_1 = require("./drifloon");
const eevee_1 = require("./eevee");
const galarian_mr_rime_v_1 = require("./galarian-mr-rime-v");
const gallade_1 = require("./gallade");
const garchomp_v_1 = require("./garchomp-v");
const glaceon_1 = require("./glaceon");
const glameow_1 = require("./glameow");
const golduck_1 = require("./golduck");
const heatran_v_1 = require("./heatran-v");
const heatran_vmax_1 = require("./heatran-vmax");
const heracross_1 = require("./heracross");
const hippopotas_1 = require("./hippopotas");
const hippowdon_1 = require("./hippowdon");
const hisuian_arcanine_1 = require("./hisuian-arcanine");
const hisuian_avalugg_1 = require("./hisuian-avalugg");
const hisuian_basculegion_1 = require("./hisuian-basculegion");
const hisuian_basculin_1 = require("./hisuian-basculin");
const hisuian_braviary_1 = require("./hisuian-braviary");
const hisuian_decidueye_1 = require("./hisuian-decidueye");
const hisuian_decidueye_v_1 = require("./hisuian-decidueye-v");
const hisuian_decidueye_vstar_1 = require("./hisuian-decidueye-vstar");
const hisuian_electrode_1 = require("./hisuian-electrode");
const hisuian_growlithe_1 = require("./hisuian-growlithe");
const hisuian_lilligant_1 = require("./hisuian-lilligant");
const hisuian_lilligant_v_1 = require("./hisuian-lilligant-v");
const hisuian_lilligant_vstar_1 = require("./hisuian-lilligant-vstar");
const hisuian_overqwil_1 = require("./hisuian-overqwil");
const hisuian_overqwil_2_1 = require("./hisuian-overqwil-2");
const hisuian_qwilfish_1 = require("./hisuian-qwilfish");
const hisuian_qwilfish_2_1 = require("./hisuian-qwilfish-2");
const hisuian_samurott_1 = require("./hisuian-samurott");
const hisuian_samurott_v_1 = require("./hisuian-samurott-v");
const hisuian_samurott_vstar_1 = require("./hisuian-samurott-vstar");
const hisuian_sneasel_1 = require("./hisuian-sneasel");
const hisuian_sneasler_1 = require("./hisuian-sneasler");
const hisuian_sneasler_v_1 = require("./hisuian-sneasler-v");
const hisuian_typhlosion_1 = require("./hisuian-typhlosion");
const hisuian_typhlosion_v_1 = require("./hisuian-typhlosion-v");
const hisuian_typhlosion_vstar_1 = require("./hisuian-typhlosion-vstar");
const hisuian_voltorb_1 = require("./hisuian-voltorb");
const hisuian_zoroark_1 = require("./hisuian-zoroark");
const hisuian_zorua_1 = require("./hisuian-zorua");
const hoothoot_1 = require("./hoothoot");
const jirachi_v_1 = require("./jirachi-v");
const keldeo_1 = require("./keldeo");
const kirlia_1 = require("./kirlia");
const kleavor_1 = require("./kleavor");
const kleavor_2_1 = require("./kleavor-2");
const kleavor_v_1 = require("./kleavor-v");
const kleavor_vstar_1 = require("./kleavor-vstar");
const kricketot_1 = require("./kricketot");
const kricketune_1 = require("./kricketune");
const leafeon_1 = require("./leafeon");
const lucario_v_1 = require("./lucario-v");
const luxray_v_1 = require("./luxray-v");
const machamp_v_1 = require("./machamp-v");
const machamp_vmax_1 = require("./machamp-vmax");
const magnemite_1 = require("./magnemite");
const magneton_1 = require("./magneton");
const magnezone_1 = require("./magnezone");
const mamoswine_1 = require("./mamoswine");
const mantine_1 = require("./mantine");
const mesprit_1 = require("./mesprit");
const mightyena_1 = require("./mightyena");
const miltank_1 = require("./miltank");
const misdreavus_1 = require("./misdreavus");
const mismagius_1 = require("./mismagius");
const nickit_1 = require("./nickit");
const noctowl_1 = require("./noctowl");
const oranguru_v_1 = require("./oranguru-v");
const origin_forme_dialga_v_1 = require("./origin-forme-dialga-v");
const origin_forme_dialga_vstar_1 = require("./origin-forme-dialga-vstar");
const origin_forme_palkia_v_1 = require("./origin-forme-palkia-v");
const origin_forme_palkia_vstar_1 = require("./origin-forme-palkia-vstar");
const oshawott_1 = require("./oshawott");
const pawniard_1 = require("./pawniard");
const petilil_1 = require("./petilil");
const piloswine_1 = require("./piloswine");
const ponyta_1 = require("./ponyta");
const poochyena_1 = require("./poochyena");
const psyduck_1 = require("./psyduck");
const purugly_1 = require("./purugly");
const quilava_1 = require("./quilava");
const radiant_greninja_1 = require("./radiant-greninja");
const radiant_hawlucha_1 = require("./radiant-hawlucha");
const radiant_heatran_1 = require("./radiant-heatran");
const ralts_1 = require("./ralts");
const rampardos_1 = require("./rampardos");
const rapidash_1 = require("./rapidash");
const regice_1 = require("./regice");
const regidrago_1 = require("./regidrago");
const regieleki_1 = require("./regieleki");
const regigigas_1 = require("./regigigas");
const regirock_1 = require("./regirock");
const registeel_1 = require("./registeel");
const rowlet_1 = require("./rowlet");
const rufflet_1 = require("./rufflet");
const scyther_1 = require("./scyther");
const scyther_2_1 = require("./scyther-2");
const shaymin_1 = require("./shaymin");
const shieldon_1 = require("./shieldon");
const stantler_1 = require("./stantler");
const starmie_v_1 = require("./starmie-v");
const sudowoodo_1 = require("./sudowoodo");
const swinub_1 = require("./swinub");
const teddiursa_1 = require("./teddiursa");
const thievul_1 = require("./thievul");
const togekiss_1 = require("./togekiss");
const togepi_1 = require("./togepi");
const togetic_1 = require("./togetic");
const ursaluna_1 = require("./ursaluna");
const ursaring_1 = require("./ursaring");
const uxie_1 = require("./uxie");
const vespiquen_1 = require("./vespiquen");
const virizion_v_1 = require("./virizion-v");
const whiscash_1 = require("./whiscash");
const wyrdeer_1 = require("./wyrdeer");
const wyrdeer_v_1 = require("./wyrdeer-v");
const yanma_1 = require("./yanma");
const yanmega_1 = require("./yanmega");
const adaman_1 = require("./adaman");
const canceling_cologne_1 = require("./canceling-cologne");
const choy_1 = require("./choy");
const cyllene_1 = require("./cyllene");
const dark_patch_1 = require("./dark-patch");
const energy_loto_1 = require("./energy-loto");
const feather_ball_1 = require("./feather-ball");
const gapejaw_bog_1 = require("./gapejaw-bog");
const gardenias_vigor_1 = require("./gardenias-vigor");
const grant_1 = require("./grant");
const gutsy_pickaxe_1 = require("./gutsy-pickaxe");
const hisuian_heavy_ball_1 = require("./hisuian-heavy-ball");
const irida_1 = require("./irida");
const jubilife_village_1 = require("./jubilife-village");
const kamado_1 = require("./kamado");
const roxanne_1 = require("./roxanne");
const spicy_seasoned_curry_1 = require("./spicy-seasoned-curry");
const supereffective_glasses_1 = require("./supereffective-glasses");
const sweet_honey_1 = require("./sweet-honey");
const switch_cart_1 = require("./switch-cart");
const temple_of_sinnoh_1 = require("./temple-of-sinnoh");
const trekking_shoes_1 = require("./trekking-shoes");
const wait_and_see_turbo_1 = require("./wait-and-see-turbo");
const zisu_1 = require("./zisu");
const other_prints_1 = require("./other-prints");
exports.setAstralRadiance = [
    // Pokemon
    new absol_1.Absol(),
    new azelf_1.Azelf(),
    new bastiodon_1.Bastiodon(),
    new beedrill_v_1.BeedrillV(),
    new bergmite_1.Bergmite(),
    new bisharp_1.Bisharp(),
    new bronzong_1.Bronzong(),
    new bronzor_1.Bronzor(),
    new chatot_1.Chatot(),
    new combee_1.Combee(),
    new cranidos_1.Cranidos(),
    new cyndaquil_1.Cyndaquil(),
    new darkrai_v_1.DarkraiV(),
    new darkrai_vstar_1.DarkraiVSTAR(),
    new dartrix_1.Dartrix(),
    new diancie_1.Diancie(),
    new drifblim_1.Drifblim(),
    new drifloon_1.Drifloon(),
    new eevee_1.Eevee(),
    new galarian_mr_rime_v_1.GalarianMrRimeV(),
    new gallade_1.Gallade(),
    new garchomp_v_1.GarchompV(),
    new glaceon_1.Glaceon(),
    new glameow_1.Glameow(),
    new golduck_1.Golduck(),
    new heatran_v_1.HeatranV(),
    new heatran_vmax_1.HeatranVmax(),
    new heracross_1.Heracross(),
    new hippopotas_1.Hippopotas(),
    new hippowdon_1.Hippowdon(),
    new hisuian_arcanine_1.HisuianArcanine(),
    new hisuian_avalugg_1.HisuianAvalugg(),
    new hisuian_basculegion_1.HisuianBasculegion(),
    new hisuian_basculin_1.HisuianBasculin(),
    new hisuian_braviary_1.HisuianBraviary(),
    new hisuian_decidueye_1.HisuianDecidueye(),
    new hisuian_decidueye_v_1.HisuianDecidueyeV(),
    new hisuian_decidueye_vstar_1.HisuianDecidueyeVSTAR(),
    new hisuian_electrode_1.HisuianElectrode(),
    new hisuian_growlithe_1.HisuianGrowlithe(),
    new hisuian_lilligant_1.HisuianLilligant(),
    new hisuian_lilligant_v_1.HisuianLilligantV(),
    new hisuian_lilligant_vstar_1.HisuianLilligantVstar(),
    new hisuian_overqwil_1.HisuianOverqwil(),
    new hisuian_overqwil_2_1.HisuianOverqwil2(),
    new hisuian_qwilfish_1.HisuianQwilfish(),
    new hisuian_qwilfish_2_1.HisuianQwilfish2(),
    new hisuian_samurott_1.HisuianSamurott(),
    new hisuian_samurott_v_1.HisuianSamurottV(),
    new hisuian_samurott_vstar_1.HisuianSamurottVSTAR(),
    new hisuian_sneasel_1.HisuianSneasel(),
    new hisuian_sneasler_1.HisuianSneasler(),
    new hisuian_sneasler_v_1.HisuianSneaslerV(),
    new hisuian_typhlosion_1.HisuianTyphlosion(),
    new hisuian_typhlosion_v_1.HisuianTyphlosionV(),
    new hisuian_typhlosion_vstar_1.HisuianTyphlosionVstar(),
    new hisuian_voltorb_1.HisuianVoltorb(),
    new hisuian_zoroark_1.HisuianZoroark(),
    new hisuian_zorua_1.HisuianZorua(),
    new hoothoot_1.Hoothoot(),
    new jirachi_v_1.JirachiV(),
    new keldeo_1.Keldeo(),
    new kirlia_1.Kirlia(),
    new kleavor_1.Kleavor(),
    new kleavor_2_1.Kleavor2(),
    new kleavor_v_1.KleavorV(),
    new kleavor_vstar_1.KleavorVstar(),
    new kricketot_1.Kricketot(),
    new kricketune_1.Kricketune(),
    new leafeon_1.Leafeon(),
    new lucario_v_1.LucarioV(),
    new luxray_v_1.LuxrayV(),
    new machamp_v_1.MachampV(),
    new machamp_vmax_1.MachampVmax(),
    new magnemite_1.Magnemite(),
    new magneton_1.Magneton(),
    new magnezone_1.Magnezone(),
    new mamoswine_1.Mamoswine(),
    new mantine_1.Mantine(),
    new mesprit_1.Mesprit(),
    new mightyena_1.Mightyena(),
    new miltank_1.Miltank(),
    new misdreavus_1.Misdreavus(),
    new mismagius_1.Mismagius(),
    new nickit_1.Nickit(),
    new noctowl_1.Noctowl(),
    new oranguru_v_1.OranguruV(),
    new origin_forme_dialga_v_1.OriginFormeDialgaV(),
    new origin_forme_dialga_vstar_1.OriginFormeDialgaVSTAR(),
    new origin_forme_palkia_v_1.OriginFormePalkiaV(),
    new origin_forme_palkia_vstar_1.OriginFormePalkiaVSTAR(),
    new oshawott_1.Oshawott(),
    new pawniard_1.Pawniard(),
    new petilil_1.Petilil(),
    new piloswine_1.Piloswine(),
    new ponyta_1.Ponyta(),
    new poochyena_1.Poochyena(),
    new psyduck_1.Psyduck(),
    new purugly_1.Purugly(),
    new quilava_1.Quilava(),
    new radiant_greninja_1.RadiantGreninja(),
    new radiant_hawlucha_1.RadiantHawlucha(),
    new radiant_heatran_1.RadiantHeatran(),
    new ralts_1.Ralts(),
    new rampardos_1.Rampardos(),
    new rapidash_1.Rapidash(),
    new regice_1.Regice(),
    new regidrago_1.Regidrago(),
    new regieleki_1.Regieleki(),
    new regigigas_1.Regigigas(),
    new regirock_1.Regirock(),
    new registeel_1.Registeel(),
    new rowlet_1.Rowlet(),
    new rufflet_1.Rufflet(),
    new scyther_1.Scyther(),
    new scyther_2_1.Scyther2(),
    new shaymin_1.Shaymin(),
    new shieldon_1.Shieldon(),
    new stantler_1.Stantler(),
    new starmie_v_1.StarmieV(),
    new sudowoodo_1.Sudowoodo(),
    new swinub_1.Swinub(),
    new teddiursa_1.Teddiursa(),
    new thievul_1.Thievul(),
    new togekiss_1.Togekiss(),
    new togepi_1.Togepi(),
    new togetic_1.Togetic(),
    new ursaluna_1.Ursaluna(),
    new ursaring_1.Ursaring(),
    new uxie_1.Uxie(),
    new vespiquen_1.Vespiquen(),
    new virizion_v_1.VirizionV(),
    new whiscash_1.Whiscash(),
    new wyrdeer_1.Wyrdeer(),
    new wyrdeer_v_1.WyrdeerV(),
    new yanma_1.Yanma(),
    new yanmega_1.Yanmega(),
    // Trainers
    new adaman_1.Adaman(),
    new canceling_cologne_1.CancelingCologne(),
    new choy_1.Choy(),
    new cyllene_1.Cyllene(),
    new dark_patch_1.DarkPatch(),
    new energy_loto_1.EnergyLoto(),
    new feather_ball_1.FeatherBall(),
    new gapejaw_bog_1.GapejawBog(),
    new gardenias_vigor_1.GardeniasVigor(),
    new grant_1.Grant(),
    new gutsy_pickaxe_1.GutsyPickaxe(),
    new hisuian_heavy_ball_1.HisuianHeavyBall(),
    new irida_1.Irida(),
    new jubilife_village_1.JubilifeVillage(),
    new kamado_1.Kamado(),
    new roxanne_1.Roxanne(),
    new spicy_seasoned_curry_1.SpicySeasonedCurry(),
    new supereffective_glasses_1.SupereffectiveGlasses(),
    new sweet_honey_1.SweetHoney(),
    new switch_cart_1.SwitchCart(),
    new temple_of_sinnoh_1.TempleofSinnoh(),
    new trekking_shoes_1.TrekkingShoes(),
    new wait_and_see_turbo_1.WaitAndSeeTurbo(),
    new zisu_1.Zisu(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.BronzongASR(),
    new other_prints_1.UnidentifiedFossilASR(),
    new other_prints_1.StarmieV2ASR(),
    new other_prints_1.OriginFormePalkiaV2ASR(),
    new other_prints_1.LuxrayV2ASR(),
    new other_prints_1.HisuianDecidueyeV2ASR(),
    new other_prints_1.HisuianSamurottV2ASR(),
    new other_prints_1.OriginFormeDialgaV2ASR(),
    new other_prints_1.GarchompV2ASR(),
    new other_prints_1.OranguruV2ASR(),
    new other_prints_1.WyrdeerV2ASR(),
    new other_prints_1.Adaman2ASR(),
    new other_prints_1.Cyllene2ASR(),
    new other_prints_1.GardeniasVigor2ASR(),
    new other_prints_1.Grant2ASR(),
    new other_prints_1.Irida2ASR(),
    new other_prints_1.Roxanne2ASR(),
    new other_prints_1.OriginFormePalkiaVSTAR2ASR(),
    new other_prints_1.HisuianDecidueyeVSTAR2ASR(),
    new other_prints_1.HisuianSamurottVSTAR2ASR(),
    new other_prints_1.OriginFormeDialgaVSTAR2ASR(),
    new other_prints_1.Adaman3ASR(),
    new other_prints_1.Cyllene3ASR(),
    new other_prints_1.GardeniasVigor3ASR(),
    new other_prints_1.Grant3ASR(),
    new other_prints_1.Irida3ASR(),
    new other_prints_1.Roxanne3ASR(),
    new other_prints_1.OriginFormePalkiaVSTAR3ASR(),
    new other_prints_1.HisuianSamurottVSTAR3ASR(),
    new other_prints_1.OriginFormeDialgaVSTAR3ASR(),
    new other_prints_1.ChoiceBeltASR(),
    new other_prints_1.JubilifeVillage2ASR(),
    new other_prints_1.PathToThePeakASR(),
    new other_prints_1.TempleofSinnoh2ASR(),
    new other_prints_1.TrekkingShoes2ASR(),
    new other_prints_1.DoubleTurboEnergyASR(),
    new other_prints_1.FlappleASR(),
    new other_prints_1.FrosmothASR(),
    new other_prints_1.GardevoirASR(),
    new other_prints_1.FalinksASR(),
    new other_prints_1.Mightyena2ASR(),
    new other_prints_1.StarmieV3ASR(),
    new other_prints_1.IceRiderCalyrexVASR(),
    new other_prints_1.IceRiderCalyrexVMAXASR(),
    new other_prints_1.GalarianArticunoVASR(),
    new other_prints_1.ShadowRiderCalyrexVASR(),
    new other_prints_1.ShadowRiderCalyrexVMAXASR(),
    new other_prints_1.GalarianZapdosVASR(),
    new other_prints_1.GalarianMoltresVASR(),
    new other_prints_1.ZacianVASR(),
    new other_prints_1.GarchompV3ASR(),
    new other_prints_1.MelonyASR(),
    new other_prints_1.PiersASR(),
    new other_prints_1.IceRiderCalyrexVMAX2ASR(),
    new other_prints_1.ShadowRiderCalyrexVMAX2ASR(),
    new other_prints_1.BarboachASR(),
    new other_prints_1.DewottASR(),
    new other_prints_1.BeedrillV2(),
    new other_prints_1.BeedrillV3(),
    new other_prints_1.HisuianLilligantV2(),
    new other_prints_1.HisuianLilligantV3(),
    new other_prints_1.HeatranV2(),
    new other_prints_1.HisuianTyphlosionV2(),
    new other_prints_1.MachampV2(),
    new other_prints_1.MachampV3(),
    new other_prints_1.HisuianSneaslerV2(),
    new other_prints_1.HisuianSneaslerV3(),
    new other_prints_1.Choy2(),
    new other_prints_1.Kamado2(),
    new other_prints_1.Zisu2(),
    new other_prints_1.HisuianLilligantVstar2(),
    new other_prints_1.HeatranVmax2(),
    new other_prints_1.HisuianTyphlosionVstar2(),
    new other_prints_1.MachampVmax2(),
    new other_prints_1.Choy3(),
    new other_prints_1.Kamado3(),
    new other_prints_1.Zisu3(),
];

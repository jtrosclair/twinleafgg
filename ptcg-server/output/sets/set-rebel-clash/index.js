"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRebelClash = void 0;
const abomasnow_1 = require("./abomasnow");
const aegislash_1 = require("./aegislash");
const alcremie_1 = require("./alcremie");
const appletun_1 = require("./appletun");
const applin_1 = require("./applin");
const applin_2_1 = require("./applin-2");
const arcanine_1 = require("./arcanine");
const arrokuda_1 = require("./arrokuda");
const barbaracle_1 = require("./barbaracle");
const barboach_1 = require("./barboach");
const barraskewda_1 = require("./barraskewda");
const bewear_1 = require("./bewear");
const binacle_1 = require("./binacle");
const boltund_v_1 = require("./boltund-v");
const bronzong_1 = require("./bronzong");
const bronzor_1 = require("./bronzor");
const bunnelby_1 = require("./bunnelby");
const butterfree_1 = require("./butterfree");
const carkol_1 = require("./carkol");
const caterpie_1 = require("./caterpie");
const chandelure_1 = require("./chandelure");
const charjabug_1 = require("./charjabug");
const chatot_1 = require("./chatot");
const cinderace_v_1 = require("./cinderace-v");
const cinderace_vmax_1 = require("./cinderace-vmax");
const clefable_1 = require("./clefable");
const clefairy_1 = require("./clefairy");
const coalossal_1 = require("./coalossal");
const copperajah_v_1 = require("./copperajah-v");
const copperajah_vmax_1 = require("./copperajah-vmax");
const cramorant_1 = require("./cramorant");
const diggersby_1 = require("./diggersby");
const doublade_1 = require("./doublade");
const dragapult_1 = require("./dragapult");
const dragapult_v_1 = require("./dragapult-v");
const dragapult_vmax_1 = require("./dragapult-vmax");
const drakloak_1 = require("./drakloak");
const dreepy_1 = require("./dreepy");
const dubwool_v_1 = require("./dubwool-v");
const duraludon_1 = require("./duraludon");
const durant_1 = require("./durant");
const eiscue_1 = require("./eiscue");
const eiscue_v_1 = require("./eiscue-v");
const eldegoss_v_1 = require("./eldegoss-v");
const electabuzz_1 = require("./electabuzz");
const electivire_1 = require("./electivire");
const electrode_1 = require("./electrode");
const falinks_1 = require("./falinks");
const falinks_v_1 = require("./falinks-v");
const flapple_1 = require("./flapple");
const galarian_corsola_1 = require("./galarian-corsola");
const galarian_cursola_1 = require("./galarian-cursola");
const galarian_darmanitan_1 = require("./galarian-darmanitan");
const galarian_darumaka_1 = require("./galarian-darumaka");
const galarian_farfetchd_1 = require("./galarian-farfetchd");
const galarian_meowth_1 = require("./galarian-meowth");
const galarian_mr_mime_1 = require("./galarian-mr-mime");
const galarian_mr_rime_1 = require("./galarian-mr-rime");
const galarian_perrserker_1 = require("./galarian-perrserker");
const galarian_runerigus_1 = require("./galarian-runerigus");
const galarian_sirfetchd_1 = require("./galarian-sirfetchd");
const galarian_yamask_1 = require("./galarian-yamask");
const garbodor_1 = require("./garbodor");
const greedent_1 = require("./greedent");
const grimmsnarl_1 = require("./grimmsnarl");
const growlithe_1 = require("./growlithe");
const grubbin_1 = require("./grubbin");
const gyarados_1 = require("./gyarados");
const hatenna_1 = require("./hatenna");
const hatterene_1 = require("./hatterene");
const hattrem_1 = require("./hattrem");
const hawlucha_1 = require("./hawlucha");
const heatmor_1 = require("./heatmor");
const heliolisk_1 = require("./heliolisk");
const helioptile_1 = require("./helioptile");
const heracross_1 = require("./heracross");
const honedge_1 = require("./honedge");
const impidimp_1 = require("./impidimp");
const indeedee_1 = require("./indeedee");
const inteleon_v_1 = require("./inteleon-v");
const inteleon_vmax_1 = require("./inteleon-vmax");
const koffing_1 = require("./koffing");
const lampent_1 = require("./lampent");
const litwick_1 = require("./litwick");
const lombre_1 = require("./lombre");
const lotad_1 = require("./lotad");
const ludicolo_1 = require("./ludicolo");
const luxio_1 = require("./luxio");
const luxray_1 = require("./luxray");
const magikarp_1 = require("./magikarp");
const magmar_1 = require("./magmar");
const magmortar_1 = require("./magmortar");
const malamar_v_1 = require("./malamar-v");
const malamar_vmax_1 = require("./malamar-vmax");
const mandibuzz_1 = require("./mandibuzz");
const masquerain_1 = require("./masquerain");
const medicham_1 = require("./medicham");
const meditite_1 = require("./meditite");
const metapod_1 = require("./metapod");
const milcery_1 = require("./milcery");
const milotic_v_1 = require("./milotic-v");
const morgrem_1 = require("./morgrem");
const morpeko_1 = require("./morpeko");
const natu_1 = require("./natu");
const ninetales_1 = require("./ninetales");
const ninetales_v_1 = require("./ninetales-v");
const nosepass_1 = require("./nosepass");
const palossand_1 = require("./palossand");
const palpitoad_1 = require("./palpitoad");
const pelipper_1 = require("./pelipper");
const phantump_1 = require("./phantump");
const pidove_1 = require("./pidove");
const pincurchin_v_1 = require("./pincurchin-v");
const probopass_1 = require("./probopass");
const rillaboom_v_1 = require("./rillaboom-v");
const rillaboom_vmax_1 = require("./rillaboom-vmax");
const rolycoly_1 = require("./rolycoly");
const sandaconda_v_1 = require("./sandaconda-v");
const sandygast_1 = require("./sandygast");
const scizor_1 = require("./scizor");
const scyther_1 = require("./scyther");
const seismitoad_1 = require("./seismitoad");
const shinx_1 = require("./shinx");
const shuckle_1 = require("./shuckle");
const sigilyph_1 = require("./sigilyph");
const skuntank_1 = require("./skuntank");
const skwovet_1 = require("./skwovet");
const snorlax_1 = require("./snorlax");
const snover_1 = require("./snover");
const spiritomb_1 = require("./spiritomb");
const stonjourner_1 = require("./stonjourner");
const stufful_1 = require("./stufful");
const stunky_1 = require("./stunky");
const surskit_1 = require("./surskit");
const toxel_1 = require("./toxel");
const toxtricity_1 = require("./toxtricity");
const toxtricity_v_1 = require("./toxtricity-v");
const toxtricity_vmax_1 = require("./toxtricity-vmax");
const tranquill_1 = require("./tranquill");
const trevenant_1 = require("./trevenant");
const trubbish_1 = require("./trubbish");
const tympole_1 = require("./tympole");
const unfezant_1 = require("./unfezant");
const vikavolt_1 = require("./vikavolt");
const vullaby_1 = require("./vullaby");
const vulpix_1 = require("./vulpix");
const whiscash_1 = require("./whiscash");
const wingull_1 = require("./wingull");
const xatu_1 = require("./xatu");
const zacian_1 = require("./zacian");
const zamazenta_1 = require("./zamazenta");
const burning_scarf_1 = require("./burning-scarf");
const capacious_bucket_1 = require("./capacious-bucket");
const cursed_shovel_1 = require("./cursed-shovel");
const dan_1 = require("./dan");
const galar_mine_1 = require("./galar-mine");
const milo_1 = require("./milo");
const nugget_1 = require("./nugget");
const oleana_1 = require("./oleana");
const scoop_up_net_1 = require("./scoop-up-net");
const training_court_1 = require("./training-court");
const capture_energy_1 = require("./capture-energy");
const horror_psychic_energy_1 = require("./horror-psychic-energy");
const speed_lightning_energy_1 = require("./speed-lightning-energy");
const twin_energy_1 = require("./twin-energy");
const other_prints_1 = require("./other-prints");
exports.setRebelClash = [
    // Pokemon
    new abomasnow_1.Abomasnow(),
    new aegislash_1.Aegislash(),
    new alcremie_1.Alcremie(),
    new appletun_1.Appletun(),
    new applin_1.Applin(),
    new applin_2_1.Applin2(),
    new arcanine_1.Arcanine(),
    new arrokuda_1.Arrokuda(),
    new barbaracle_1.Barbaracle(),
    new barboach_1.Barboach(),
    new barraskewda_1.Barraskewda(),
    new bewear_1.Bewear(),
    new binacle_1.Binacle(),
    new boltund_v_1.BoltundV(),
    new bronzong_1.Bronzong(),
    new bronzor_1.Bronzor(),
    new bunnelby_1.Bunnelby(),
    new butterfree_1.Butterfree(),
    new carkol_1.Carkol(),
    new caterpie_1.Caterpie(),
    new chandelure_1.Chandelure(),
    new charjabug_1.Charjabug(),
    new chatot_1.Chatot(),
    new cinderace_v_1.CinderaceV(),
    new cinderace_vmax_1.CinderaceVmax(),
    new clefable_1.Clefable(),
    new clefairy_1.Clefairy(),
    new coalossal_1.Coalossal(),
    new copperajah_v_1.CopperajahV(),
    new copperajah_vmax_1.CopperajahVmax(),
    new cramorant_1.Cramorant(),
    new diggersby_1.Diggersby(),
    new doublade_1.Doublade(),
    new dragapult_1.Dragapult(),
    new dragapult_v_1.DragapultV(),
    new dragapult_vmax_1.DragapultVMAX(),
    new drakloak_1.Drakloak(),
    new dreepy_1.Dreepy(),
    new dubwool_v_1.DubwoolV(),
    new duraludon_1.Duraludon(),
    new durant_1.Durant(),
    new eiscue_1.Eiscue(),
    new eiscue_v_1.EiscueV(),
    new eldegoss_v_1.EldegossV(),
    new electabuzz_1.Electabuzz(),
    new electivire_1.Electivire(),
    new electrode_1.Electrode(),
    new falinks_1.Falinks(),
    new falinks_v_1.FalinksV(),
    new flapple_1.Flapple(),
    new galarian_corsola_1.GalarianCorsola(),
    new galarian_cursola_1.GalarianCursola(),
    new galarian_darmanitan_1.GalarianDarmanitan(),
    new galarian_darumaka_1.GalarianDarumaka(),
    new galarian_farfetchd_1.GalarianFarfetchd(),
    new galarian_meowth_1.GalarianMeowth(),
    new galarian_mr_mime_1.GalarianMrMime(),
    new galarian_mr_rime_1.GalarianMrRime(),
    new galarian_perrserker_1.GalarianPerrserker(),
    new galarian_runerigus_1.GalarianRunerigus(),
    new galarian_sirfetchd_1.GalarianSirfetchd(),
    new galarian_yamask_1.GalarianYamask(),
    new garbodor_1.Garbodor(),
    new greedent_1.Greedent(),
    new grimmsnarl_1.Grimmsnarl(),
    new growlithe_1.Growlithe(),
    new grubbin_1.Grubbin(),
    new gyarados_1.Gyarados(),
    new hatenna_1.Hatenna(),
    new hatterene_1.Hatterene(),
    new hattrem_1.Hattrem(),
    new hawlucha_1.Hawlucha(),
    new heatmor_1.Heatmor(),
    new heliolisk_1.Heliolisk(),
    new helioptile_1.Helioptile(),
    new heracross_1.Heracross(),
    new honedge_1.Honedge(),
    new impidimp_1.Impidimp(),
    new indeedee_1.Indeedee(),
    new inteleon_v_1.InteleonV(),
    new inteleon_vmax_1.InteleonVmax(),
    new koffing_1.Koffing(),
    new lampent_1.Lampent(),
    new litwick_1.Litwick(),
    new lombre_1.Lombre(),
    new lotad_1.Lotad(),
    new ludicolo_1.Ludicolo(),
    new luxio_1.Luxio(),
    new luxray_1.Luxray(),
    new magikarp_1.Magikarp(),
    new magmar_1.Magmar(),
    new magmortar_1.Magmortar(),
    new malamar_v_1.MalamarV(),
    new malamar_vmax_1.MalamarVmax(),
    new mandibuzz_1.Mandibuzz(),
    new masquerain_1.Masquerain(),
    new medicham_1.Medicham(),
    new meditite_1.Meditite(),
    new metapod_1.Metapod(),
    new milcery_1.Milcery(),
    new milotic_v_1.MiloticV(),
    new morgrem_1.Morgrem(),
    new morpeko_1.Morpeko(),
    new natu_1.Natu(),
    new ninetales_1.Ninetales(),
    new ninetales_v_1.NinetalesV(),
    new nosepass_1.Nosepass(),
    new palossand_1.Palossand(),
    new palpitoad_1.Palpitoad(),
    new pelipper_1.Pelipper(),
    new phantump_1.Phantump(),
    new pidove_1.Pidove(),
    new pincurchin_v_1.PincurchinV(),
    new probopass_1.Probopass(),
    new rillaboom_v_1.RillaboomV(),
    new rillaboom_vmax_1.RillaboomVmax(),
    new rolycoly_1.Rolycoly(),
    new sandaconda_v_1.SandacondaV(),
    new sandygast_1.Sandygast(),
    new scizor_1.Scizor(),
    new scyther_1.Scyther(),
    new seismitoad_1.Seismitoad(),
    new shinx_1.Shinx(),
    new shuckle_1.Shuckle(),
    new sigilyph_1.Sigilyph(),
    new skuntank_1.Skuntank(),
    new skwovet_1.Skwovet(),
    new snorlax_1.Snorlax(),
    new snover_1.Snover(),
    new spiritomb_1.Spiritomb(),
    new stonjourner_1.Stonjourner(),
    new stufful_1.Stufful(),
    new stunky_1.Stunky(),
    new surskit_1.Surskit(),
    new toxel_1.Toxel(),
    new toxtricity_1.Toxtricity(),
    new toxtricity_v_1.ToxtricityV(),
    new toxtricity_vmax_1.ToxtricityVmax(),
    new tranquill_1.Tranquill(),
    new trevenant_1.Trevenant(),
    new trubbish_1.Trubbish(),
    new tympole_1.Tympole(),
    new unfezant_1.Unfezant(),
    new vikavolt_1.Vikavolt(),
    new vullaby_1.Vullaby(),
    new vulpix_1.Vulpix(),
    new whiscash_1.Whiscash(),
    new wingull_1.Wingull(),
    new xatu_1.Xatu(),
    new zacian_1.Zacian(),
    new zamazenta_1.Zamazenta(),
    // Trainers
    new burning_scarf_1.BurningScarf(),
    new capacious_bucket_1.CapaciousBucket(),
    new cursed_shovel_1.CursedShovel(),
    new dan_1.Dan(),
    new galar_mine_1.GalarMine(),
    new milo_1.Milo(),
    new nugget_1.Nugget(),
    new oleana_1.Oleana(),
    new scoop_up_net_1.ScoopUpNet(),
    new training_court_1.TrainingCourt(),
    // Energy
    new capture_energy_1.CaptureEnergy(),
    new horror_psychic_energy_1.HorrorPsychicEnergy(),
    new speed_lightning_energy_1.SpeedLightningEnergy(),
    new twin_energy_1.TwinEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.EldegossVRCLFullArt(),
    new other_prints_1.TurffieldStadiumRCL(),
    new other_prints_1.GalarianWeezingRCL(),
    new other_prints_1.BossOrdersRCL(),
    new other_prints_1.FullHealRCL(),
    new other_prints_1.PokeBallRCL(),
    new other_prints_1.SkylaRCL(),
    new other_prints_1.SoniaRCL(),
    new other_prints_1.ToolScrapperRCL(),
    new other_prints_1.DragapultV2RCL(),
    new other_prints_1.BossOrders2RCL(),
    new other_prints_1.Sonia2RCL(),
    new other_prints_1.DragapultVMAX2RCL(),
    new other_prints_1.BossOrders3RCL(),
    new other_prints_1.Sonia3RCL(),
    new other_prints_1.FrosmothRCL(),
    new other_prints_1.GalarianPerrserker2RCL(),
    new other_prints_1.BigCharmRCL(),
    new other_prints_1.ScoopUpNet2RCL(),
    new other_prints_1.ToolScrapper2RCL(),
    new other_prints_1.TwinEnergy2RCL(),
    new other_prints_1.VoltorbRCL(),
    new other_prints_1.RillaboomV2(),
    new other_prints_1.EldegossV2(),
    new other_prints_1.NinetalesV2(),
    new other_prints_1.CinderaceV2(),
    new other_prints_1.MiloticV2(),
    new other_prints_1.InteleonV2(),
    new other_prints_1.BoltundV2(),
    new other_prints_1.ToxtricityV2(),
    new other_prints_1.SandacondaV2(),
    new other_prints_1.FalinksV2(),
    new other_prints_1.MalamarV2(),
    new other_prints_1.CopperajahV2(),
    new other_prints_1.DubwoolV2(),
    new other_prints_1.Milo2(),
    new other_prints_1.Oleana2(),
    new other_prints_1.RillaboomVmax2(),
    new other_prints_1.CinderaceVmax2(),
    new other_prints_1.InteleonVmax2(),
    new other_prints_1.ToxtricityVmax2(),
    new other_prints_1.MalamarVmax2(),
    new other_prints_1.CopperajahVmax2(),
    new other_prints_1.Milo3(),
    new other_prints_1.Oleana3(),
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBrilliantStars = void 0;
const aggron_v_1 = require("./aggron-v");
const aggron_vmax_1 = require("./aggron-vmax");
const alcremie_1 = require("./alcremie");
const arceus_v_1 = require("./arceus-v");
const arceus_vstar_1 = require("./arceus-vstar");
const axew_1 = require("./axew");
const baltoy_1 = require("./baltoy");
const beartic_1 = require("./beartic");
const bibarel_1 = require("./bibarel");
const bidoof_1 = require("./bidoof");
const breloom_1 = require("./breloom");
const buizel_1 = require("./buizel");
const castform_1 = require("./castform");
const charizard_v_1 = require("./charizard-v");
const charizard_vstar_1 = require("./charizard-vstar");
const cherubi_1 = require("./cherubi");
const chimchar_1 = require("./chimchar");
const chimecho_1 = require("./chimecho");
const cinccino_1 = require("./cinccino");
const claydol_1 = require("./claydol");
const clefable_1 = require("./clefable");
const clefairy_1 = require("./clefairy");
const corphish_1 = require("./corphish");
const crawdaunt_1 = require("./crawdaunt");
const cubchoo_1 = require("./cubchoo");
const dedenne_1 = require("./dedenne");
const dracovish_v_1 = require("./dracovish-v");
const drampa_v_1 = require("./drampa-v");
const druddigon_1 = require("./druddigon");
const dusclops_1 = require("./dusclops");
const dusknoir_1 = require("./dusknoir");
const duskull_1 = require("./duskull");
const eiscue_1 = require("./eiscue");
const electivire_1 = require("./electivire");
const empoleon_1 = require("./empoleon");
const entei_v_1 = require("./entei-v");
const escavalier_1 = require("./escavalier");
const exeggcute_1 = require("./exeggcute");
const exeggutor_1 = require("./exeggutor");
const farfetchd_1 = require("./farfetchd");
const floatzel_1 = require("./floatzel");
const flygon_1 = require("./flygon");
const flygon_v_1 = require("./flygon-v");
const fraxure_1 = require("./fraxure");
const gabite_1 = require("./gabite");
const garchomp_1 = require("./garchomp");
const gible_1 = require("./gible");
const golett_1 = require("./golett");
const golurk_1 = require("./golurk");
const granbull_v_1 = require("./granbull-v");
const grimer_1 = require("./grimer");
const grimmsnarl_1 = require("./grimmsnarl");
const grotle_1 = require("./grotle");
const hawlucha_1 = require("./hawlucha");
const haxorus_1 = require("./haxorus");
const heatran_1 = require("./heatran");
const hitmontop_1 = require("./hitmontop");
const honchkrow_v_1 = require("./honchkrow-v");
const impidimp_1 = require("./impidimp");
const infernape_1 = require("./infernape");
const kingler_v_1 = require("./kingler-v");
const kingler_vmax_1 = require("./kingler-vmax");
const klang_1 = require("./klang");
const klink_1 = require("./klink");
const klinklang_1 = require("./klinklang");
const lapras_1 = require("./lapras");
const liepard_1 = require("./liepard");
const lucario_1 = require("./lucario");
const lumineon_v_1 = require("./lumineon-v");
const luxio_1 = require("./luxio");
const luxray_1 = require("./luxray");
const magmar_1 = require("./magmar");
const magmortar_1 = require("./magmortar");
const manaphy_1 = require("./manaphy");
const mewtwo_1 = require("./mewtwo");
const milcery_1 = require("./milcery");
const mimikyu_vmax_1 = require("./mimikyu-vmax");
const minccino_1 = require("./minccino");
const moltres_1 = require("./moltres");
const monferno_1 = require("./monferno");
const morgrem_1 = require("./morgrem");
const morpeko_v_1 = require("./morpeko-v");
const mothim_1 = require("./mothim");
const muk_1 = require("./muk");
const nosepass_1 = require("./nosepass");
const pachirisu_1 = require("./pachirisu");
const pikachu_v_1 = require("./pikachu-v");
const piplup_1 = require("./piplup");
const prinplup_1 = require("./prinplup");
const probopass_1 = require("./probopass");
const purrloin_1 = require("./purrloin");
const raichu_v_1 = require("./raichu-v");
const raikou_v_1 = require("./raikou-v");
const riolu_1 = require("./riolu");
const sawk_1 = require("./sawk");
const shaymin_v_1 = require("./shaymin-v");
const shaymin_vstar_1 = require("./shaymin-vstar");
const shinx_1 = require("./shinx");
const shroomish_1 = require("./shroomish");
const sigilyph_1 = require("./sigilyph");
const simisear_v_1 = require("./simisear-v");
const sneasel_1 = require("./sneasel");
const snorunt_1 = require("./snorunt");
const spiritomb_1 = require("./spiritomb");
const staraptor_1 = require("./staraptor");
const staravia_1 = require("./staravia");
const starly_1 = require("./starly");
const starmie_1 = require("./starmie");
const staryu_1 = require("./staryu");
const throh_1 = require("./throh");
const torkoal_1 = require("./torkoal");
const tornadus_1 = require("./tornadus");
const torterra_1 = require("./torterra");
const trapinch_1 = require("./trapinch");
const tropius_1 = require("./tropius");
const turtwig_1 = require("./turtwig");
const vibrava_1 = require("./vibrava");
const weavile_1 = require("./weavile");
const whimsicott_v_1 = require("./whimsicott-v");
const whimsicott_vstar_1 = require("./whimsicott-vstar");
const wormadam_1 = require("./wormadam");
const wormadam_2_1 = require("./wormadam-2");
const wormadam_3_1 = require("./wormadam-3");
const zarude_v_1 = require("./zarude-v");
const acerolas_premonition_1 = require("./acerolas-premonition");
const barry_1 = require("./barry");
const blunder_policy_1 = require("./blunder-policy");
const cafe_master_1 = require("./cafe-master");
const cherens_care_1 = require("./cherens-care");
const cleansing_gloves_1 = require("./cleansing-gloves");
const collapsed_stadium_1 = require("./collapsed-stadium");
const cynthias_ambition_1 = require("./cynthias-ambition");
const friends_in_galar_1 = require("./friends-in-galar");
const gloria_1 = require("./gloria");
const hunting_gloves_1 = require("./hunting-gloves");
const kindler_1 = require("./kindler");
const magma_basin_1 = require("./magma-basin");
const marnies_pride_1 = require("./marnies-pride");
const pot_helmet_1 = require("./pot-helmet");
const roseannes_backup_1 = require("./roseannes-backup");
const team_yells_cheer_1 = require("./team-yells-cheer");
const double_turbo_energy_1 = require("./double-turbo-energy");
const other_prints_1 = require("./other-prints");
exports.setBrilliantStars = [
    // Pokemon
    new aggron_v_1.AggronV(),
    new aggron_vmax_1.AggronVMAX(),
    new alcremie_1.Alcremie(),
    new arceus_v_1.ArceusV(),
    new arceus_vstar_1.ArceusVSTAR(),
    new axew_1.Axew(),
    new baltoy_1.Baltoy(),
    new beartic_1.Beartic(),
    new bibarel_1.Bibarel(),
    new bidoof_1.Bidoof(),
    new breloom_1.Breloom(),
    new buizel_1.Buizel(),
    new castform_1.Castform(),
    new charizard_v_1.CharizardV(),
    new charizard_vstar_1.CharizardVstar(),
    new cherubi_1.Cherubi(),
    new chimchar_1.Chimchar(),
    new chimecho_1.Chimecho(),
    new cinccino_1.Cinccino(),
    new claydol_1.Claydol(),
    new clefable_1.Clefable(),
    new clefairy_1.Clefairy(),
    new corphish_1.Corphish(),
    new crawdaunt_1.Crawdaunt(),
    new cubchoo_1.Cubchoo(),
    new dedenne_1.Dedenne(),
    new dracovish_v_1.DracovishV(),
    new drampa_v_1.DrampaV(),
    new druddigon_1.Druddigon(),
    new dusclops_1.Dusclops(),
    new dusknoir_1.Dusknoir(),
    new duskull_1.Duskull(),
    new eiscue_1.Eiscue(),
    new electivire_1.Electivire(),
    new empoleon_1.Empoleon(),
    new entei_v_1.EnteiV(),
    new escavalier_1.Escavalier(),
    new exeggcute_1.Exeggcute(),
    new exeggutor_1.Exeggutor(),
    new farfetchd_1.Farfetchd(),
    new floatzel_1.Floatzel(),
    new flygon_1.Flygon(),
    new flygon_v_1.FlygonV(),
    new fraxure_1.Fraxure(),
    new gabite_1.Gabite(),
    new garchomp_1.Garchomp(),
    new gible_1.Gible(),
    new golett_1.Golett(),
    new golurk_1.Golurk(),
    new granbull_v_1.GranbullV(),
    new grimer_1.Grimer(),
    new grimmsnarl_1.Grimmsnarl(),
    new grotle_1.Grotle(),
    new hawlucha_1.Hawlucha(),
    new haxorus_1.Haxorus(),
    new heatran_1.Heatran(),
    new hitmontop_1.Hitmontop(),
    new honchkrow_v_1.HonchkrowV(),
    new impidimp_1.Impidimp(),
    new infernape_1.Infernape(),
    new kingler_v_1.KinglerV(),
    new kingler_vmax_1.KinglerVmax(),
    new klang_1.Klang(),
    new klink_1.Klink(),
    new klinklang_1.Klinklang(),
    new lapras_1.Lapras(),
    new liepard_1.Liepard(),
    new lucario_1.Lucario(),
    new lumineon_v_1.LumineonV(),
    new luxio_1.Luxio(),
    new luxray_1.Luxray(),
    new magmar_1.Magmar(),
    new magmortar_1.Magmortar(),
    new manaphy_1.Manaphy(),
    new mewtwo_1.Mewtwo(),
    new milcery_1.Milcery(),
    new mimikyu_vmax_1.MimikyuVmax(),
    new minccino_1.Minccino(),
    new moltres_1.Moltres(),
    new monferno_1.Monferno(),
    new morgrem_1.Morgrem(),
    new morpeko_v_1.MorpekoV(),
    new mothim_1.Mothim(),
    new muk_1.Muk(),
    new nosepass_1.Nosepass(),
    new pachirisu_1.Pachirisu(),
    new pikachu_v_1.PikachuV(),
    new piplup_1.Piplup(),
    new prinplup_1.Prinplup(),
    new probopass_1.Probopass(),
    new purrloin_1.Purrloin(),
    new raichu_v_1.RaichuV(),
    new raikou_v_1.RaikouV(),
    new riolu_1.Riolu(),
    new sawk_1.Sawk(),
    new shaymin_v_1.ShayminV(),
    new shaymin_vstar_1.ShayminVSTAR(),
    new shinx_1.Shinx(),
    new shroomish_1.Shroomish(),
    new sigilyph_1.Sigilyph(),
    new simisear_v_1.SimisearV(),
    new sneasel_1.Sneasel(),
    new snorunt_1.Snorunt(),
    new spiritomb_1.Spiritomb(),
    new staraptor_1.Staraptor(),
    new staravia_1.Staravia(),
    new starly_1.Starly(),
    new starmie_1.Starmie(),
    new staryu_1.Staryu(),
    new throh_1.Throh(),
    new torkoal_1.Torkoal(),
    new tornadus_1.Tornadus(),
    new torterra_1.Torterra(),
    new trapinch_1.Trapinch(),
    new tropius_1.Tropius(),
    new turtwig_1.Turtwig(),
    new vibrava_1.Vibrava(),
    new weavile_1.Weavile(),
    new whimsicott_v_1.WhimsicottV(),
    new whimsicott_vstar_1.WhimsicottVSTAR(),
    new wormadam_1.Wormadam(),
    new wormadam_2_1.Wormadam2(),
    new wormadam_3_1.Wormadam3(),
    new zarude_v_1.ZarudeV(),
    // Trainers
    new acerolas_premonition_1.AcerolasPremonition(),
    new barry_1.Barry(),
    new blunder_policy_1.BlunderPolicy(),
    new cafe_master_1.CafeMaster(),
    new cherens_care_1.CherensCare(),
    new cleansing_gloves_1.CleansingGloves(),
    new collapsed_stadium_1.CollapsedStadium(),
    new cynthias_ambition_1.CynthiasAmbition(),
    new friends_in_galar_1.FriendsInGalar(),
    new gloria_1.Gloria(),
    new hunting_gloves_1.HuntingGloves(),
    new kindler_1.Kindler(),
    new magma_basin_1.MagmaBasin(),
    new marnies_pride_1.MarniesPride(),
    new pot_helmet_1.PotHelmet(),
    new roseannes_backup_1.RoseannesBackup(),
    new team_yells_cheer_1.TeamYellsCheer(),
    // Energy
    new double_turbo_energy_1.DoubleTurboEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.UltraBallHR(),
    new other_prints_1.WhimsicottVFA(),
    new other_prints_1.WhimsicottVSTARRR(),
    new other_prints_1.MimikyuVBRS(),
    new other_prints_1.ZamazentaVBRS(),
    new other_prints_1.BossOrdersBRS(),
    new other_prints_1.ChoiceBeltBRS(),
    new other_prints_1.ProfessorsResearchBRS(),
    new other_prints_1.UltraBallBRS(),
    new other_prints_1.ShayminV2BRS(),
    new other_prints_1.LumineonV2BRS(),
    new other_prints_1.LumineonV3BRS(),
    new other_prints_1.RaichuV2BRS(),
    new other_prints_1.ZamazentaV2BRS(),
    new other_prints_1.ArceusV2BRS(),
    new other_prints_1.ArceusV3BRS(),
    new other_prints_1.CherensCare2BRS(),
    new other_prints_1.CynthiasAmbition2BRS(),
    new other_prints_1.Kindler2BRS(),
    new other_prints_1.MarniesPride2BRS(),
    new other_prints_1.RoseannesBackup2BRS(),
    new other_prints_1.ShayminVSTAR2BRS(),
    new other_prints_1.ArceusVSTAR2BRS(),
    new other_prints_1.CherensCare3BRS(),
    new other_prints_1.CynthiasAmbition3BRS(),
    new other_prints_1.Kindler3BRS(),
    new other_prints_1.RoseannesBackup3BRS(),
    new other_prints_1.GalarianArticunoVBRS(),
    new other_prints_1.GalarianZapdosVBRS(),
    new other_prints_1.GalarianMoltresVBRS(),
    new other_prints_1.ArceusVSTAR3BRS(),
    new other_prints_1.MagmaBasin2BRS(),
    new other_prints_1.GrassEnergyBRS(),
    new other_prints_1.FireEnergyBRS(),
    new other_prints_1.WaterEnergyBRS(),
    new other_prints_1.LightningEnergyBRS(),
    new other_prints_1.PsychicEnergyBRS(),
    new other_prints_1.FightingEnergyBRS(),
    new other_prints_1.DarknessEnergyBRS(),
    new other_prints_1.MetalEnergyBRS(),
    new other_prints_1.OctilleryBRS(),
    new other_prints_1.ZekromBRS(),
    new other_prints_1.Dusknoir2BRS(),
    new other_prints_1.Alcremie2BRS(),
    new other_prints_1.HoundoomBRS(),
    new other_prints_1.OranguruBRS(),
    new other_prints_1.SylveonVBRS(),
    new other_prints_1.SylveonVMAXBRS(),
    new other_prints_1.MimikyuV2BRS(),
    new other_prints_1.SingleStrikeUrshifuVBRS(),
    new other_prints_1.SingleStrikeUrshifuVMAXBRS(),
    new other_prints_1.RapidStrikeUrshifuVBRS(),
    new other_prints_1.RapidStrikeUrshifuVMAXBRS(),
    new other_prints_1.UmbreonVBRS(),
    new other_prints_1.UmbreonVMAXBRS(),
    new other_prints_1.AcerolasPremonition2BRS(),
    new other_prints_1.CafeMaster2BRS(),
    new other_prints_1.Gloria2BRS(),
    new other_prints_1.SingleStrikeStyleMustardBRS(),
    new other_prints_1.SingleStrikeUrshifuVMAX2BRS(),
    new other_prints_1.RapidStrikeUrshifuVMAX2BRS(),
    new other_prints_1.BurmyBRS(),
    new other_prints_1.KarrablastBRS(),
    new other_prints_1.FreshWaterSetBRS(),
    new other_prints_1.CharizardV2(),
    new other_prints_1.CharizardV3(),
    new other_prints_1.GranbullV2(),
    new other_prints_1.HonchkrowV2(),
    new other_prints_1.HonchkrowV3(),
    new other_prints_1.FlygonV2(),
    new other_prints_1.Barry2(),
    new other_prints_1.CharizardVstar2(),
];

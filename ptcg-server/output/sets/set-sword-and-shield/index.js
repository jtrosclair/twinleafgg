"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSwordAndShield = void 0;
const baltoy_1 = require("./baltoy");
const baltoy_2_1 = require("./baltoy-2");
const bisharp_1 = require("./bisharp");
const blipbug_1 = require("./blipbug");
const blipbug_2_1 = require("./blipbug-2");
const boltund_1 = require("./boltund");
const boltund_2_1 = require("./boltund-2");
const celebi_v_1 = require("./celebi-v");
const centiskorch_1 = require("./centiskorch");
const chewtle_1 = require("./chewtle");
const chinchou_1 = require("./chinchou");
const chinchou_2_1 = require("./chinchou-2");
const cinccino_1 = require("./cinccino");
const cinderace_1 = require("./cinderace");
const cinderace_2_1 = require("./cinderace-2");
const cinderace_3_1 = require("./cinderace-3");
const claydol_1 = require("./claydol");
const clobbopus_1 = require("./clobbopus");
const clobbopus_2_1 = require("./clobbopus-2");
const cloyster_1 = require("./cloyster");
const copperajah_1 = require("./copperajah");
const corviknight_1 = require("./corviknight");
const corvisquire_1 = require("./corvisquire");
const cottonee_1 = require("./cottonee");
const cramorant_1 = require("./cramorant");
const cramorant_v_1 = require("./cramorant-v");
const croagunk_1 = require("./croagunk");
const cufant_1 = require("./cufant");
const dhelmise_v_1 = require("./dhelmise-v");
const diglett_1 = require("./diglett");
const dottler_1 = require("./dottler");
const drampa_1 = require("./drampa");
const drapion_1 = require("./drapion");
const drednaw_1 = require("./drednaw");
const drizzile_1 = require("./drizzile");
const drizzile_2_1 = require("./drizzile-2");
const dubwool_1 = require("./dubwool");
const dugtrio_1 = require("./dugtrio");
const durant_1 = require("./durant");
const eldegoss_1 = require("./eldegoss");
const ferroseed_1 = require("./ferroseed");
const ferrothorn_1 = require("./ferrothorn");
const frosmoth_1 = require("./frosmoth");
const galarian_linoone_1 = require("./galarian-linoone");
const galarian_meowth_1 = require("./galarian-meowth");
const galarian_obstagoon_1 = require("./galarian-obstagoon");
const galarian_perrserker_1 = require("./galarian-perrserker");
const galarian_ponyta_1 = require("./galarian-ponyta");
const galarian_rapidash_1 = require("./galarian-rapidash");
const galarian_stunfisk_1 = require("./galarian-stunfisk");
const galarian_zigzagoon_1 = require("./galarian-zigzagoon");
const galvantula_1 = require("./galvantula");
const gastly_1 = require("./gastly");
const gengar_1 = require("./gengar");
const goldeen_1 = require("./goldeen");
const goldeen_2_1 = require("./goldeen-2");
const gossifleur_1 = require("./gossifleur");
const grapploct_1 = require("./grapploct");
const grookey_1 = require("./grookey");
const grookey_2_1 = require("./grookey-2");
const haunter_1 = require("./haunter");
const heatmor_1 = require("./heatmor");
const hitmonchan_1 = require("./hitmonchan");
const hitmonlee_1 = require("./hitmonlee");
const hoothoot_1 = require("./hoothoot");
const indeedee_v_1 = require("./indeedee-v");
const inteleon_1 = require("./inteleon");
const inteleon_2_1 = require("./inteleon-2");
const joltik_1 = require("./joltik");
const keldeo_v_1 = require("./keldeo-v");
const kingler_1 = require("./kingler");
const krabby_1 = require("./krabby");
const krabby_2_1 = require("./krabby-2");
const lanturn_1 = require("./lanturn");
const lapras_1 = require("./lapras");
const lapras_v_1 = require("./lapras-v");
const lapras_vmax_1 = require("./lapras-vmax");
const mantine_1 = require("./mantine");
const maractus_1 = require("./maractus");
const mawile_1 = require("./mawile");
const minccino_1 = require("./minccino");
const minccino_2_1 = require("./minccino-2");
const morpeko_1 = require("./morpeko");
const morpeko_v_1 = require("./morpeko-v");
const morpeko_vmax_1 = require("./morpeko-vmax");
const mudbray_1 = require("./mudbray");
const mudsdale_1 = require("./mudsdale");
const munna_1 = require("./munna");
const musharna_1 = require("./musharna");
const nickit_1 = require("./nickit");
const ninetales_1 = require("./ninetales");
const noctowl_1 = require("./noctowl");
const oranguru_1 = require("./oranguru");
const orbeetle_1 = require("./orbeetle");
const pawniard_1 = require("./pawniard");
const pikachu_1 = require("./pikachu");
const pincurchin_1 = require("./pincurchin");
const polteageist_1 = require("./polteageist");
const qwilfish_1 = require("./qwilfish");
const raboot_1 = require("./raboot");
const raboot_2_1 = require("./raboot-2");
const raichu_1 = require("./raichu");
const regirock_v_1 = require("./regirock-v");
const rhydon_1 = require("./rhydon");
const rhyhorn_1 = require("./rhyhorn");
const rhyhorn_2_1 = require("./rhyhorn-2");
const rhyperior_1 = require("./rhyperior");
const rillaboom_1 = require("./rillaboom");
const rillaboom_2_1 = require("./rillaboom-2");
const rookidee_1 = require("./rookidee");
const roselia_1 = require("./roselia");
const roselia_2_1 = require("./roselia-2");
const roserade_1 = require("./roserade");
const sableye_v_1 = require("./sableye-v");
const salandit_1 = require("./salandit");
const salazzle_1 = require("./salazzle");
const sandaconda_1 = require("./sandaconda");
const sandaconda_2_1 = require("./sandaconda-2");
const scorbunny_1 = require("./scorbunny");
const scorbunny_2_1 = require("./scorbunny-2");
const seaking_1 = require("./seaking");
const shellder_1 = require("./shellder");
const silicobra_1 = require("./silicobra");
const silicobra_2_1 = require("./silicobra-2");
const sinistea_1 = require("./sinistea");
const sizzlipede_1 = require("./sizzlipede");
const sizzlipede_2_1 = require("./sizzlipede-2");
const skorupi_1 = require("./skorupi");
const snom_1 = require("./snom");
const snorlax_1 = require("./snorlax");
const snorlax_v_1 = require("./snorlax-v");
const snorlax_vmax_1 = require("./snorlax-vmax");
const sobble_1 = require("./sobble");
const sobble_2_1 = require("./sobble-2");
const sobble_3_1 = require("./sobble-3");
const stonjourner_1 = require("./stonjourner");
const stonjourner_v_1 = require("./stonjourner-v");
const stonjourner_vmax_1 = require("./stonjourner-vmax");
const sudowoodo_1 = require("./sudowoodo");
const tapu_koko_v_1 = require("./tapu-koko-v");
const thievul_1 = require("./thievul");
const thwackey_1 = require("./thwackey");
const thwackey_2_1 = require("./thwackey-2");
const torkoal_v_1 = require("./torkoal-v");
const toxicroak_1 = require("./toxicroak");
const turtonator_1 = require("./turtonator");
const victini_v_1 = require("./victini-v");
const vulpix_1 = require("./vulpix");
const whimsicott_1 = require("./whimsicott");
const wobbuffet_v_1 = require("./wobbuffet-v");
const wooloo_1 = require("./wooloo");
const wooloo_2_1 = require("./wooloo-2");
const yamper_1 = require("./yamper");
const yamper_2_1 = require("./yamper-2");
const zacian_v_1 = require("./zacian-v");
const zamazenta_v_1 = require("./zamazenta-v");
const air_balloon_1 = require("./air-balloon");
const bede_1 = require("./bede");
const big_charm_1 = require("./big-charm");
const evolution_incense_1 = require("./evolution-incense");
const giant_hearth_1 = require("./giant-hearth");
const hop_1 = require("./hop");
const marnie_1 = require("./marnie");
const metal_saucer_1 = require("./metal-saucer");
const ordinary_rod_1 = require("./ordinary-rod");
const poke_kid_1 = require("./poke-kid");
const pokemon_catcher_1 = require("./pokemon-catcher");
const quick_ball_1 = require("./quick-ball");
const rotom_bike_1 = require("./rotom-bike");
const sitrus_berry_1 = require("./sitrus-berry");
const switch_1 = require("./switch");
const team_yell_grunt_1 = require("./team-yell-grunt");
const welder_1 = require("./welder");
const aurora_energy_1 = require("./aurora-energy");
const basic_energies_1 = require("./basic-energies");
const other_prints_1 = require("./other-prints");
exports.setSwordAndShield = [
    // Pokemon
    new baltoy_1.Baltoy(),
    new baltoy_2_1.Baltoy2(),
    new bisharp_1.Bisharp(),
    new blipbug_1.Blipbug(),
    new blipbug_2_1.Blipbug2(),
    new boltund_1.Boltund(),
    new boltund_2_1.Boltund2(),
    new celebi_v_1.CelebiV(),
    new centiskorch_1.Centiskorch(),
    new chewtle_1.Chewtle(),
    new chinchou_1.Chinchou(),
    new chinchou_2_1.Chinchou2(),
    new cinccino_1.Cinccino(),
    new cinderace_1.Cinderace(),
    new cinderace_2_1.Cinderace2(),
    new cinderace_3_1.Cinderace3(),
    new claydol_1.Claydol(),
    new clobbopus_1.Clobbopus(),
    new clobbopus_2_1.Clobbopus2(),
    new cloyster_1.Cloyster(),
    new copperajah_1.Copperajah(),
    new corviknight_1.Corviknight(),
    new corvisquire_1.Corvisquire(),
    new cottonee_1.Cottonee(),
    new cramorant_1.Cramorant(),
    new cramorant_v_1.CramorantV(),
    new croagunk_1.Croagunk(),
    new cufant_1.Cufant(),
    new dhelmise_v_1.DhelmiseV(),
    new diglett_1.Diglett(),
    new dottler_1.Dottler(),
    new drampa_1.Drampa(),
    new drapion_1.Drapion(),
    new drednaw_1.Drednaw(),
    new drizzile_1.Drizzile(),
    new drizzile_2_1.Drizzile2(),
    new dubwool_1.Dubwool(),
    new dugtrio_1.Dugtrio(),
    new durant_1.Durant(),
    new eldegoss_1.Eldegoss(),
    new ferroseed_1.Ferroseed(),
    new ferrothorn_1.Ferrothorn(),
    new frosmoth_1.Frosmoth(),
    new galarian_linoone_1.GalarianLinoone(),
    new galarian_meowth_1.GalarianMeowth(),
    new galarian_obstagoon_1.GalarianObstagoon(),
    new galarian_perrserker_1.GalarianPerrserker(),
    new galarian_ponyta_1.GalarianPonyta(),
    new galarian_rapidash_1.GalarianRapidash(),
    new galarian_stunfisk_1.GalarianStunfisk(),
    new galarian_zigzagoon_1.GalarianZigzagoon(),
    new galvantula_1.Galvantula(),
    new gastly_1.Gastly(),
    new gengar_1.Gengar(),
    new goldeen_1.Goldeen(),
    new goldeen_2_1.Goldeen2(),
    new gossifleur_1.Gossifleur(),
    new grapploct_1.Grapploct(),
    new grookey_1.Grookey(),
    new grookey_2_1.Grookey2(),
    new haunter_1.Haunter(),
    new heatmor_1.Heatmor(),
    new hitmonchan_1.Hitmonchan(),
    new hitmonlee_1.Hitmonlee(),
    new hoothoot_1.Hoothoot(),
    new indeedee_v_1.IndeedeeV(),
    new inteleon_1.Inteleon(),
    new inteleon_2_1.Inteleon2(),
    new joltik_1.Joltik(),
    new keldeo_v_1.KeldeoV(),
    new kingler_1.Kingler(),
    new krabby_1.Krabby(),
    new krabby_2_1.Krabby2(),
    new lanturn_1.Lanturn(),
    new lapras_1.Lapras(),
    new lapras_v_1.LaprasV(),
    new lapras_vmax_1.LaprasVmax(),
    new mantine_1.Mantine(),
    new maractus_1.Maractus(),
    new mawile_1.Mawile(),
    new minccino_1.Minccino(),
    new minccino_2_1.Minccino2(),
    new morpeko_1.Morpeko(),
    new morpeko_v_1.MorpekoV(),
    new morpeko_vmax_1.MorpekoVmax(),
    new mudbray_1.Mudbray(),
    new mudsdale_1.Mudsdale(),
    new munna_1.Munna(),
    new musharna_1.Musharna(),
    new nickit_1.Nickit(),
    new ninetales_1.Ninetales(),
    new noctowl_1.Noctowl(),
    new oranguru_1.Oranguru(),
    new orbeetle_1.Orbeetle(),
    new pawniard_1.Pawniard(),
    new pikachu_1.Pikachu(),
    new pincurchin_1.Pincurchin(),
    new polteageist_1.Polteageist(),
    new qwilfish_1.Qwilfish(),
    new raboot_1.Raboot(),
    new raboot_2_1.Raboot2(),
    new raichu_1.Raichu(),
    new regirock_v_1.RegirockV(),
    new rhydon_1.Rhydon(),
    new rhyhorn_1.Rhyhorn(),
    new rhyhorn_2_1.Rhyhorn2(),
    new rhyperior_1.Rhyperior(),
    new rillaboom_1.Rillaboom(),
    new rillaboom_2_1.Rillaboom2(),
    new rookidee_1.Rookidee(),
    new roselia_1.Roselia(),
    new roselia_2_1.Roselia2(),
    new roserade_1.Roserade(),
    new sableye_v_1.SableyeV(),
    new salandit_1.Salandit(),
    new salazzle_1.Salazzle(),
    new sandaconda_1.Sandaconda(),
    new sandaconda_2_1.Sandaconda2(),
    new scorbunny_1.Scorbunny(),
    new scorbunny_2_1.Scorbunny2(),
    new seaking_1.Seaking(),
    new shellder_1.Shellder(),
    new silicobra_1.Silicobra(),
    new silicobra_2_1.Silicobra2(),
    new sinistea_1.Sinistea(),
    new sizzlipede_1.Sizzlipede(),
    new sizzlipede_2_1.Sizzlipede2(),
    new skorupi_1.Skorupi(),
    new snom_1.Snom(),
    new snorlax_1.Snorlax(),
    new snorlax_v_1.SnorlaxV(),
    new snorlax_vmax_1.SnorlaxVmax(),
    new sobble_1.Sobble(),
    new sobble_2_1.Sobble2(),
    new sobble_3_1.Sobble3(),
    new stonjourner_1.Stonjourner(),
    new stonjourner_v_1.StonjournerV(),
    new stonjourner_vmax_1.StonjournerVMAX(),
    new sudowoodo_1.Sudowoodo(),
    new tapu_koko_v_1.TapuKokoV(),
    new thievul_1.Thievul(),
    new thwackey_1.Thwackey(),
    new thwackey_2_1.Thwackey2(),
    new torkoal_v_1.TorkoalV(),
    new toxicroak_1.Toxicroak(),
    new turtonator_1.Turtonator(),
    new victini_v_1.VictiniV(),
    new vulpix_1.Vulpix(),
    new whimsicott_1.Whimsicott(),
    new wobbuffet_v_1.WobbuffetV(),
    new wooloo_1.Wooloo(),
    new wooloo_2_1.Wooloo2(),
    new yamper_1.Yamper(),
    new yamper_2_1.Yamper2(),
    new zacian_v_1.ZacianV(),
    new zamazenta_v_1.ZamazentaV(),
    // Trainers
    new air_balloon_1.AirBalloon(),
    new bede_1.Bede(),
    new big_charm_1.BigCharm(),
    new evolution_incense_1.EvolutionIncense(),
    new giant_hearth_1.GiantHearth(),
    new hop_1.Hop(),
    new marnie_1.Marnie(),
    new metal_saucer_1.MetalSaucer(),
    new ordinary_rod_1.OrdinaryRod(),
    new poke_kid_1.PokeKid(),
    new pokemon_catcher_1.PokemonCatcher(),
    new quick_ball_1.QuickBall(),
    new rotom_bike_1.RotomBike(),
    new sitrus_berry_1.SitrusBerry(),
    new switch_1.Switch(),
    new team_yell_grunt_1.TeamYellGrunt(),
    new welder_1.Welder(),
    // Energy
    new aurora_energy_1.AuroraEnergy(),
    new basic_energies_1.GrassEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.GreatBallSSH(),
    new other_prints_1.MarnieSSH(),
    new other_prints_1.MarnieSSH2(),
    new other_prints_1.ProfessorsResearchSSH(),
    new other_prints_1.CrushingHammerSSH(),
    new other_prints_1.EnergyRetrievalSSH(),
    new other_prints_1.EnergySearchSSH(),
    new other_prints_1.EnergySwitchPKSSH(),
    new other_prints_1.LumBerrySSH(),
    new other_prints_1.PalPadSSH(),
    new other_prints_1.Pokegear30HSSSH(),
    new other_prints_1.PokemonCatcherSSH(),
    new other_prints_1.PotionSSH(),
    new other_prints_1.RareCandySSH(),
    new other_prints_1.VitalityBandSSH(),
    new other_prints_1.StonjournerV2SSH(),
    new other_prints_1.ZacianV2SSH(),
    new other_prints_1.CramorantV2SSH(),
    new other_prints_1.Bede2SSH(),
    new other_prints_1.ProfessorsResearch2SSH(),
    new other_prints_1.StonjournerVMAX2SSH(),
    new other_prints_1.Bede3SSH(),
    new other_prints_1.ProfessorsResearch3SSH(),
    new other_prints_1.ZacianV3SSH(),
    new other_prints_1.AirBalloon2SSH(),
    new other_prints_1.MetalSaucer2SSH(),
    new other_prints_1.OrdinaryRod2SSH(),
    new other_prints_1.QuickBall2SSH(),
    new other_prints_1.HyperPotionSSH(),
    new other_prints_1.LuckyEggSSH(),
    new other_prints_1.PokemonCenterLadySSH(),
    new other_prints_1.DhelmiseV2(),
    new other_prints_1.TorkoalV2(),
    new other_prints_1.LaprasV2(),
    new other_prints_1.MorpekoV2(),
    new other_prints_1.WobbuffetV2(),
    new other_prints_1.IndeedeeV2(),
    new other_prints_1.SableyeV2(),
    new other_prints_1.ZamazentaV2(),
    new other_prints_1.SnorlaxV2(),
    new other_prints_1.TeamYellGrunt2(),
    new other_prints_1.LaprasVmax2(),
    new other_prints_1.MorpekoVmax2(),
    new other_prints_1.SnorlaxVmax2(),
    new other_prints_1.TeamYellGrunt3(),
    new other_prints_1.ZamazentaV3(),
];

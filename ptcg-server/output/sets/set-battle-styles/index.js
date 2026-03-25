"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBattleStyles = void 0;
const aegislash_1 = require("./aegislash");
const aegislash_2_1 = require("./aegislash-2");
const baltoy_1 = require("./baltoy");
const bellsprout_1 = require("./bellsprout");
const bisharp_1 = require("./bisharp");
const blipbug_1 = require("./blipbug");
const boltund_1 = require("./boltund");
const bouffalant_1 = require("./bouffalant");
const bronzong_1 = require("./bronzong");
const bronzor_1 = require("./bronzor");
const bruxish_1 = require("./bruxish");
const cacnea_1 = require("./cacnea");
const cacturne_1 = require("./cacturne");
const carkol_1 = require("./carkol");
const carnivine_1 = require("./carnivine");
const centiskorch_1 = require("./centiskorch");
const cherrim_1 = require("./cherrim");
const cherubi_1 = require("./cherubi");
const chimecho_1 = require("./chimecho");
const claydol_1 = require("./claydol");
const coalossal_1 = require("./coalossal");
const conkeldurr_1 = require("./conkeldurr");
const corphish_1 = require("./corphish");
const corviknight_v_1 = require("./corviknight-v");
const corviknight_vmax_1 = require("./corviknight-vmax");
const crawdaunt_1 = require("./crawdaunt");
const crobat_1 = require("./crobat");
const cubone_1 = require("./cubone");
const dottler_1 = require("./dottler");
const doublade_1 = require("./doublade");
const drampa_1 = require("./drampa");
const durant_1 = require("./durant");
const electabuzz_1 = require("./electabuzz");
const electivire_1 = require("./electivire");
const emboar_1 = require("./emboar");
const empoleon_v_1 = require("./empoleon-v");
const entei_1 = require("./entei");
const espurr_1 = require("./espurr");
const falinks_1 = require("./falinks");
const fearow_1 = require("./fearow");
const flapple_v_1 = require("./flapple-v");
const flapple_vmax_1 = require("./flapple-vmax");
const fomantis_1 = require("./fomantis");
const frillish_1 = require("./frillish");
const galarian_mr_mime_1 = require("./galarian-mr-mime");
const galarian_mr_rime_1 = require("./galarian-mr-rime");
const galarian_slowbro_1 = require("./galarian-slowbro");
const galarian_slowpoke_1 = require("./galarian-slowpoke");
const glameow_1 = require("./glameow");
const gligar_1 = require("./gligar");
const gliscor_1 = require("./gliscor");
const golbat_1 = require("./golbat");
const grumpig_1 = require("./grumpig");
const gurdurr_1 = require("./gurdurr");
const heatmor_1 = require("./heatmor");
const honchkrow_1 = require("./honchkrow");
const honedge_1 = require("./honedge");
const horsea_1 = require("./horsea");
const houndoom_1 = require("./houndoom");
const houndour_1 = require("./houndour");
const indeedee_1 = require("./indeedee");
const jellicent_1 = require("./jellicent");
const kingdra_1 = require("./kingdra");
const kricketune_v_1 = require("./kricketune-v");
const lickilicky_1 = require("./lickilicky");
const lickitung_1 = require("./lickitung");
const lurantis_1 = require("./lurantis");
const luxio_1 = require("./luxio");
const luxray_1 = require("./luxray");
const mankey_1 = require("./mankey");
const marowak_1 = require("./marowak");
const mawile_1 = require("./mawile");
const meowstic_1 = require("./meowstic");
const mienfoo_1 = require("./mienfoo");
const mienshao_1 = require("./mienshao");
const mimikyu_v_1 = require("./mimikyu-v");
const morpeko_1 = require("./morpeko");
const murkrow_1 = require("./murkrow");
const necrozma_v_1 = require("./necrozma-v");
const octillery_1 = require("./octillery");
const onix_1 = require("./onix");
const orbeetle_1 = require("./orbeetle");
const pachirisu_1 = require("./pachirisu");
const pawniard_1 = require("./pawniard");
const pignite_1 = require("./pignite");
const primeape_1 = require("./primeape");
const purugly_1 = require("./purugly");
const rapid_strike_urshifu_v_1 = require("./rapid-strike-urshifu-v");
const rapid_strike_urshifu_vmax_1 = require("./rapid-strike-urshifu-vmax");
const remoraid_1 = require("./remoraid");
const rolycoly_1 = require("./rolycoly");
const salandit_1 = require("./salandit");
const salazzle_1 = require("./salazzle");
const sandaconda_1 = require("./sandaconda");
const scatterbug_1 = require("./scatterbug");
const seadra_1 = require("./seadra");
const shinx_1 = require("./shinx");
const silicobra_1 = require("./silicobra");
const single_strike_urshifu_v_1 = require("./single-strike-urshifu-v");
const single_strike_urshifu_vmax_1 = require("./single-strike-urshifu-vmax");
const sizzlipede_1 = require("./sizzlipede");
const spewpa_1 = require("./spewpa");
const spoink_1 = require("./spoink");
const steelix_1 = require("./steelix");
const stonjourner_1 = require("./stonjourner");
const stoutland_v_1 = require("./stoutland-v");
const tapu_bulu_1 = require("./tapu-bulu");
const tapu_koko_v_1 = require("./tapu-koko-v");
const tapu_koko_vmax_1 = require("./tapu-koko-vmax");
const tyranitar_v_1 = require("./tyranitar-v");
const victini_v_1 = require("./victini-v");
const victini_vmax_1 = require("./victini-vmax");
const victreebel_1 = require("./victreebel");
const vivillon_1 = require("./vivillon");
const weepinbell_1 = require("./weepinbell");
const yamper_1 = require("./yamper");
const zubat_1 = require("./zubat");
const bruno_1 = require("./bruno");
const camping_gear_1 = require("./camping-gear");
const cheryl_1 = require("./cheryl");
const energy_recycler_1 = require("./energy-recycler");
const escape_rope_1 = require("./escape-rope");
const fan_of_waves_1 = require("./fan-of-waves");
const korrinas_focus_1 = require("./korrinas-focus");
const level_ball_1 = require("./level-ball");
const phoebe_1 = require("./phoebe");
const rapid_strike_scroll_of_swirls_1 = require("./rapid-strike-scroll-of-swirls");
const rapid_strike_style_mustard_1 = require("./rapid-strike-style-mustard");
const single_strike_scroll_of_scorn_1 = require("./single-strike-scroll-of-scorn");
const single_strike_style_mustard_1 = require("./single-strike-style-mustard");
const sordward_and_shielbert_1 = require("./sordward-and-shielbert");
const tool_jammer_1 = require("./tool-jammer");
const tower_of_darkness_1 = require("./tower-of-darkness");
const tower_of_waters_1 = require("./tower-of-waters");
const urn_of_vitality_1 = require("./urn-of-vitality");
const rapid_strike_energy_1 = require("./rapid-strike-energy");
const single_strike_energy_1 = require("./single-strike-energy");
const other_prints_1 = require("./other-prints");
exports.setBattleStyles = [
    // Pokemon
    new aegislash_1.Aegislash(),
    new aegislash_2_1.Aegislash2(),
    new baltoy_1.Baltoy(),
    new bellsprout_1.Bellsprout(),
    new bisharp_1.Bisharp(),
    new blipbug_1.Blipbug(),
    new boltund_1.Boltund(),
    new bouffalant_1.Bouffalant(),
    new bronzong_1.Bronzong(),
    new bronzor_1.Bronzor(),
    new bruxish_1.Bruxish(),
    new cacnea_1.Cacnea(),
    new cacturne_1.Cacturne(),
    new carkol_1.Carkol(),
    new carnivine_1.Carnivine(),
    new centiskorch_1.Centiskorch(),
    new cherrim_1.Cherrim(),
    new cherubi_1.Cherubi(),
    new chimecho_1.Chimecho(),
    new claydol_1.Claydol(),
    new coalossal_1.Coalossal(),
    new conkeldurr_1.Conkeldurr(),
    new corphish_1.Corphish(),
    new corviknight_v_1.CorviknightV(),
    new corviknight_vmax_1.CorviknightVmax(),
    new crawdaunt_1.Crawdaunt(),
    new crobat_1.Crobat(),
    new cubone_1.Cubone(),
    new dottler_1.Dottler(),
    new doublade_1.Doublade(),
    new drampa_1.Drampa(),
    new durant_1.Durant(),
    new electabuzz_1.Electabuzz(),
    new electivire_1.Electivire(),
    new emboar_1.Emboar(),
    new empoleon_v_1.EmpoleonV(),
    new entei_1.Entei(),
    new espurr_1.Espurr(),
    new falinks_1.Falinks(),
    new fearow_1.Fearow(),
    new flapple_v_1.FlappleV(),
    new flapple_vmax_1.FlappleVMAX(),
    new fomantis_1.Fomantis(),
    new frillish_1.Frillish(),
    new galarian_mr_mime_1.GalarianMrMime(),
    new galarian_mr_rime_1.GalarianMrRime(),
    new galarian_slowbro_1.GalarianSlowbro(),
    new galarian_slowpoke_1.GalarianSlowpoke(),
    new glameow_1.Glameow(),
    new gligar_1.Gligar(),
    new gliscor_1.Gliscor(),
    new golbat_1.Golbat(),
    new grumpig_1.Grumpig(),
    new gurdurr_1.Gurdurr(),
    new heatmor_1.Heatmor(),
    new honchkrow_1.Honchkrow(),
    new honedge_1.Honedge(),
    new horsea_1.Horsea(),
    new houndoom_1.Houndoom(),
    new houndour_1.Houndour(),
    new indeedee_1.Indeedee(),
    new jellicent_1.Jellicent(),
    new kingdra_1.Kingdra(),
    new kricketune_v_1.KricketuneV(),
    new lickilicky_1.Lickilicky(),
    new lickitung_1.Lickitung(),
    new lurantis_1.Lurantis(),
    new luxio_1.Luxio(),
    new luxray_1.Luxray(),
    new mankey_1.Mankey(),
    new marowak_1.Marowak(),
    new mawile_1.Mawile(),
    new meowstic_1.Meowstic(),
    new mienfoo_1.Mienfoo(),
    new mienshao_1.Mienshao(),
    new mimikyu_v_1.MimikyuV(),
    new morpeko_1.Morpeko(),
    new murkrow_1.Murkrow(),
    new necrozma_v_1.NecrozmaV(),
    new octillery_1.Octillery(),
    new onix_1.Onix(),
    new orbeetle_1.Orbeetle(),
    new pachirisu_1.Pachirisu(),
    new pawniard_1.Pawniard(),
    new pignite_1.Pignite(),
    new primeape_1.Primeape(),
    new purugly_1.Purugly(),
    new rapid_strike_urshifu_v_1.RapidStrikeUrshifuV(),
    new rapid_strike_urshifu_vmax_1.RapidStrikeUrshifuVMAX(),
    new remoraid_1.Remoraid(),
    new rolycoly_1.Rolycoly(),
    new salandit_1.Salandit(),
    new salazzle_1.Salazzle(),
    new sandaconda_1.Sandaconda(),
    new scatterbug_1.Scatterbug(),
    new seadra_1.Seadra(),
    new shinx_1.Shinx(),
    new silicobra_1.Silicobra(),
    new single_strike_urshifu_v_1.SingleStrikeUrshifuV(),
    new single_strike_urshifu_vmax_1.SingleStrikeUrshifuVMAX(),
    new sizzlipede_1.Sizzlipede(),
    new spewpa_1.Spewpa(),
    new spoink_1.Spoink(),
    new steelix_1.Steelix(),
    new stonjourner_1.Stonjourner(),
    new stoutland_v_1.StoutlandV(),
    new tapu_bulu_1.TapuBulu(),
    new tapu_koko_v_1.TapuKokoV(),
    new tapu_koko_vmax_1.TapuKokoVMAX(),
    new tyranitar_v_1.TyranitarV(),
    new victini_v_1.VictiniV(),
    new victini_vmax_1.VictiniVMAX(),
    new victreebel_1.Victreebel(),
    new vivillon_1.Vivillon(),
    new weepinbell_1.Weepinbell(),
    new yamper_1.Yamper(),
    new zubat_1.Zubat(),
    // Trainers
    new bruno_1.Bruno(),
    new camping_gear_1.CampingGear(),
    new cheryl_1.Cheryl(),
    new energy_recycler_1.EnergyRecycler(),
    new escape_rope_1.EscapeRope(),
    new fan_of_waves_1.FanOfWaves(),
    new korrinas_focus_1.KorrinasFocus(),
    new level_ball_1.LevelBall(),
    new phoebe_1.Phoebe(),
    new rapid_strike_scroll_of_swirls_1.RapidStrikeScrollOfSwirls(),
    new rapid_strike_style_mustard_1.RapidStrikeStyleMustard(),
    new single_strike_scroll_of_scorn_1.SingleStrikeScrollOfScorn(),
    new single_strike_style_mustard_1.SingleStrikeStyleMustard(),
    new sordward_and_shielbert_1.SordwardAndShielbert(),
    new tool_jammer_1.ToolJammer(),
    new tower_of_darkness_1.TowerOfDarkness(),
    new tower_of_waters_1.TowerOfWaters(),
    new urn_of_vitality_1.UrnOfVitality(),
    // Energy
    new rapid_strike_energy_1.RapidStrikeEnergy(),
    new single_strike_energy_1.SingleStrikeEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.ExpShareBST(),
    new other_prints_1.KricketuneV2BST(),
    new other_prints_1.FlappleV2BST(),
    new other_prints_1.VictiniV2BST(),
    new other_prints_1.EmpoleonV2BST(),
    new other_prints_1.EmpoleonV3BST(),
    new other_prints_1.TapuKokoV2BST(),
    new other_prints_1.MimikyuV2BST(),
    new other_prints_1.NecrozmaV2BST(),
    new other_prints_1.SingleStrikeUrshifuV2BST(),
    new other_prints_1.SingleStrikeUrshifuV3BST(),
    new other_prints_1.RapidStrikeUrshifuV2BST(),
    new other_prints_1.RapidStrikeUrshifuV3BST(),
    new other_prints_1.TyranitarV2BST(),
    new other_prints_1.TyranitarV3BST(),
    new other_prints_1.StoutlandV2BST(),
    new other_prints_1.Bruno2BST(),
    new other_prints_1.Cheryl2BST(),
    new other_prints_1.KorrinasFocus2BST(),
    new other_prints_1.SingleStrikeStyleMustard2BST(),
    new other_prints_1.FlappleVMAX2BST(),
    new other_prints_1.VictiniVMAX2BST(),
    new other_prints_1.TapuKokoVMAX2BST(),
    new other_prints_1.SingleStrikeUrshifuVMAX2BST(),
    new other_prints_1.SingleStrikeUrshifuVMAX3BST(),
    new other_prints_1.RapidStrikeUrshifuVMAX2BST(),
    new other_prints_1.RapidStrikeUrshifuVMAX3BST(),
    new other_prints_1.Bruno3BST(),
    new other_prints_1.Cheryl3BST(),
    new other_prints_1.KorrinasFocus3BST(),
    new other_prints_1.SingleStrikeStyleMustard3BST(),
    new other_prints_1.Octillery2BST(),
    new other_prints_1.Houndoom2BST(),
    new other_prints_1.ExpShare2BST(),
    new other_prints_1.LevelBall2BST(),
    new other_prints_1.RapidStrikeEnergy2BST(),
    new other_prints_1.SingleStrikeEnergy2BST(),
    new other_prints_1.TepigBST(),
    new other_prints_1.TimburrBST(),
    new other_prints_1.SpearowBST(),
    new other_prints_1.CorviknightV2(),
    new other_prints_1.Phoebe2(),
    new other_prints_1.RapidStrikeStyleMustard2(),
    new other_prints_1.CorviknightVmax2(),
    new other_prints_1.Phoebe3(),
    new other_prints_1.RapidStrikeStyleMustard3(),
];

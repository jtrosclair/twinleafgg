"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPrimalClash = void 0;
const aegislash_1 = require("./aegislash");
const aggron_ex_1 = require("./aggron-ex");
const azumarill_1 = require("./azumarill");
const azumarill_2_1 = require("./azumarill-2");
const barboach_1 = require("./barboach");
const beedrill_1 = require("./beedrill");
const bibarel_1 = require("./bibarel");
const bidoof_1 = require("./bidoof");
const bidoof_2_1 = require("./bidoof-2");
const blaziken_1 = require("./blaziken");
const bouffalant_1 = require("./bouffalant");
const breloom_1 = require("./breloom");
const bunnelby_1 = require("./bunnelby");
const camerupt_ex_1 = require("./camerupt-ex");
const chinchou_1 = require("./chinchou");
const clamperl_1 = require("./clamperl");
const combusken_1 = require("./combusken");
const corphish_1 = require("./corphish");
const crawdaunt_1 = require("./crawdaunt");
const delcatty_1 = require("./delcatty");
const diggersby_1 = require("./diggersby");
const doublade_1 = require("./doublade");
const drilbur_1 = require("./drilbur");
const eelektrik_1 = require("./eelektrik");
const eelektrik_2_1 = require("./eelektrik-2");
const eelektross_1 = require("./eelektross");
const electrike_1 = require("./electrike");
const electrike_2_1 = require("./electrike-2");
const excadrill_1 = require("./excadrill");
const excadrill_2_1 = require("./excadrill-2");
const feebas_1 = require("./feebas");
const flygon_1 = require("./flygon");
const gardevoir_ex_1 = require("./gardevoir-ex");
const gorebyss_1 = require("./gorebyss");
const gorebyss_2_1 = require("./gorebyss-2");
const groudon_1 = require("./groudon");
const groudon_ex_1 = require("./groudon-ex");
const grovyle_1 = require("./grovyle");
const hippopotas_1 = require("./hippopotas");
const hippowdon_1 = require("./hippowdon");
const honedge_1 = require("./honedge");
const horsea_1 = require("./horsea");
const huntail_1 = require("./huntail");
const illumise_1 = require("./illumise");
const kakuna_1 = require("./kakuna");
const kingdra_1 = require("./kingdra");
const kingdra_2_1 = require("./kingdra-2");
const kyogre_1 = require("./kyogre");
const kyogre_ex_1 = require("./kyogre-ex");
const lanturn_1 = require("./lanturn");
const linoone_1 = require("./linoone");
const lombre_1 = require("./lombre");
const lotad_1 = require("./lotad");
const ludicolo_1 = require("./ludicolo");
const ludicolo_2_1 = require("./ludicolo-2");
const m_aggron_ex_1 = require("./m-aggron-ex");
const m_gardevoir_ex_1 = require("./m-gardevoir-ex");
const magcargo_1 = require("./magcargo");
const magcargo_2_1 = require("./magcargo-2");
const manaphy_1 = require("./manaphy");
const manectric_1 = require("./manectric");
const marill_1 = require("./marill");
const marshtomp_1 = require("./marshtomp");
const masquerain_1 = require("./masquerain");
const medicham_1 = require("./medicham");
const medicham_2_1 = require("./medicham-2");
const meditite_1 = require("./meditite");
const milotic_1 = require("./milotic");
const mr_mime_1 = require("./mr-mime");
const mudkip_1 = require("./mudkip");
const nidoqueen_1 = require("./nidoqueen");
const nidoqueen_2_1 = require("./nidoqueen-2");
const nidoran_f_1 = require("./nidoran-f");
const nidorina_1 = require("./nidorina");
const ninetales_1 = require("./ninetales");
const nosepass_1 = require("./nosepass");
const primal_groudon_ex_1 = require("./primal-groudon-ex");
const primal_kyogre_ex_1 = require("./primal-kyogre-ex");
const probopass_1 = require("./probopass");
const rhydon_1 = require("./rhydon");
const rhyhorn_1 = require("./rhyhorn");
const rhyperior_1 = require("./rhyperior");
const rhyperior_2_1 = require("./rhyperior-2");
const sceptile_1 = require("./sceptile");
const sceptile_2_1 = require("./sceptile-2");
const seadra_1 = require("./seadra");
const sealeo_1 = require("./sealeo");
const sharpedo_ex_1 = require("./sharpedo-ex");
const shroomish_1 = require("./shroomish");
const skitty_1 = require("./skitty");
const slugma_1 = require("./slugma");
const solrock_1 = require("./solrock");
const spheal_1 = require("./spheal");
const spheal_2_1 = require("./spheal-2");
const spinda_1 = require("./spinda");
const starmie_1 = require("./starmie");
const staryu_1 = require("./staryu");
const surskit_1 = require("./surskit");
const swampert_1 = require("./swampert");
const swampert_2_1 = require("./swampert-2");
const tangela_1 = require("./tangela");
const tangrowth_1 = require("./tangrowth");
const tentacool_1 = require("./tentacool");
const tentacool_2_1 = require("./tentacool-2");
const tentacruel_1 = require("./tentacruel");
const torchic_1 = require("./torchic");
const torchic_2_1 = require("./torchic-2");
const trapinch_1 = require("./trapinch");
const treecko_1 = require("./treecko");
const trevenant_ex_1 = require("./trevenant-ex");
const tynamo_1 = require("./tynamo");
const vibrava_1 = require("./vibrava");
const volbeat_1 = require("./volbeat");
const vulpix_1 = require("./vulpix");
const wailord_ex_1 = require("./wailord-ex");
const walrein_1 = require("./walrein");
const weedle_1 = require("./weedle");
const whiscash_1 = require("./whiscash");
const whiscash_2_1 = require("./whiscash-2");
const zigzagoon_1 = require("./zigzagoon");
const acro_bike_1 = require("./acro-bike");
const aggron_spirit_link_1 = require("./aggron-spirit-link");
const archies_ace_in_the_hole_1 = require("./archies-ace-in-the-hole");
const dive_ball_1 = require("./dive-ball");
const fresh_water_set_1 = require("./fresh-water-set");
const gardevoir_spirit_link_1 = require("./gardevoir-spirit-link");
const groudon_spirit_link_1 = require("./groudon-spirit-link");
const kyogre_spirit_link_1 = require("./kyogre-spirit-link");
const maxies_hidden_ball_trick_1 = require("./maxies-hidden-ball-trick");
const professor_birchs_observations_1 = require("./professor-birchs-observations");
const repeat_ball_1 = require("./repeat-ball");
const rough_seas_1 = require("./rough-seas");
const scorched_earth_1 = require("./scorched-earth");
const shrine_of_memories_1 = require("./shrine-of-memories");
const silent_lab_1 = require("./silent-lab");
const teammates_1 = require("./teammates");
const weakness_policy_1 = require("./weakness-policy");
const shield_energy_1 = require("./shield-energy");
const wonder_energy_1 = require("./wonder-energy");
const other_prints_1 = require("./other-prints");
exports.setPrimalClash = [
    // Pokemon
    new aegislash_1.Aegislash(),
    new aggron_ex_1.AggronEx(),
    new azumarill_1.Azumarill(),
    new azumarill_2_1.Azumarill2(),
    new barboach_1.Barboach(),
    new beedrill_1.Beedrill(),
    new bibarel_1.Bibarel(),
    new bidoof_1.Bidoof(),
    new bidoof_2_1.Bidoof2(),
    new blaziken_1.Blaziken(),
    new bouffalant_1.Bouffalant(),
    new breloom_1.Breloom(),
    new bunnelby_1.Bunnelby(),
    new camerupt_ex_1.CameruptEx(),
    new chinchou_1.Chinchou(),
    new clamperl_1.Clamperl(),
    new combusken_1.Combusken(),
    new corphish_1.Corphish(),
    new crawdaunt_1.Crawdaunt(),
    new delcatty_1.Delcatty(),
    new diggersby_1.Diggersby(),
    new doublade_1.Doublade(),
    new drilbur_1.Drilbur(),
    new eelektrik_1.Eelektrik(),
    new eelektrik_2_1.Eelektrik2(),
    new eelektross_1.Eelektross(),
    new electrike_1.Electrike(),
    new electrike_2_1.Electrike2(),
    new excadrill_1.Excadrill(),
    new excadrill_2_1.Excadrill2(),
    new feebas_1.Feebas(),
    new flygon_1.Flygon(),
    new gardevoir_ex_1.GardevoirEx(),
    new gorebyss_1.Gorebyss(),
    new gorebyss_2_1.Gorebyss2(),
    new groudon_1.Groudon(),
    new groudon_ex_1.GroudonEx(),
    new grovyle_1.Grovyle(),
    new hippopotas_1.Hippopotas(),
    new hippowdon_1.Hippowdon(),
    new honedge_1.Honedge(),
    new horsea_1.Horsea(),
    new huntail_1.Huntail(),
    new illumise_1.Illumise(),
    new kakuna_1.Kakuna(),
    new kingdra_1.Kingdra(),
    new kingdra_2_1.Kingdra2(),
    new kyogre_1.Kyogre(),
    new kyogre_ex_1.KyogreEx(),
    new lanturn_1.Lanturn(),
    new linoone_1.Linoone(),
    new lombre_1.Lombre(),
    new lotad_1.Lotad(),
    new ludicolo_1.Ludicolo(),
    new ludicolo_2_1.Ludicolo2(),
    new m_aggron_ex_1.MAggronEx(),
    new m_gardevoir_ex_1.MGardevoirEx(),
    new magcargo_1.Magcargo(),
    new magcargo_2_1.Magcargo2(),
    new manaphy_1.Manaphy(),
    new manectric_1.Manectric(),
    new marill_1.Marill(),
    new marshtomp_1.Marshtomp(),
    new masquerain_1.Masquerain(),
    new medicham_1.Medicham(),
    new medicham_2_1.Medicham2(),
    new meditite_1.Meditite(),
    new milotic_1.Milotic(),
    new mr_mime_1.MrMime(),
    new mudkip_1.Mudkip(),
    new nidoqueen_1.Nidoqueen(),
    new nidoqueen_2_1.Nidoqueen2(),
    new nidoran_f_1.NidoranF(),
    new nidorina_1.Nidorina(),
    new ninetales_1.Ninetales(),
    new nosepass_1.Nosepass(),
    new primal_groudon_ex_1.PrimalGroudonEx(),
    new primal_kyogre_ex_1.PrimalKyogreEx(),
    new probopass_1.Probopass(),
    new rhydon_1.Rhydon(),
    new rhyhorn_1.Rhyhorn(),
    new rhyperior_1.Rhyperior(),
    new rhyperior_2_1.Rhyperior2(),
    new sceptile_1.Sceptile(),
    new sceptile_2_1.Sceptile2(),
    new seadra_1.Seadra(),
    new sealeo_1.Sealeo(),
    new sharpedo_ex_1.SharpedoEx(),
    new shroomish_1.Shroomish(),
    new skitty_1.Skitty(),
    new slugma_1.Slugma(),
    new solrock_1.Solrock(),
    new spheal_1.Spheal(),
    new spheal_2_1.Spheal2(),
    new spinda_1.Spinda(),
    new starmie_1.Starmie(),
    new staryu_1.Staryu(),
    new surskit_1.Surskit(),
    new swampert_1.Swampert(),
    new swampert_2_1.Swampert2(),
    new tangela_1.Tangela(),
    new tangrowth_1.Tangrowth(),
    new tentacool_1.Tentacool(),
    new tentacool_2_1.Tentacool2(),
    new tentacruel_1.Tentacruel(),
    new torchic_1.Torchic(),
    new torchic_2_1.Torchic2(),
    new trapinch_1.Trapinch(),
    new treecko_1.Treecko(),
    new trevenant_ex_1.TrevenantEx(),
    new tynamo_1.Tynamo(),
    new vibrava_1.Vibrava(),
    new volbeat_1.Volbeat(),
    new vulpix_1.Vulpix(),
    new wailord_ex_1.WailordEx(),
    new walrein_1.Walrein(),
    new weedle_1.Weedle(),
    new whiscash_1.Whiscash(),
    new whiscash_2_1.Whiscash2(),
    new zigzagoon_1.Zigzagoon(),
    // Trainers
    new acro_bike_1.AcroBike(),
    new aggron_spirit_link_1.AggronSpiritLink(),
    new archies_ace_in_the_hole_1.ArchiesAceInTheHole(),
    new dive_ball_1.DiveBall(),
    new fresh_water_set_1.FreshWaterSet(),
    new gardevoir_spirit_link_1.GardevoirSpiritLink(),
    new groudon_spirit_link_1.GroudonSpiritLink(),
    new kyogre_spirit_link_1.KyogreSpiritLink(),
    new maxies_hidden_ball_trick_1.MaxiesHiddenBallTrick(),
    new professor_birchs_observations_1.ProfessorBirchsObservations(),
    new repeat_ball_1.RepeatBall(),
    new rough_seas_1.RoughSeas(),
    new scorched_earth_1.ScorchedEarth(),
    new shrine_of_memories_1.ShrineOfMemories(),
    new silent_lab_1.SilentLab(),
    new teammates_1.Teammates(),
    new weakness_policy_1.WeaknessPolicy(),
    // Energy
    new shield_energy_1.ShieldEnergy(),
    new wonder_energy_1.WonderEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.EnergyRetrievalPRC(),
    new other_prints_1.EscapeRopeBUSPRC(),
    new other_prints_1.ExpSharePRC(),
    new other_prints_1.RareCandyPRC(),
    new other_prints_1.WailordEx2PRC(),
    new other_prints_1.GroudonEx2PRC(),
    new other_prints_1.PrimalGroudonEx2PRC(),
    new other_prints_1.GardevoirEx2PRC(),
    new other_prints_1.MGardevoirEx2PRC(),
    new other_prints_1.ArchiesAceInTheHole2PRC(),
    new other_prints_1.MaxiesHiddenBallTrick2PRC(),
    new other_prints_1.Teammates2PRC(),
    new other_prints_1.DiveBall2PRC(),
    new other_prints_1.EnhancedHammerPRC(),
    new other_prints_1.SwitchPRC(),
    new other_prints_1.WeaknessPolicy2PRC(),
    new other_prints_1.TrevenantEx2(),
    new other_prints_1.CameruptEx2(),
    new other_prints_1.KyogreEx2(),
    new other_prints_1.PrimalKyogreEx2(),
    new other_prints_1.SharpedoEx2(),
    new other_prints_1.AggronEx2(),
    new other_prints_1.MAggronEx2(),
    new other_prints_1.ProfessorBirchsObservations2(),
];

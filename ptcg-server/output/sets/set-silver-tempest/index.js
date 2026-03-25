"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSilverTempest = void 0;
const alolan_vulpix_v_1 = require("./alolan-vulpix-v");
const alolan_vulpix_vstar_1 = require("./alolan-vulpix-vstar");
const altaria_1 = require("./altaria");
const amoonguss_1 = require("./amoonguss");
const anorith_1 = require("./anorith");
const araquanid_1 = require("./araquanid");
const arcanine_1 = require("./arcanine");
const archen_1 = require("./archen");
const archeops_1 = require("./archeops");
const ariados_1 = require("./ariados");
const armaldo_1 = require("./armaldo");
const articuno_1 = require("./articuno");
const baltoy_1 = require("./baltoy");
const beheeyem_1 = require("./beheeyem");
const beldum_1 = require("./beldum");
const braixen_1 = require("./braixen");
const buneary_1 = require("./buneary");
const chesnaught_v_1 = require("./chesnaught-v");
const chimecho_1 = require("./chimecho");
const chinchou_1 = require("./chinchou");
const claydol_1 = require("./claydol");
const cobalion_1 = require("./cobalion");
const croagunk_1 = require("./croagunk");
const crobat_1 = require("./crobat");
const dedenne_1 = require("./dedenne");
const delphox_1 = require("./delphox");
const dewpider_1 = require("./dewpider");
const donphan_1 = require("./donphan");
const dragapult_1 = require("./dragapult");
const dragonair_1 = require("./dragonair");
const dragonite_1 = require("./dragonite");
const drakloak_1 = require("./drakloak");
const dratini_1 = require("./dratini");
const dreepy_1 = require("./dreepy");
const drowzee_1 = require("./drowzee");
const duosion_1 = require("./duosion");
const durant_1 = require("./durant");
const elgyem_1 = require("./elgyem");
const emolga_1 = require("./emolga");
const espurr_1 = require("./espurr");
const feebas_1 = require("./feebas");
const fennekin_1 = require("./fennekin");
const ferroseed_1 = require("./ferroseed");
const ferrothorn_1 = require("./ferrothorn");
const fletchinder_1 = require("./fletchinder");
const foongus_1 = require("./foongus");
const froslass_1 = require("./froslass");
const gardevoir_1 = require("./gardevoir");
const glalie_1 = require("./glalie");
const golbat_1 = require("./golbat");
const growlithe_1 = require("./growlithe");
const hawlucha_1 = require("./hawlucha");
const hisuian_arcanine_v_1 = require("./hisuian-arcanine-v");
const hisuian_braviary_1 = require("./hisuian-braviary");
const hisuian_lilligant_1 = require("./hisuian-lilligant");
const ho_oh_v_1 = require("./ho-oh-v");
const honchkrow_1 = require("./honchkrow");
const hypno_1 = require("./hypno");
const incineroar_1 = require("./incineroar");
const indeedee_1 = require("./indeedee");
const jynx_1 = require("./jynx");
const keldeo_1 = require("./keldeo");
const kirlia_1 = require("./kirlia");
const klang_1 = require("./klang");
const klink_1 = require("./klink");
const klinklang_1 = require("./klinklang");
const krokorok_1 = require("./krokorok");
const krookodile_1 = require("./krookodile");
const lanturn_1 = require("./lanturn");
const litten_1 = require("./litten");
const lopunny_1 = require("./lopunny");
const lugia_v_1 = require("./lugia-v");
const lugia_vstar_1 = require("./lugia-vstar");
const magearna_v_1 = require("./magearna-v");
const mawile_v_1 = require("./mawile-v");
const mawile_vstar_1 = require("./mawile-vstar");
const medicham_1 = require("./medicham");
const meditite_1 = require("./meditite");
const meowstic_1 = require("./meowstic");
const metagross_1 = require("./metagross");
const milotic_1 = require("./milotic");
const misdreavus_1 = require("./misdreavus");
const mismagius_1 = require("./mismagius");
const morpeko_1 = require("./morpeko");
const murkrow_1 = require("./murkrow");
const ninetales_1 = require("./ninetales");
const noibat_1 = require("./noibat");
const noivern_1 = require("./noivern");
const omastar_v_1 = require("./omastar-v");
const palossand_1 = require("./palossand");
const petilil_1 = require("./petilil");
const phanpy_1 = require("./phanpy");
const phione_1 = require("./phione");
const pikachu_1 = require("./pikachu");
const ponyta_1 = require("./ponyta");
const radiant_alakazam_1 = require("./radiant-alakazam");
const radiant_jirachi_1 = require("./radiant-jirachi");
const radiant_tsareena_1 = require("./radiant-tsareena");
const raichu_1 = require("./raichu");
const ralts_1 = require("./ralts");
const rapidash_1 = require("./rapidash");
const regidrago_v_1 = require("./regidrago-v");
const regidrago_vstar_1 = require("./regidrago-vstar");
const regieleki_v_1 = require("./regieleki-v");
const regieleki_vmax_1 = require("./regieleki-vmax");
const relicanth_1 = require("./relicanth");
const reshiram_v_1 = require("./reshiram-v");
const reuniclus_1 = require("./reuniclus");
const rotom_1 = require("./rotom");
const rufflet_1 = require("./rufflet");
const sandygast_1 = require("./sandygast");
const serperior_v_1 = require("./serperior-v");
const serperior_vstar_1 = require("./serperior-vstar");
const sigilyph_1 = require("./sigilyph");
const skuntank_v_1 = require("./skuntank-v");
const slurpuff_1 = require("./slurpuff");
const smeargle_1 = require("./smeargle");
const snorunt_1 = require("./snorunt");
const solosis_1 = require("./solosis");
const spinarak_1 = require("./spinarak");
const spinda_1 = require("./spinda");
const stonjourner_1 = require("./stonjourner");
const stunfisk_1 = require("./stunfisk");
const sunflora_1 = require("./sunflora");
const sunkern_1 = require("./sunkern");
const swablu_1 = require("./swablu");
const swirlix_1 = require("./swirlix");
const talonflame_1 = require("./talonflame");
const terrakion_1 = require("./terrakion");
const togedemaru_1 = require("./togedemaru");
const torracat_1 = require("./torracat");
const toxapex_1 = require("./toxapex");
const toxicroak_1 = require("./toxicroak");
const unown_v_1 = require("./unown-v");
const unown_vstar_1 = require("./unown-vstar");
const ursaluna_v_1 = require("./ursaluna-v");
const venomoth_1 = require("./venomoth");
const venonat_1 = require("./venonat");
const victini_1 = require("./victini");
const virizion_1 = require("./virizion");
const vulpix_1 = require("./vulpix");
const wailmer_1 = require("./wailmer");
const wailord_1 = require("./wailord");
const zeraora_1 = require("./zeraora");
const zubat_1 = require("./zubat");
const zygarde_1 = require("./zygarde");
const brandon_1 = require("./brandon");
const candice_1 = require("./candice");
const capturing_aroma_1 = require("./capturing-aroma");
const earthen_seal_stone_1 = require("./earthen-seal-stone");
const emergency_jelly_1 = require("./emergency-jelly");
const forest_seal_stone_1 = require("./forest-seal-stone");
const furisode_girl_1 = require("./furisode-girl");
const lance_1 = require("./lance");
const leafy_camo_poncho_1 = require("./leafy-camo-poncho");
const primordial_altar_1 = require("./primordial-altar");
const professor_laventon_1 = require("./professor-laventon");
const quad_stone_1 = require("./quad-stone");
const serena_1 = require("./serena");
const unidentified_fossil_1 = require("./unidentified-fossil");
const wallace_1 = require("./wallace");
const worker_1 = require("./worker");
const regenerative_energy_1 = require("./regenerative-energy");
const v_guard_energy_1 = require("./v-guard-energy");
const other_prints_1 = require("./other-prints");
exports.setSilverTempest = [
    // Pokemon
    new alolan_vulpix_v_1.AlolanVulpixV(),
    new alolan_vulpix_vstar_1.AlolanVulpixVSTAR(),
    new altaria_1.Altaria(),
    new amoonguss_1.Amoonguss(),
    new anorith_1.Anorith(),
    new araquanid_1.Araquanid(),
    new arcanine_1.Arcanine(),
    new archen_1.Archen(),
    new archeops_1.Archeops(),
    new ariados_1.Ariados(),
    new armaldo_1.Armaldo(),
    new articuno_1.Articuno(),
    new baltoy_1.Baltoy(),
    new beheeyem_1.Beheeyem(),
    new beldum_1.Beldum(),
    new braixen_1.Braixen(),
    new buneary_1.Buneary(),
    new chesnaught_v_1.ChesnaughtV(),
    new chimecho_1.Chimecho(),
    new chinchou_1.Chinchou(),
    new claydol_1.Claydol(),
    new cobalion_1.Cobalion(),
    new croagunk_1.Croagunk(),
    new crobat_1.Crobat(),
    new dedenne_1.Dedenne(),
    new delphox_1.Delphox(),
    new dewpider_1.Dewpider(),
    new donphan_1.Donphan(),
    new dragapult_1.Dragapult(),
    new dragonair_1.Dragonair(),
    new dragonite_1.Dragonite(),
    new drakloak_1.Drakloak(),
    new dratini_1.Dratini(),
    new dreepy_1.Dreepy(),
    new drowzee_1.Drowzee(),
    new duosion_1.Duosion(),
    new durant_1.Durant(),
    new elgyem_1.Elgyem(),
    new emolga_1.Emolga(),
    new espurr_1.Espurr(),
    new feebas_1.Feebas(),
    new fennekin_1.Fennekin(),
    new ferroseed_1.Ferroseed(),
    new ferrothorn_1.Ferrothorn(),
    new fletchinder_1.Fletchinder(),
    new foongus_1.Foongus(),
    new froslass_1.Froslass(),
    new gardevoir_1.Gardevoir(),
    new glalie_1.Glalie(),
    new golbat_1.Golbat(),
    new growlithe_1.Growlithe(),
    new hawlucha_1.Hawlucha(),
    new hisuian_arcanine_v_1.HisuianArcanineV(),
    new hisuian_braviary_1.HisuianBraviary(),
    new hisuian_lilligant_1.HisuianLilligant(),
    new ho_oh_v_1.HoOhV(),
    new honchkrow_1.Honchkrow(),
    new hypno_1.Hypno(),
    new incineroar_1.Incineroar(),
    new indeedee_1.Indeedee(),
    new jynx_1.Jynx(),
    new keldeo_1.Keldeo(),
    new kirlia_1.Kirlia(),
    new klang_1.Klang(),
    new klink_1.Klink(),
    new klinklang_1.Klinklang(),
    new krokorok_1.Krokorok(),
    new krookodile_1.Krookodile(),
    new lanturn_1.Lanturn(),
    new litten_1.Litten(),
    new lopunny_1.Lopunny(),
    new lugia_v_1.LugiaV(),
    new lugia_vstar_1.LugiaVSTAR(),
    new magearna_v_1.MagearnaV(),
    new mawile_v_1.MawileV(),
    new mawile_vstar_1.MawileVstar(),
    new medicham_1.Medicham(),
    new meditite_1.Meditite(),
    new meowstic_1.Meowstic(),
    new metagross_1.Metagross(),
    new milotic_1.Milotic(),
    new misdreavus_1.Misdreavus(),
    new mismagius_1.Mismagius(),
    new morpeko_1.Morpeko(),
    new murkrow_1.Murkrow(),
    new ninetales_1.Ninetales(),
    new noibat_1.Noibat(),
    new noivern_1.Noivern(),
    new omastar_v_1.OmastarV(),
    new palossand_1.Palossand(),
    new petilil_1.Petilil(),
    new phanpy_1.Phanpy(),
    new phione_1.Phione(),
    new pikachu_1.Pikachu(),
    new ponyta_1.Ponyta(),
    new radiant_alakazam_1.RadiantAlakazam(),
    new radiant_jirachi_1.RadiantJirachi(),
    new radiant_tsareena_1.RadiantTsareena(),
    new raichu_1.Raichu(),
    new ralts_1.Ralts(),
    new rapidash_1.Rapidash(),
    new regidrago_v_1.RegidragoV(),
    new regidrago_vstar_1.RegidragoVSTAR(),
    new regieleki_v_1.RegielekiV(),
    new regieleki_vmax_1.RegielekiVMAX(),
    new relicanth_1.Relicanth(),
    new reshiram_v_1.ReshiramV(),
    new reuniclus_1.Reuniclus(),
    new rotom_1.Rotom(),
    new rufflet_1.Rufflet(),
    new sandygast_1.Sandygast(),
    new serperior_v_1.SerperiorV(),
    new serperior_vstar_1.SerperiorVSTAR(),
    new sigilyph_1.Sigilyph(),
    new skuntank_v_1.SkuntankV(),
    new slurpuff_1.Slurpuff(),
    new smeargle_1.Smeargle(),
    new snorunt_1.Snorunt(),
    new solosis_1.Solosis(),
    new spinarak_1.Spinarak(),
    new spinda_1.Spinda(),
    new stonjourner_1.Stonjourner(),
    new stunfisk_1.Stunfisk(),
    new sunflora_1.Sunflora(),
    new sunkern_1.Sunkern(),
    new swablu_1.Swablu(),
    new swirlix_1.Swirlix(),
    new talonflame_1.Talonflame(),
    new terrakion_1.Terrakion(),
    new togedemaru_1.Togedemaru(),
    new torracat_1.Torracat(),
    new toxapex_1.Toxapex(),
    new toxicroak_1.Toxicroak(),
    new unown_v_1.UnownV(),
    new unown_vstar_1.UnownVSTAR(),
    new ursaluna_v_1.UrsalunaV(),
    new venomoth_1.Venomoth(),
    new venonat_1.Venonat(),
    new victini_1.Victini(),
    new virizion_1.Virizion(),
    new vulpix_1.Vulpix(),
    new wailmer_1.Wailmer(),
    new wailord_1.Wailord(),
    new zeraora_1.Zeraora(),
    new zubat_1.Zubat(),
    new zygarde_1.Zygarde(),
    // Trainers
    new brandon_1.Brandon(),
    new candice_1.Candice(),
    new capturing_aroma_1.CapturingAroma(),
    new earthen_seal_stone_1.EarthenSealStone(),
    new emergency_jelly_1.EmergencyJelly(),
    new forest_seal_stone_1.ForestSealStone(),
    new furisode_girl_1.FurisodeGirl(),
    new lance_1.Lance(),
    new leafy_camo_poncho_1.LeafyCamoPoncho(),
    new primordial_altar_1.PrimordialAltar(),
    new professor_laventon_1.ProfessorLaventon(),
    new quad_stone_1.QuadStone(),
    new serena_1.Serena(),
    new unidentified_fossil_1.UnidentifiedFossil(),
    new wallace_1.Wallace(),
    new worker_1.Worker(),
    // Energy
    new regenerative_energy_1.RegenerativeEnergy(),
    new v_guard_energy_1.VGuardEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.SerperiorV2SIT(),
    new other_prints_1.AlolanVulpixV2SIT(),
    new other_prints_1.RegielekiV2SIT(),
    new other_prints_1.UnownV2SIT(),
    new other_prints_1.UnownV3SIT(),
    new other_prints_1.MagearnaV2SIT(),
    new other_prints_1.RegidragoV2SIT(),
    new other_prints_1.RegidragoV3SIT(),
    new other_prints_1.LugiaV2SIT(),
    new other_prints_1.LugiaV3SIT(),
    new other_prints_1.Candice2SIT(),
    new other_prints_1.FurisodeGirl2SIT(),
    new other_prints_1.Lance2SIT(),
    new other_prints_1.Serena2SIT(),
    new other_prints_1.Worker2SIT(),
    new other_prints_1.SerperiorVSTAR2SIT(),
    new other_prints_1.AlolanVulpixVSTAR2SIT(),
    new other_prints_1.RegielekiVMAX2SIT(),
    new other_prints_1.UnownVSTAR2SIT(),
    new other_prints_1.RegidragoVSTAR2SIT(),
    new other_prints_1.LugiaVSTAR2SIT(),
    new other_prints_1.Candice3SIT(),
    new other_prints_1.FurisodeGirl3SIT(),
    new other_prints_1.Lance3SIT(),
    new other_prints_1.Serena3SIT(),
    new other_prints_1.Worker3SIT(),
    new other_prints_1.SerperiorVSTAR3SIT(),
    new other_prints_1.LugiaVSTAR3SIT(),
    new other_prints_1.EnergySwitchPKSIT(),
    new other_prints_1.GapejawBogSIT(),
    new other_prints_1.LeafyCamoPoncho2SIT(),
    new other_prints_1.VGuardEnergy2SIT(),
    new other_prints_1.Braixen2SIT(),
    new other_prints_1.FlaaffySIT(),
    new other_prints_1.Gardevoir2SIT(),
    new other_prints_1.DruddigonSIT(),
    new other_prints_1.KricketuneVSIT(),
    new other_prints_1.SerperiorV3SIT(),
    new other_prints_1.BlazikenVSIT(),
    new other_prints_1.BlazikenVMAXSIT(),
    new other_prints_1.RayquazaVMAXSIT(),
    new other_prints_1.DuraludonVMAXSIT(),
    new other_prints_1.BlisseyVSIT(),
    new other_prints_1.JudgeULSIT(),
    new other_prints_1.RaihanSIT(),
    new other_prints_1.RayquazaVMAX2SIT(),
    new other_prints_1.DuraludonVMAX2SIT(),
    new other_prints_1.SandileSIT(),
    new other_prints_1.MareanieSIT(),
    new other_prints_1.MetangSIT(),
    new other_prints_1.FletchlingSIT(),
    new other_prints_1.GymTrainerSIT(),
    new other_prints_1.ChesnaughtV2(),
    new other_prints_1.ReshiramV2(),
    new other_prints_1.OmastarV2(),
    new other_prints_1.MawileV2(),
    new other_prints_1.HisuianArcanineV2(),
    new other_prints_1.SkuntankV2(),
    new other_prints_1.SkuntankV3(),
    new other_prints_1.HoOhV2(),
    new other_prints_1.Brandon2(),
    new other_prints_1.GymTrainer2(),
    new other_prints_1.Wallace2(),
    new other_prints_1.MawileVstar2(),
    new other_prints_1.Brandon3(),
    new other_prints_1.Wallace3(),
];

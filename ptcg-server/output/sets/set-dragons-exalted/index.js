"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDragonsExalted = void 0;
const aggron_1 = require("./aggron");
const aipom_1 = require("./aipom");
const alomomola_1 = require("./alomomola");
const altaria_1 = require("./altaria");
const ambipom_1 = require("./ambipom");
const ampharos_1 = require("./ampharos");
const aron_1 = require("./aron");
const audino_1 = require("./audino");
const baltoy_1 = require("./baltoy");
const beautifly_1 = require("./beautifly");
const bibarel_1 = require("./bibarel");
const bidoof_1 = require("./bidoof");
const boldore_1 = require("./boldore");
const bouffalant_1 = require("./bouffalant");
const braviary_1 = require("./braviary");
const buizel_1 = require("./buizel");
const cascoon_1 = require("./cascoon");
const claydol_1 = require("./claydol");
const cubone_1 = require("./cubone");
const deino_1 = require("./deino");
const deino_2_1 = require("./deino-2");
const drifblim_1 = require("./drifblim");
const drifloon_1 = require("./drifloon");
const drifloon_2_1 = require("./drifloon-2");
const durant_1 = require("./durant");
const dustox_1 = require("./dustox");
const electrike_1 = require("./electrike");
const electrike_2_1 = require("./electrike-2");
const emolga_1 = require("./emolga");
const feebas_1 = require("./feebas");
const flaaffy_1 = require("./flaaffy");
const floatzel_1 = require("./floatzel");
const foongus_1 = require("./foongus");
const gabite_1 = require("./gabite");
const gabite_2_1 = require("./gabite-2");
const garbodor_1 = require("./garbodor");
const garchomp_2_1 = require("./garchomp-2");
const gible_1 = require("./gible");
const gible_2_1 = require("./gible-2");
const gigalith_1 = require("./gigalith");
const giratina_ex_1 = require("./giratina-ex");
const golett_1 = require("./golett");
const gothita_1 = require("./gothita");
const gothitelle_1 = require("./gothitelle");
const gothorita_1 = require("./gothorita");
const gyarados_1 = require("./gyarados");
const ho_oh_ex_1 = require("./ho-oh-ex");
const honchkrow_1 = require("./honchkrow");
const hoppip_1 = require("./hoppip");
const houndoom_1 = require("./houndoom");
const houndour_1 = require("./houndour");
const hydreigon_1 = require("./hydreigon");
const hydreigon_2_1 = require("./hydreigon-2");
const jumpluff_1 = require("./jumpluff");
const lairon_1 = require("./lairon");
const magikarp_1 = require("./magikarp");
const magmar_1 = require("./magmar");
const magmortar_1 = require("./magmortar");
const manectric_1 = require("./manectric");
const manectric_2_1 = require("./manectric-2");
const maractus_1 = require("./maractus");
const mareep_1 = require("./mareep");
const marowak_1 = require("./marowak");
const milotic_1 = require("./milotic");
const minccino_1 = require("./minccino");
const murkrow_1 = require("./murkrow");
const nincada_1 = require("./nincada");
const ninetales_1 = require("./ninetales");
const ninjask_1 = require("./ninjask");
const nosepass_1 = require("./nosepass");
const palpitoad_1 = require("./palpitoad");
const probopass_1 = require("./probopass");
const rayquaza_ex_1 = require("./rayquaza-ex");
const registeel_ex_1 = require("./registeel-ex");
const registeel_ex_2_1 = require("./registeel-ex-2");
const roggenrola_1 = require("./roggenrola");
const roselia_1 = require("./roselia");
const roselia_2_1 = require("./roselia-2");
const roserade_1 = require("./roserade");
const roserade_2_1 = require("./roserade-2");
const rufflet_1 = require("./rufflet");
const sawk_1 = require("./sawk");
const sealeo_1 = require("./sealeo");
const seismitoad_1 = require("./seismitoad");
const serperior_1 = require("./serperior");
const shedinja_1 = require("./shedinja");
const sigilyph_1 = require("./sigilyph");
const silcoon_1 = require("./silcoon");
const skiploom_1 = require("./skiploom");
const skuntank_1 = require("./skuntank");
const slaking_1 = require("./slaking");
const slakoth_1 = require("./slakoth");
const spheal_1 = require("./spheal");
const stunky_1 = require("./stunky");
const swablu_1 = require("./swablu");
const swablu_2_1 = require("./swablu-2");
const terrakion_ex_1 = require("./terrakion-ex");
const throh_1 = require("./throh");
const tympole_1 = require("./tympole");
const vigoroth_1 = require("./vigoroth");
const vulpix_1 = require("./vulpix");
const wailmer_1 = require("./wailmer");
const wailord_1 = require("./wailord");
const walrein_1 = require("./walrein");
const wurmple_1 = require("./wurmple");
const yanma_1 = require("./yanma");
const yanmega_1 = require("./yanmega");
const zweilous_1 = require("./zweilous");
const zweilous_2_1 = require("./zweilous-2");
const devolution_spray_1 = require("./devolution-spray");
const giant_cape_1 = require("./giant-cape");
const rescue_scarf_1 = require("./rescue-scarf");
const tool_scrapper_1 = require("./tool-scrapper");
const blend_energy_grpd_1 = require("./blend-energy-grpd");
const blend_energy_wlfm_1 = require("./blend-energy-wlfm");
const other_prints_1 = require("./other-prints");
exports.setDragonsExalted = [
    // Pokemon
    new aggron_1.Aggron(),
    new aipom_1.Aipom(),
    new alomomola_1.Alomomola(),
    new altaria_1.Altaria(),
    new ambipom_1.Ambipom(),
    new ampharos_1.Ampharos(),
    new aron_1.Aron(),
    new audino_1.Audino(),
    new baltoy_1.Baltoy(),
    new beautifly_1.Beautifly(),
    new bibarel_1.Bibarel(),
    new bidoof_1.Bidoof(),
    new boldore_1.Boldore(),
    new bouffalant_1.Bouffalant(),
    new braviary_1.Braviary(),
    new buizel_1.Buizel(),
    new cascoon_1.Cascoon(),
    new claydol_1.Claydol(),
    new cubone_1.Cubone(),
    new deino_1.Deino(),
    new deino_2_1.Deino2(),
    new drifblim_1.Drifblim(),
    new drifloon_1.Drifloon(),
    new drifloon_2_1.Drifloon2(),
    new durant_1.Durant(),
    new dustox_1.Dustox(),
    new electrike_1.Electrike(),
    new electrike_2_1.Electrike2(),
    new emolga_1.Emolga(),
    new feebas_1.Feebas(),
    new flaaffy_1.Flaaffy(),
    new floatzel_1.Floatzel(),
    new foongus_1.Foongus(),
    new gabite_1.Gabite(),
    new gabite_2_1.Gabite2(),
    new garbodor_1.Garbodor(),
    new garchomp_2_1.Garchomp2(),
    new gible_1.Gible(),
    new gible_2_1.Gible2(),
    new gigalith_1.Gigalith(),
    new giratina_ex_1.GiratinaEx(),
    new golett_1.Golett(),
    new gothita_1.Gothita(),
    new gothitelle_1.Gothitelle(),
    new gothorita_1.Gothorita(),
    new gyarados_1.Gyarados(),
    new ho_oh_ex_1.HoOhEx(),
    new honchkrow_1.Honchkrow(),
    new hoppip_1.Hoppip(),
    new houndoom_1.Houndoom(),
    new houndour_1.Houndour(),
    new hydreigon_1.Hydreigon(),
    new hydreigon_2_1.Hydreigon2(),
    new jumpluff_1.Jumpluff(),
    new lairon_1.Lairon(),
    new magikarp_1.Magikarp(),
    new magmar_1.Magmar(),
    new magmortar_1.Magmortar(),
    new manectric_1.Manectric(),
    new manectric_2_1.Manectric2(),
    new maractus_1.Maractus(),
    new mareep_1.Mareep(),
    new marowak_1.Marowak(),
    new milotic_1.Milotic(),
    new minccino_1.Minccino(),
    new murkrow_1.Murkrow(),
    new nincada_1.Nincada(),
    new ninetales_1.Ninetales(),
    new ninjask_1.Ninjask(),
    new nosepass_1.Nosepass(),
    new palpitoad_1.Palpitoad(),
    new probopass_1.Probopass(),
    new rayquaza_ex_1.RayquazaEx(),
    new registeel_ex_1.RegisteelEx(),
    new registeel_ex_2_1.RegisteelEx2(),
    new roggenrola_1.Roggenrola(),
    new roselia_1.Roselia(),
    new roselia_2_1.Roselia2(),
    new roserade_1.Roserade(),
    new roserade_2_1.Roserade2(),
    new rufflet_1.Rufflet(),
    new sawk_1.Sawk(),
    new sealeo_1.Sealeo(),
    new seismitoad_1.Seismitoad(),
    new serperior_1.Serperior(),
    new shedinja_1.Shedinja(),
    new sigilyph_1.Sigilyph(),
    new silcoon_1.Silcoon(),
    new skiploom_1.Skiploom(),
    new skuntank_1.Skuntank(),
    new slaking_1.Slaking(),
    new slakoth_1.Slakoth(),
    new spheal_1.Spheal(),
    new stunky_1.Stunky(),
    new swablu_1.Swablu(),
    new swablu_2_1.Swablu2(),
    new terrakion_ex_1.TerrakionEx(),
    new throh_1.Throh(),
    new tympole_1.Tympole(),
    new vigoroth_1.Vigoroth(),
    new vulpix_1.Vulpix(),
    new wailmer_1.Wailmer(),
    new wailord_1.Wailord(),
    new walrein_1.Walrein(),
    new wurmple_1.Wurmple(),
    new yanma_1.Yanma(),
    new yanmega_1.Yanmega(),
    new zweilous_1.Zweilous(),
    new zweilous_2_1.Zweilous2(),
    // Trainers
    new devolution_spray_1.DevolutionSpray(),
    new giant_cape_1.GiantCape(),
    new rescue_scarf_1.RescueScarf(),
    new tool_scrapper_1.ToolScrapper(),
    // Energy
    new blend_energy_grpd_1.BlendEnergyGRPD(),
    new blend_energy_wlfm_1.BlendEnergyWLFM(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.MewExDRX(),
    new other_prints_1.TrubbishDRX(),
    new other_prints_1.HoOhEx2DRX(),
    new other_prints_1.MewEx2DRX(),
    new other_prints_1.RayquazaEx2DRX(),
    new other_prints_1.ReuniclusDRX(),
    new other_prints_1.RayquazaDRX(),
    new other_prints_1.GolurkDRX(),
    new other_prints_1.StunfiskDRX(),
    new other_prints_1.GarchompDRX(),
    new other_prints_1.TerrakionEx2(),
    new other_prints_1.GiratinaEx2(),
    new other_prints_1.KrookodileDRX(),
];

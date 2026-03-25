"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBurningShadows = void 0;
const alolan_grimer_1 = require("./alolan-grimer");
const alolan_muk_gx_1 = require("./alolan-muk-gx");
const alolan_muk_gx_2_1 = require("./alolan-muk-gx-2");
const alolan_ninetales_1 = require("./alolan-ninetales");
const alolan_raticate_1 = require("./alolan-raticate");
const alolan_rattata_1 = require("./alolan-rattata");
const alolan_vulpix_1 = require("./alolan-vulpix");
const araquanid_1 = require("./araquanid");
const azumarill_1 = require("./azumarill");
const bewear_1 = require("./bewear");
const bouffalant_1 = require("./bouffalant");
const bruxish_1 = require("./bruxish");
const butterfree_1 = require("./butterfree");
const caterpie_1 = require("./caterpie");
const charizard_gx_1 = require("./charizard-gx");
const charmander_1 = require("./charmander");
const charmeleon_1 = require("./charmeleon");
const crabominable_1 = require("./crabominable");
const crabrawler_1 = require("./crabrawler");
const croagunk_1 = require("./croagunk");
const cutiefly_1 = require("./cutiefly");
const darkrai_1 = require("./darkrai");
const darkrai_gx_1 = require("./darkrai-gx");
const dewpider_1 = require("./dewpider");
const diancie_1 = require("./diancie");
const dusclops_1 = require("./dusclops");
const dusknoir_1 = require("./dusknoir");
const duskull_1 = require("./duskull");
const eelektrik_1 = require("./eelektrik");
const eelektross_1 = require("./eelektross");
const electabuzz_1 = require("./electabuzz");
const electivire_1 = require("./electivire");
const espurr_1 = require("./espurr");
const gardevoir_gx_1 = require("./gardevoir-gx");
const gloom_1 = require("./gloom");
const golisopod_gx_1 = require("./golisopod-gx");
const gyarados_1 = require("./gyarados");
const heatmor_1 = require("./heatmor");
const heracross_1 = require("./heracross");
const ho_oh_gx_1 = require("./ho-oh-gx");
const hoothoot_1 = require("./hoothoot");
const horsea_1 = require("./horsea");
const inkay_1 = require("./inkay");
const kingdra_1 = require("./kingdra");
const kirlia_1 = require("./kirlia");
const ledian_1 = require("./ledian");
const ledyba_1 = require("./ledyba");
const lucario_1 = require("./lucario");
const lunatone_1 = require("./lunatone");
const lycanroc_1 = require("./lycanroc");
const lycanroc_2_1 = require("./lycanroc-2");
const lycanroc_gx_1 = require("./lycanroc-gx");
const machamp_gx_1 = require("./machamp-gx");
const magikarp_1 = require("./magikarp");
const malamar_1 = require("./malamar");
const marill_1 = require("./marill");
const marshadow_gx_1 = require("./marshadow-gx");
const meowstic_1 = require("./meowstic");
const metapod_1 = require("./metapod");
const morelull_1 = require("./morelull");
const mudbray_1 = require("./mudbray");
const mudsdale_1 = require("./mudsdale");
const necrozma_gx_1 = require("./necrozma-gx");
const noctowl_1 = require("./noctowl");
const noibat_1 = require("./noibat");
const noivern_gx_1 = require("./noivern-gx");
const oddish_1 = require("./oddish");
const palossand_1 = require("./palossand");
const panpour_1 = require("./panpour");
const pansage_1 = require("./pansage");
const pansear_1 = require("./pansear");
const passimian_1 = require("./passimian");
const persian_1 = require("./persian");
const pikachu_1 = require("./pikachu");
const porygon_1 = require("./porygon");
const porygon_z_1 = require("./porygon-z");
const porygon2_1 = require("./porygon2");
const raichu_1 = require("./raichu");
const ralts_1 = require("./ralts");
const rhydon_1 = require("./rhydon");
const rhyhorn_1 = require("./rhyhorn");
const rhyperior_1 = require("./rhyperior");
const ribombee_1 = require("./ribombee");
const riolu_1 = require("./riolu");
const salazzle_gx_1 = require("./salazzle-gx");
const sandygast_1 = require("./sandygast");
const sawk_1 = require("./sawk");
const scolipede_1 = require("./scolipede");
const seadra_1 = require("./seadra");
const seviper_1 = require("./seviper");
const shiinotic_1 = require("./shiinotic");
const simipour_1 = require("./simipour");
const simisage_1 = require("./simisage");
const simisear_1 = require("./simisear");
const slowking_1 = require("./slowking");
const sneasel_1 = require("./sneasel");
const solrock_1 = require("./solrock");
const stufful_1 = require("./stufful");
const tangela_1 = require("./tangela");
const tangrowth_1 = require("./tangrowth");
const tapu_bulu_gx_1 = require("./tapu-bulu-gx");
const tapu_fini_gx_1 = require("./tapu-fini-gx");
const togedemaru_1 = require("./togedemaru");
const toxicroak_1 = require("./toxicroak");
const turtonator_1 = require("./turtonator");
const tynamo_1 = require("./tynamo");
const venipede_1 = require("./venipede");
const vileplume_1 = require("./vileplume");
const weavile_1 = require("./weavile");
const whirlipede_1 = require("./whirlipede");
const wimpod_1 = require("./wimpod");
const wobbuffet_1 = require("./wobbuffet");
const zygarde_1 = require("./zygarde");
const acerola_1 = require("./acerola");
const bodybuilding_dumbbells_1 = require("./bodybuilding-dumbbells");
const guzma_1 = require("./guzma");
const kiawe_1 = require("./kiawe");
const lana_1 = require("./lana");
const mount_lanakila_1 = require("./mount-lanakila");
const olivia_1 = require("./olivia");
const plumeria_1 = require("./plumeria");
const po_town_1 = require("./po-town");
const rotom_dex_poke_finder_mode_1 = require("./rotom-dex-poke-finder-mode");
const sophocles_1 = require("./sophocles");
const tormenting_spray_1 = require("./tormenting-spray");
const wicke_1 = require("./wicke");
const wishful_baton_1 = require("./wishful-baton");
const other_prints_1 = require("./other-prints");
exports.setBurningShadows = [
    // Pokemon
    new alolan_grimer_1.AlolanGrimer(),
    new alolan_muk_gx_1.AlolanMukGx(),
    new alolan_muk_gx_2_1.AlolanMukGx2(),
    new alolan_ninetales_1.AlolanNinetales(),
    new alolan_raticate_1.AlolanRaticate(),
    new alolan_rattata_1.AlolanRattata(),
    new alolan_vulpix_1.AlolanVulpix(),
    new araquanid_1.Araquanid(),
    new azumarill_1.Azumarill(),
    new bewear_1.Bewear(),
    new bouffalant_1.Bouffalant(),
    new bruxish_1.Bruxish(),
    new butterfree_1.Butterfree(),
    new caterpie_1.Caterpie(),
    new charizard_gx_1.CharizardGX(),
    new charmander_1.Charmander(),
    new charmeleon_1.Charmeleon(),
    new crabominable_1.Crabominable(),
    new crabrawler_1.Crabrawler(),
    new croagunk_1.Croagunk(),
    new cutiefly_1.Cutiefly(),
    new darkrai_1.Darkrai(),
    new darkrai_gx_1.DarkraiGX(),
    new dewpider_1.Dewpider(),
    new diancie_1.Diancie(),
    new dusclops_1.Dusclops(),
    new dusknoir_1.Dusknoir(),
    new duskull_1.Duskull(),
    new eelektrik_1.Eelektrik(),
    new eelektross_1.Eelektross(),
    new electabuzz_1.Electabuzz(),
    new electivire_1.Electivire(),
    new espurr_1.Espurr(),
    new gardevoir_gx_1.GardevoirGX(),
    new gloom_1.Gloom(),
    new golisopod_gx_1.GolisopodGx(),
    new gyarados_1.Gyarados(),
    new heatmor_1.Heatmor(),
    new heracross_1.Heracross(),
    new ho_oh_gx_1.HoOhGx(),
    new hoothoot_1.Hoothoot(),
    new horsea_1.Horsea(),
    new inkay_1.Inkay(),
    new kingdra_1.Kingdra(),
    new kirlia_1.Kirlia(),
    new ledian_1.Ledian(),
    new ledyba_1.Ledyba(),
    new lucario_1.Lucario(),
    new lunatone_1.Lunatone(),
    new lycanroc_1.Lycanroc(),
    new lycanroc_2_1.Lycanroc2(),
    new lycanroc_gx_1.LycanrocGx(),
    new machamp_gx_1.MachampGx(),
    new magikarp_1.Magikarp(),
    new malamar_1.Malamar(),
    new marill_1.Marill(),
    new marshadow_gx_1.MarshadowGX(),
    new meowstic_1.Meowstic(),
    new metapod_1.Metapod(),
    new morelull_1.Morelull(),
    new mudbray_1.Mudbray(),
    new mudsdale_1.Mudsdale(),
    new necrozma_gx_1.NecrozmaGX(),
    new noctowl_1.Noctowl(),
    new noibat_1.Noibat(),
    new noivern_gx_1.NoivernGX(),
    new oddish_1.Oddish(),
    new palossand_1.Palossand(),
    new panpour_1.Panpour(),
    new pansage_1.Pansage(),
    new pansear_1.Pansear(),
    new passimian_1.Passimian(),
    new persian_1.Persian(),
    new pikachu_1.Pikachu(),
    new porygon_1.Porygon(),
    new porygon_z_1.PorygonZ(),
    new porygon2_1.Porygon2(),
    new raichu_1.Raichu(),
    new ralts_1.Ralts(),
    new rhydon_1.Rhydon(),
    new rhyhorn_1.Rhyhorn(),
    new rhyperior_1.Rhyperior(),
    new ribombee_1.Ribombee(),
    new riolu_1.Riolu(),
    new salazzle_gx_1.SalazzleGX(),
    new sandygast_1.Sandygast(),
    new sawk_1.Sawk(),
    new scolipede_1.Scolipede(),
    new seadra_1.Seadra(),
    new seviper_1.Seviper(),
    new shiinotic_1.Shiinotic(),
    new simipour_1.Simipour(),
    new simisage_1.Simisage(),
    new simisear_1.Simisear(),
    new slowking_1.Slowking(),
    new sneasel_1.Sneasel(),
    new solrock_1.Solrock(),
    new stufful_1.Stufful(),
    new tangela_1.Tangela(),
    new tangrowth_1.Tangrowth(),
    new tapu_bulu_gx_1.TapuBuluGX(),
    new tapu_fini_gx_1.TapuFiniGX(),
    new togedemaru_1.Togedemaru(),
    new toxicroak_1.Toxicroak(),
    new turtonator_1.Turtonator(),
    new tynamo_1.Tynamo(),
    new venipede_1.Venipede(),
    new vileplume_1.Vileplume(),
    new weavile_1.Weavile(),
    new whirlipede_1.Whirlipede(),
    new wimpod_1.Wimpod(),
    new wobbuffet_1.Wobbuffet(),
    new zygarde_1.Zygarde(),
    // Trainers
    new acerola_1.Acerola(),
    new bodybuilding_dumbbells_1.BodybuildingDumbbells(),
    new guzma_1.Guzma(),
    new kiawe_1.Kiawe(),
    new lana_1.Lana(),
    new mount_lanakila_1.MountLanakila(),
    new olivia_1.Olivia(),
    new plumeria_1.Plumeria(),
    new po_town_1.PoTown(),
    new rotom_dex_poke_finder_mode_1.RotomDexPokeFinderMode(),
    new sophocles_1.Sophocles(),
    new tormenting_spray_1.TormentingSpray(),
    new wicke_1.Wicke(),
    new wishful_baton_1.WishfulBaton(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.EscapeRopeBUS(),
    new other_prints_1.GuzmaBUS(),
    new other_prints_1.GuzmaBUS2(),
    new other_prints_1.RescueStretcherBUS(),
    new other_prints_1.WeaknessPolicyBUS(),
    new other_prints_1.SuperScoopUpBUS(),
    new other_prints_1.SalazzleGX2BUS(),
    new other_prints_1.TapuFiniGX3BUS(),
    new other_prints_1.NecrozmaGX2BUS(),
    new other_prints_1.MarshadowGX2BUS(),
    new other_prints_1.DarkraiGX3BUS(),
    new other_prints_1.GardevoirGX2BUS(),
    new other_prints_1.NoivernGX2BUS(),
    new other_prints_1.Acerola3BUS(),
    new other_prints_1.Kiawe3BUS(),
    new other_prints_1.Plumeria2BUS(),
    new other_prints_1.Sophocles2BUS(),
    new other_prints_1.TapuBuluGX2BUS(),
    new other_prints_1.SalazzleGX3BUS(),
    new other_prints_1.TapuFiniGX4BUS(),
    new other_prints_1.NecrozmaGX3BUS(),
    new other_prints_1.MarshadowGX3BUS(),
    new other_prints_1.DarkraiGX4BUS(),
    new other_prints_1.GardevoirGX3BUS(),
    new other_prints_1.NoivernGX3BUS(),
    new other_prints_1.BodybuildingDumbbells2BUS(),
    new other_prints_1.ChoiceBandBUS(),
    new other_prints_1.EscapeRopeBUS2BUS(),
    new other_prints_1.SuperScoopUp2BUS(),
    new other_prints_1.FireEnergyBUS(),
    new other_prints_1.DarknessEnergyBUS(),
    new other_prints_1.FairyEnergyBUS(),
    new other_prints_1.TapuFiniGX2BUS(),
    new other_prints_1.DarkraiGX2BUS(),
    new other_prints_1.Acerola2BUS(),
    new other_prints_1.Kiawe2BUS(),
    new other_prints_1.CharmanderAlt(),
    new other_prints_1.CharizardGXBUS150(),
    new other_prints_1.Kirlia2(),
    new other_prints_1.MeowthBUS(),
    new other_prints_1.PorygonZ2(),
    new other_prints_1.GolisopodGx2(),
    new other_prints_1.HoOhGx2(),
    new other_prints_1.MachampGx2(),
    new other_prints_1.Wicke2(),
    new other_prints_1.GolisopodGx3(),
    new other_prints_1.MachampGx3(),
    new other_prints_1.LycanrocGx2(),
    new other_prints_1.AlolanMukGx3(),
    new other_prints_1.MultiSwitchBUS(),
];

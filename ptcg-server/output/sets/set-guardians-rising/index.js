"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGuardiansRising = void 0;
const absol_1 = require("./absol");
const alolan_geodude_1 = require("./alolan-geodude");
const alolan_golem_1 = require("./alolan-golem");
const alolan_graveler_1 = require("./alolan-graveler");
const alolan_ninetales_gx_1 = require("./alolan-ninetales-gx");
const alolan_sandshrew_1 = require("./alolan-sandshrew");
const alolan_sandslash_1 = require("./alolan-sandslash");
const alomomola_1 = require("./alomomola");
const barboach_1 = require("./barboach");
const beldum_1 = require("./beldum");
const bellsprout_1 = require("./bellsprout");
const bewear_1 = require("./bewear");
const blissey_1 = require("./blissey");
const carvanha_1 = require("./carvanha");
const castform_1 = require("./castform");
const chandelure_1 = require("./chandelure");
const chansey_1 = require("./chansey");
const clefable_1 = require("./clefable");
const clefairy_1 = require("./clefairy");
const comfey_1 = require("./comfey");
const cottonee_1 = require("./cottonee");
const delibird_1 = require("./delibird");
const dhelmise_1 = require("./dhelmise");
const drampa_1 = require("./drampa");
const drampa_gx_1 = require("./drampa-gx");
const fletchinder_1 = require("./fletchinder");
const fletchling_1 = require("./fletchling");
const garbodor_1 = require("./garbodor");
const glalie_1 = require("./glalie");
const gligar_1 = require("./gligar");
const gliscor_1 = require("./gliscor");
const golisopod_1 = require("./golisopod");
const goodra_1 = require("./goodra");
const goomy_1 = require("./goomy");
const gothita_1 = require("./gothita");
const gothitelle_1 = require("./gothitelle");
const gothorita_1 = require("./gothorita");
const hakamo_o_1 = require("./hakamo-o");
const heliolisk_1 = require("./heliolisk");
const helioptile_1 = require("./helioptile");
const honchkrow_1 = require("./honchkrow");
const jangmo_o_1 = require("./jangmo-o");
const komala_1 = require("./komala");
const kommo_o_gx_1 = require("./kommo-o-gx");
const lampent_1 = require("./lampent");
const lilligant_1 = require("./lilligant");
const litwick_1 = require("./litwick");
const lunala_1 = require("./lunala");
const lycanroc_gx_1 = require("./lycanroc-gx");
const machamp_1 = require("./machamp");
const machoke_1 = require("./machoke");
const machop_2_1 = require("./machop-2");
const mareanie_1 = require("./mareanie");
const metagross_gx_1 = require("./metagross-gx");
const metang_1 = require("./metang");
const mimikyu_1 = require("./mimikyu");
const minior_1 = require("./minior");
const mudbray_1 = require("./mudbray");
const mudsdale_1 = require("./mudsdale");
const murkrow_1 = require("./murkrow");
const nosepass_1 = require("./nosepass");
const oricorio_1 = require("./oricorio");
const oricorio_2_1 = require("./oricorio-2");
const oricorio_3_1 = require("./oricorio-3");
const oricorio_4_1 = require("./oricorio-4");
const pancham_1 = require("./pancham");
const pangoro_1 = require("./pangoro");
const patrat_1 = require("./patrat");
const petilil_1 = require("./petilil");
const phantump_1 = require("./phantump");
const politoed_1 = require("./politoed");
const probopass_1 = require("./probopass");
const rayquaza_1 = require("./rayquaza");
const rockruff_1 = require("./rockruff");
const sableye_1 = require("./sableye");
const salandit_1 = require("./salandit");
const salazzle_1 = require("./salazzle");
const sharpedo_1 = require("./sharpedo");
const sliggoo_1 = require("./sliggoo");
const slowbro_1 = require("./slowbro");
const slowpoke_1 = require("./slowpoke");
const snorunt_1 = require("./snorunt");
const solgaleo_1 = require("./solgaleo");
const stufful_1 = require("./stufful");
const sudowoodo_1 = require("./sudowoodo");
const swellow_1 = require("./swellow");
const sylveon_gx_1 = require("./sylveon-gx");
const taillow_1 = require("./taillow");
const talonflame_1 = require("./talonflame");
const tapu_koko_gx_1 = require("./tapu-koko-gx");
const tapu_lele_gx_1 = require("./tapu-lele-gx");
const tentacool_1 = require("./tentacool");
const tentacruel_1 = require("./tentacruel");
const toxapex_gx_1 = require("./toxapex-gx");
const trevenant_1 = require("./trevenant");
const trubbish_1 = require("./trubbish");
const turtonator_1 = require("./turtonator");
const turtonator_gx_1 = require("./turtonator-gx");
const vanillish_1 = require("./vanillish");
const vanillite_1 = require("./vanillite");
const vanilluxe_1 = require("./vanilluxe");
const victini_1 = require("./victini");
const victreebel_1 = require("./victreebel");
const vikavolt_gx_1 = require("./vikavolt-gx");
const wailmer_1 = require("./wailmer");
const wailord_1 = require("./wailord");
const watchog_1 = require("./watchog");
const weepinbell_1 = require("./weepinbell");
const whimsicott_1 = require("./whimsicott");
const whiscash_1 = require("./whiscash");
const wimpod_1 = require("./wimpod");
const wishiwashi_1 = require("./wishiwashi");
const wishiwashi_gx_1 = require("./wishiwashi-gx");
const aether_paradise_conservation_area_1 = require("./aether-paradise-conservation-area");
const altar_of_the_moone_1 = require("./altar-of-the-moone");
const altar_of_the_sunne_1 = require("./altar-of-the-sunne");
const aqua_patch_1 = require("./aqua-patch");
const brooklet_hill_1 = require("./brooklet-hill");
const choice_band_1 = require("./choice-band");
const field_blower_1 = require("./field-blower");
const hala_1 = require("./hala");
const mallow_1 = require("./mallow");
const multi_switch_1 = require("./multi-switch");
const rescue_stretcher_1 = require("./rescue-stretcher");
const other_prints_1 = require("./other-prints");
exports.setGuardiansRising = [
    // Pokemon
    new absol_1.Absol(),
    new alolan_geodude_1.AlolanGeodude(),
    new alolan_golem_1.AlolanGolem(),
    new alolan_graveler_1.AlolanGraveler(),
    new alolan_ninetales_gx_1.AlolanNinetalesGX(),
    new alolan_sandshrew_1.AlolanSandshrew(),
    new alolan_sandslash_1.AlolanSandslash(),
    new alomomola_1.Alomomola(),
    new barboach_1.Barboach(),
    new beldum_1.Beldum(),
    new bellsprout_1.Bellsprout(),
    new bewear_1.Bewear(),
    new blissey_1.Blissey(),
    new carvanha_1.Carvanha(),
    new castform_1.Castform(),
    new chandelure_1.Chandelure(),
    new chansey_1.Chansey(),
    new clefable_1.Clefable(),
    new clefairy_1.Clefairy(),
    new comfey_1.Comfey(),
    new cottonee_1.Cottonee(),
    new delibird_1.Delibird(),
    new dhelmise_1.Dhelmise(),
    new drampa_1.Drampa(),
    new drampa_gx_1.DrampaGX(),
    new fletchinder_1.Fletchinder(),
    new fletchling_1.Fletchling(),
    new garbodor_1.Garbodor(),
    new glalie_1.Glalie(),
    new gligar_1.Gligar(),
    new gliscor_1.Gliscor(),
    new golisopod_1.Golisopod(),
    new goodra_1.Goodra(),
    new goomy_1.Goomy(),
    new gothita_1.Gothita(),
    new gothitelle_1.Gothitelle(),
    new gothorita_1.Gothorita(),
    new hakamo_o_1.HakamoO(),
    new heliolisk_1.Heliolisk(),
    new helioptile_1.Helioptile(),
    new honchkrow_1.Honchkrow(),
    new jangmo_o_1.JangmoO(),
    new komala_1.Komala(),
    new kommo_o_gx_1.KommoOGx(),
    new lampent_1.Lampent(),
    new lilligant_1.Lilligant(),
    new litwick_1.Litwick(),
    new lunala_1.Lunala(),
    new lycanroc_gx_1.LycanrocGX(),
    new machamp_1.Machamp(),
    new machoke_1.Machoke(),
    new machop_2_1.Machop2(),
    new mareanie_1.Mareanie(),
    new metagross_gx_1.MetagrossGX(),
    new metang_1.Metang(),
    new mimikyu_1.Mimikyu(),
    new minior_1.Minior(),
    new mudbray_1.Mudbray(),
    new mudsdale_1.Mudsdale(),
    new murkrow_1.Murkrow(),
    new nosepass_1.Nosepass(),
    new oricorio_1.Oricorio(),
    new oricorio_2_1.Oricorio2(),
    new oricorio_3_1.Oricorio3(),
    new oricorio_4_1.Oricorio4(),
    new pancham_1.Pancham(),
    new pangoro_1.Pangoro(),
    new patrat_1.Patrat(),
    new petilil_1.Petilil(),
    new phantump_1.Phantump(),
    new politoed_1.Politoed(),
    new probopass_1.Probopass(),
    new rayquaza_1.Rayquaza(),
    new rockruff_1.Rockruff(),
    new sableye_1.Sableye(),
    new salandit_1.Salandit(),
    new salazzle_1.Salazzle(),
    new sharpedo_1.Sharpedo(),
    new sliggoo_1.Sliggoo(),
    new slowbro_1.Slowbro(),
    new slowpoke_1.Slowpoke(),
    new snorunt_1.Snorunt(),
    new solgaleo_1.Solgaleo(),
    new stufful_1.Stufful(),
    new sudowoodo_1.Sudowoodo(),
    new swellow_1.Swellow(),
    new sylveon_gx_1.SylveonGX(),
    new taillow_1.Taillow(),
    new talonflame_1.Talonflame(),
    new tapu_koko_gx_1.TapuKokoGX(),
    new tapu_lele_gx_1.TapuLeleGX(),
    new tentacool_1.Tentacool(),
    new tentacruel_1.Tentacruel(),
    new toxapex_gx_1.ToxapexGx(),
    new trevenant_1.Trevenant(),
    new trubbish_1.Trubbish(),
    new turtonator_1.Turtonator(),
    new turtonator_gx_1.TurtonatorGx(),
    new vanillish_1.Vanillish(),
    new vanillite_1.Vanillite(),
    new vanilluxe_1.Vanilluxe(),
    new victini_1.Victini(),
    new victreebel_1.Victreebel(),
    new vikavolt_gx_1.VikavoltGx(),
    new wailmer_1.Wailmer(),
    new wailord_1.Wailord(),
    new watchog_1.Watchog(),
    new weepinbell_1.Weepinbell(),
    new whimsicott_1.Whimsicott(),
    new whiscash_1.Whiscash(),
    new wimpod_1.Wimpod(),
    new wishiwashi_1.Wishiwashi(),
    new wishiwashi_gx_1.WishiwashiGx(),
    // Trainers
    new aether_paradise_conservation_area_1.AetherParadiseConvserationArea(),
    new altar_of_the_moone_1.AltarOfTheMoone(),
    new altar_of_the_sunne_1.AltarOfTheSunne(),
    new aqua_patch_1.AquaPatch(),
    new brooklet_hill_1.BrookletHill(),
    new choice_band_1.ChoiceBand(),
    new field_blower_1.FieldBlower(),
    new hala_1.Hala(),
    new mallow_1.Mallow(),
    new multi_switch_1.MultiSwitch(),
    new rescue_stretcher_1.RescueStretcher(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.AlolanVulpixGRI(),
    new other_prints_1.DoubleColorlessEnergyGRISR(),
    new other_prints_1.EnergyLotoGRI(),
    new other_prints_1.EnhancedHammerGRI(),
    new other_prints_1.FieldBlowerGRI(),
    new other_prints_1.FieldBlowerGRI2(),
    new other_prints_1.MaxPotionGRI(),
    new other_prints_1.MaxPotionGRI2(),
    new other_prints_1.MaxPotionGRI3(),
    new other_prints_1.RescueStretcherGRI(),
    new other_prints_1.EnergyRecyclerGRI(),
    new other_prints_1.AlolanNinetalesGX2GRI(),
    new other_prints_1.TapuKokoGX2GRI(),
    new other_prints_1.TapuLeleGX3GRI(),
    new other_prints_1.LycanrocGX2GRI(),
    new other_prints_1.MetagrossGX2GRI(),
    new other_prints_1.SylveonGX3GRI(),
    new other_prints_1.DrampaGX2GRI(),
    new other_prints_1.HauGRI(),
    new other_prints_1.Mallow2GRI(),
    new other_prints_1.DecidueyeGXGRI(),
    new other_prints_1.AlolanNinetalesGX3GRI(),
    new other_prints_1.TapuKokoGX3GRI(),
    new other_prints_1.TapuLeleGX4GRI(),
    new other_prints_1.LycanrocGX3GRI(),
    new other_prints_1.MetagrossGX3GRI(),
    new other_prints_1.SylveonGX4GRI(),
    new other_prints_1.DrampaGX3GRI(),
    new other_prints_1.AquaPatch2GRI(),
    new other_prints_1.EnhancedHammer3GRI(),
    new other_prints_1.RareCandyGRI(),
    new other_prints_1.GrassEnergyGRI(),
    new other_prints_1.LightningEnergyGRI(),
    new other_prints_1.FightingEnergyGRI(),
    new other_prints_1.AlolanVulpix2GRI(),
    new other_prints_1.Garbodor2GRI(),
    new other_prints_1.TapuLeleGX2GRI(),
    new other_prints_1.SylveonGX2GRI(),
    new other_prints_1.ChoiceBand2GRI(),
    new other_prints_1.EnhancedHammer2GRI(),
    new other_prints_1.MetagrossGX4GRI(),
    new other_prints_1.AlolanSandshrew2(),
    new other_prints_1.MachopGRI(),
    new other_prints_1.TurtonatorGx2(),
    new other_prints_1.WishiwashiGx2(),
    new other_prints_1.VikavoltGx2(),
    new other_prints_1.ToxapexGx2(),
    new other_prints_1.KommoOGx2(),
    new other_prints_1.Hala2(),
    new other_prints_1.IncineroarGxGRI(),
    new other_prints_1.TurtonatorGx3(),
    new other_prints_1.PrimarinaGxGRI(),
    new other_prints_1.WishiwashiGx3(),
    new other_prints_1.VikavoltGx3(),
    new other_prints_1.ToxapexGx3(),
    new other_prints_1.KommoOGx3(),
];

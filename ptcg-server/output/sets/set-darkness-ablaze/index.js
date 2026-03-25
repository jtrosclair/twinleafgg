"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDarknessAblaze = void 0;
const accelgor_1 = require("./accelgor");
const aggron_1 = require("./aggron");
const ampharos_1 = require("./ampharos");
const arctovish_1 = require("./arctovish");
const arctozolt_1 = require("./arctozolt");
const ariados_1 = require("./ariados");
const aron_1 = require("./aron");
const beartic_1 = require("./beartic");
const blaziken_1 = require("./blaziken");
const bounsweet_1 = require("./bounsweet");
const bunnelby_1 = require("./bunnelby");
const butterfree_v_1 = require("./butterfree-v");
const butterfree_vmax_1 = require("./butterfree-vmax");
const carnivine_1 = require("./carnivine");
const centiskorch_v_1 = require("./centiskorch-v");
const centiskorch_vmax_1 = require("./centiskorch-vmax");
const charizard_v_1 = require("./charizard-v");
const charizard_vmax_1 = require("./charizard-vmax");
const combusken_1 = require("./combusken");
const copperajah_1 = require("./copperajah");
const corviknight_1 = require("./corviknight");
const corvisquire_1 = require("./corvisquire");
const crobat_v_1 = require("./crobat-v");
const cubchoo_1 = require("./cubchoo");
const cufant_1 = require("./cufant");
const darkrai_1 = require("./darkrai");
const decidueye_1 = require("./decidueye");
const dedenne_1 = require("./dedenne");
const deino_1 = require("./deino");
const delcatty_1 = require("./delcatty");
const diggersby_1 = require("./diggersby");
const diglett_1 = require("./diglett");
const dracovish_1 = require("./dracovish");
const dracozolt_1 = require("./dracozolt");
const ducklett_1 = require("./ducklett");
const dugtrio_1 = require("./dugtrio");
const dunsparce_1 = require("./dunsparce");
const electrike_1 = require("./electrike");
const escavalier_1 = require("./escavalier");
const eternatus_v_1 = require("./eternatus-v");
const eternatus_vmax_1 = require("./eternatus-vmax");
const feebas_1 = require("./feebas");
const flaaffy_1 = require("./flaaffy");
const fletchinder_1 = require("./fletchinder");
const fletchling_1 = require("./fletchling");
const flygon_1 = require("./flygon");
const furret_1 = require("./furret");
const galarian_darmanitan_1 = require("./galarian-darmanitan");
const galarian_darumaka_1 = require("./galarian-darumaka");
const galarian_mr_mime_1 = require("./galarian-mr-mime");
const galarian_mr_rime_1 = require("./galarian-mr-rime");
const galarian_slowbro_v_1 = require("./galarian-slowbro-v");
const galarian_stunfisk_v_1 = require("./galarian-stunfisk-v");
const golett_1 = require("./golett");
const golisopod_1 = require("./golisopod");
const golurk_1 = require("./golurk");
const gothita_1 = require("./gothita");
const gothitelle_1 = require("./gothitelle");
const gothorita_1 = require("./gothorita");
const granbull_1 = require("./granbull");
const greedent_1 = require("./greedent");
const grimer_1 = require("./grimer");
const grimmsnarl_v_1 = require("./grimmsnarl-v");
const grimmsnarl_vmax_1 = require("./grimmsnarl-vmax");
const heatran_1 = require("./heatran");
const hippopotas_1 = require("./hippopotas");
const hippowdon_1 = require("./hippowdon");
const houndoom_v_1 = require("./houndoom-v");
const hydreigon_1 = require("./hydreigon");
const jigglypuff_1 = require("./jigglypuff");
const kangaskhan_1 = require("./kangaskhan");
const karrablast_1 = require("./karrablast");
const klang_1 = require("./klang");
const klink_1 = require("./klink");
const klinklang_1 = require("./klinklang");
const lairon_1 = require("./lairon");
const larvesta_1 = require("./larvesta");
const larvitar_1 = require("./larvitar");
const liepard_1 = require("./liepard");
const lugia_1 = require("./lugia");
const lunatone_1 = require("./lunatone");
const manectric_1 = require("./manectric");
const mareanie_1 = require("./mareanie");
const mareep_1 = require("./mareep");
const melmetal_1 = require("./melmetal");
const meltan_1 = require("./meltan");
const mew_v_1 = require("./mew-v");
const milotic_1 = require("./milotic");
const mimikyu_1 = require("./mimikyu");
const morelull_1 = require("./morelull");
const muk_1 = require("./muk");
const nickit_1 = require("./nickit");
const panpour_1 = require("./panpour");
const pansage_1 = require("./pansage");
const pansear_1 = require("./pansear");
const paras_1 = require("./paras");
const parasect_1 = require("./parasect");
const passimian_1 = require("./passimian");
const pincurchin_1 = require("./pincurchin");
const polteageist_1 = require("./polteageist");
const pupitar_1 = require("./pupitar");
const purrloin_1 = require("./purrloin");
const relicanth_1 = require("./relicanth");
const rhyperior_v_1 = require("./rhyperior-v");
const rookidee_1 = require("./rookidee");
const rowlet_1 = require("./rowlet");
const salamence_v_1 = require("./salamence-v");
const salamence_vmax_1 = require("./salamence-vmax");
const scizor_v_1 = require("./scizor-v");
const scizor_vmax_1 = require("./scizor-vmax");
const sentret_1 = require("./sentret");
const shelmet_1 = require("./shelmet");
const shiinotic_1 = require("./shiinotic");
const simipour_1 = require("./simipour");
const simisage_1 = require("./simisage");
const simisear_1 = require("./simisear");
const sinistea_1 = require("./sinistea");
const skarmory_1 = require("./skarmory");
const skitty_1 = require("./skitty");
const skwovet_1 = require("./skwovet");
const snubbull_1 = require("./snubbull");
const solrock_1 = require("./solrock");
const spinarak_1 = require("./spinarak");
const staraptor_1 = require("./staraptor");
const staravia_1 = require("./staravia");
const starly_1 = require("./starly");
const steenee_1 = require("./steenee");
const suicune_1 = require("./suicune");
const swanna_1 = require("./swanna");
const talonflame_1 = require("./talonflame");
const tapu_koko_1 = require("./tapu-koko");
const tauros_1 = require("./tauros");
const teddiursa_1 = require("./teddiursa");
const thievul_1 = require("./thievul");
const torchic_1 = require("./torchic");
const toxapex_1 = require("./toxapex");
const toxel_1 = require("./toxel");
const toxtricity_1 = require("./toxtricity");
const trapinch_1 = require("./trapinch");
const tsareena_1 = require("./tsareena");
const tyranitar_1 = require("./tyranitar");
const ursaring_1 = require("./ursaring");
const vanillish_1 = require("./vanillish");
const vanillite_1 = require("./vanillite");
const vanilluxe_1 = require("./vanilluxe");
const vibrava_1 = require("./vibrava");
const vikavolt_v_1 = require("./vikavolt-v");
const volcarona_1 = require("./volcarona");
const wigglytuff_1 = require("./wigglytuff");
const wimpod_1 = require("./wimpod");
const wishiwashi_1 = require("./wishiwashi");
const zweilous_1 = require("./zweilous");
const big_parasol_1 = require("./big-parasol");
const billowing_smoke_1 = require("./billowing-smoke");
const bird_keeper_1 = require("./bird-keeper");
const cape_of_toughness_1 = require("./cape-of-toughness");
const familiar_bell_1 = require("./familiar-bell");
const glimwood_tangle_1 = require("./glimwood-tangle");
const kabu_1 = require("./kabu");
const old_pc_1 = require("./old-pc");
const pokemon_breeders_nurturing_1 = require("./pokemon-breeders-nurturing");
const rare_fossil_1 = require("./rare-fossil");
const rose_1 = require("./rose");
const rose_tower_1 = require("./rose-tower");
const spikemuth_1 = require("./spikemuth");
const struggle_gloves_1 = require("./struggle-gloves");
const turbo_patch_1 = require("./turbo-patch");
const yell_horn_1 = require("./yell-horn");
const heat_fire_energy_1 = require("./heat-fire-energy");
const hiding_darkness_energy_1 = require("./hiding-darkness-energy");
const powerful_colorless_energy_1 = require("./powerful-colorless-energy");
const other_prints_1 = require("./other-prints");
exports.setDarknessAblaze = [
    // Pokemon
    new accelgor_1.Accelgor(),
    new aggron_1.Aggron(),
    new ampharos_1.Ampharos(),
    new arctovish_1.Arctovish(),
    new arctozolt_1.Arctozolt(),
    new ariados_1.Ariados(),
    new aron_1.Aron(),
    new beartic_1.Beartic(),
    new blaziken_1.Blaziken(),
    new bounsweet_1.Bounsweet(),
    new bunnelby_1.Bunnelby(),
    new butterfree_v_1.ButterfreeV(),
    new butterfree_vmax_1.ButterfreeVmax(),
    new carnivine_1.Carnivine(),
    new centiskorch_v_1.CentiskorchV(),
    new centiskorch_vmax_1.CentiskorchVmax(),
    new charizard_v_1.CharizardV(),
    new charizard_vmax_1.CharizardVmax(),
    new combusken_1.Combusken(),
    new copperajah_1.Copperajah(),
    new corviknight_1.Corviknight(),
    new corvisquire_1.Corvisquire(),
    new crobat_v_1.CrobatV(),
    new cubchoo_1.Cubchoo(),
    new cufant_1.Cufant(),
    new darkrai_1.Darkrai(),
    new decidueye_1.Decidueye(),
    new dedenne_1.Dedenne(),
    new deino_1.Deino(),
    new delcatty_1.Delcatty(),
    new diggersby_1.Diggersby(),
    new diglett_1.Diglett(),
    new dracovish_1.Dracovish(),
    new dracozolt_1.Dracozolt(),
    new ducklett_1.Ducklett(),
    new dugtrio_1.Dugtrio(),
    new dunsparce_1.Dunsparce(),
    new electrike_1.Electrike(),
    new escavalier_1.Escavalier(),
    new eternatus_v_1.EternatusV(),
    new eternatus_vmax_1.EternatusVMAX(),
    new feebas_1.Feebas(),
    new flaaffy_1.Flaaffy(),
    new fletchinder_1.Fletchinder(),
    new fletchling_1.Fletchling(),
    new flygon_1.Flygon(),
    new furret_1.Furret(),
    new galarian_darmanitan_1.GalarianDarmanitan(),
    new galarian_darumaka_1.GalarianDarumaka(),
    new galarian_mr_mime_1.GalarianMrMime(),
    new galarian_mr_rime_1.GalarianMrRime(),
    new galarian_slowbro_v_1.GalarianSlowbroV(),
    new galarian_stunfisk_v_1.GalarianStunfiskV(),
    new golett_1.Golett(),
    new golisopod_1.Golisopod(),
    new golurk_1.Golurk(),
    new gothita_1.Gothita(),
    new gothitelle_1.Gothitelle(),
    new gothorita_1.Gothorita(),
    new granbull_1.Granbull(),
    new greedent_1.Greedent(),
    new grimer_1.Grimer(),
    new grimmsnarl_v_1.GrimmsnarlV(),
    new grimmsnarl_vmax_1.GrimmsnarlVmax(),
    new heatran_1.Heatran(),
    new hippopotas_1.Hippopotas(),
    new hippowdon_1.Hippowdon(),
    new houndoom_v_1.HoundoomV(),
    new hydreigon_1.Hydreigon(),
    new jigglypuff_1.Jigglypuff(),
    new kangaskhan_1.Kangaskhan(),
    new karrablast_1.Karrablast(),
    new klang_1.Klang(),
    new klink_1.Klink(),
    new klinklang_1.Klinklang(),
    new lairon_1.Lairon(),
    new larvesta_1.Larvesta(),
    new larvitar_1.Larvitar(),
    new liepard_1.Liepard(),
    new lugia_1.Lugia(),
    new lunatone_1.Lunatone(),
    new manectric_1.Manectric(),
    new mareanie_1.Mareanie(),
    new mareep_1.Mareep(),
    new melmetal_1.Melmetal(),
    new meltan_1.Meltan(),
    new mew_v_1.MewV(),
    new milotic_1.Milotic(),
    new mimikyu_1.Mimikyu(),
    new morelull_1.Morelull(),
    new muk_1.Muk(),
    new nickit_1.Nickit(),
    new panpour_1.Panpour(),
    new pansage_1.Pansage(),
    new pansear_1.Pansear(),
    new paras_1.Paras(),
    new parasect_1.Parasect(),
    new passimian_1.Passimian(),
    new pincurchin_1.Pincurchin(),
    new polteageist_1.Polteageist(),
    new pupitar_1.Pupitar(),
    new purrloin_1.Purrloin(),
    new relicanth_1.Relicanth(),
    new rhyperior_v_1.RhyperiorV(),
    new rookidee_1.Rookidee(),
    new rowlet_1.Rowlet(),
    new salamence_v_1.SalamenceV(),
    new salamence_vmax_1.SalamenceVmax(),
    new scizor_v_1.ScizorV(),
    new scizor_vmax_1.ScizorVmax(),
    new sentret_1.Sentret(),
    new shelmet_1.Shelmet(),
    new shiinotic_1.Shiinotic(),
    new simipour_1.Simipour(),
    new simisage_1.Simisage(),
    new simisear_1.Simisear(),
    new sinistea_1.Sinistea(),
    new skarmory_1.Skarmory(),
    new skitty_1.Skitty(),
    new skwovet_1.Skwovet(),
    new snubbull_1.Snubbull(),
    new solrock_1.Solrock(),
    new spinarak_1.Spinarak(),
    new staraptor_1.Staraptor(),
    new staravia_1.Staravia(),
    new starly_1.Starly(),
    new steenee_1.Steenee(),
    new suicune_1.Suicune(),
    new swanna_1.Swanna(),
    new talonflame_1.Talonflame(),
    new tapu_koko_1.TapuKoko(),
    new tauros_1.Tauros(),
    new teddiursa_1.Teddiursa(),
    new thievul_1.Thievul(),
    new torchic_1.Torchic(),
    new toxapex_1.Toxapex(),
    new toxel_1.Toxel(),
    new toxtricity_1.Toxtricity(),
    new trapinch_1.Trapinch(),
    new tsareena_1.Tsareena(),
    new tyranitar_1.Tyranitar(),
    new ursaring_1.Ursaring(),
    new vanillish_1.Vanillish(),
    new vanillite_1.Vanillite(),
    new vanilluxe_1.Vanilluxe(),
    new vibrava_1.Vibrava(),
    new vikavolt_v_1.VikavoltV(),
    new volcarona_1.Volcarona(),
    new wigglytuff_1.Wigglytuff(),
    new wimpod_1.Wimpod(),
    new wishiwashi_1.Wishiwashi(),
    new zweilous_1.Zweilous(),
    // Trainers
    new big_parasol_1.BigParasol(),
    new billowing_smoke_1.BillowingSmoke(),
    new bird_keeper_1.BirdKeeper(),
    new cape_of_toughness_1.CapeOfToughness(),
    new familiar_bell_1.FamiliarBell(),
    new glimwood_tangle_1.GlimwoodTangle(),
    new kabu_1.Kabu(),
    new old_pc_1.OldPc(),
    new pokemon_breeders_nurturing_1.PokemonBreedersNurturing(),
    new rare_fossil_1.RareFossil(),
    new rose_1.Rose(),
    new rose_tower_1.RoseTower(),
    new spikemuth_1.Spikemuth(),
    new struggle_gloves_1.StruggleGloves(),
    new turbo_patch_1.TurboPatch(),
    new yell_horn_1.YellHorn(),
    // Energy
    new heat_fire_energy_1.HeatFireEnergy(),
    new hiding_darkness_energy_1.HidingDarknessEnergy(),
    new powerful_colorless_energy_1.PowerfulColorlessEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.CrobatVDAA(),
    new other_prints_1.DartrixDAA(),
    new other_prints_1.HoopaDAA(),
    new other_prints_1.PiersDAA(),
    new other_prints_1.VikavoltV2DAA(),
    new other_prints_1.Piers2DAA(),
    new other_prints_1.PokemonBreedersNurturing2DAA(),
    new other_prints_1.EternatusVMAX2DAA(),
    new other_prints_1.PokemonBreedersNurturing3DAA(),
    new other_prints_1.RillaboomDAA(),
    new other_prints_1.CoalossalDAA(),
    new other_prints_1.BigParasol2DAA(),
    new other_prints_1.CaptureEnergyDAA(),
    new other_prints_1.GalarianDarmanitanDAA(),
    new other_prints_1.GalarianSirfetchdDAA(),
    new other_prints_1.ButterfreeV2(),
    new other_prints_1.HoundoomV2(),
    new other_prints_1.CentiskorchV2(),
    new other_prints_1.RhyperiorV2(),
    new other_prints_1.ScizorV2(),
    new other_prints_1.GalarianStunfiskV2(),
    new other_prints_1.SalamenceV2(),
    new other_prints_1.Kabu2(),
    new other_prints_1.Rose2(),
    new other_prints_1.ButterfreeVmax2(),
    new other_prints_1.CentiskorchVmax2(),
    new other_prints_1.ScizorVmax2(),
    new other_prints_1.SalamenceVmax2(),
    new other_prints_1.Rose3(),
    new other_prints_1.TurboPatch2(),
];

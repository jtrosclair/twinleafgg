"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSunAndMoon = void 0;
const alolan_rattata_1 = require("./alolan_rattata");
const alolan_diglett_1 = require("./alolan-diglett");
const alolan_dugtrio_1 = require("./alolan-dugtrio");
const alolan_grimer_1 = require("./alolan-grimer");
const alolan_meowth_1 = require("./alolan-meowth");
const alolan_muk_1 = require("./alolan-muk");
const alolan_persian_1 = require("./alolan-persian");
const alolan_raticate_1 = require("./alolan-raticate");
const araquanid_1 = require("./araquanid");
const arcanine_1 = require("./arcanine");
const bewear_1 = require("./bewear");
const boldore_1 = require("./boldore");
const bounsweet_1 = require("./bounsweet");
const brionne_1 = require("./brionne");
const bruxish_1 = require("./bruxish");
const butterfree_1 = require("./butterfree");
const card_images_1 = require("./card-images");
const carvanha_1 = require("./carvanha");
const caterpie_1 = require("./caterpie");
const charjabug_1 = require("./charjabug");
const chinchou_1 = require("./chinchou");
const cloyster_1 = require("./cloyster");
const corsola_1 = require("./corsola");
const cosmoem_1 = require("./cosmoem");
const cosmog_1 = require("./cosmog");
const crabominable_1 = require("./crabominable");
const crabrawler_1 = require("./crabrawler");
const crobat_1 = require("./crobat");
const cutiefly_1 = require("./cutiefly");
const dartrix_1 = require("./dartrix");
const decidueye_1 = require("./decidueye");
const decidueye_gx_1 = require("./decidueye-gx");
const dewpider_1 = require("./dewpider");
const dragonair_1 = require("./dragonair");
const dragonite_1 = require("./dragonite");
const dratini_1 = require("./dratini");
const drowzee_1 = require("./drowzee");
const eevee_1 = require("./eevee");
const espeon_gx_1 = require("./espeon-gx");
const fearow_1 = require("./fearow");
const fomantis_1 = require("./fomantis");
const gigalith_1 = require("./gigalith");
const golbat_1 = require("./golbat");
const golduck_1 = require("./golduck");
const granbull_1 = require("./granbull");
const growlithe_1 = require("./growlithe");
const grubbin_1 = require("./grubbin");
const gumshoos_gx_1 = require("./gumshoos-gx");
const hariyama_1 = require("./hariyama");
const herdier_1 = require("./herdier");
const hypno_1 = require("./hypno");
const incineroar_1 = require("./incineroar");
const incineroar_gx_1 = require("./incineroar-gx");
const kangaskhan_1 = require("./kangaskhan");
const krokorok_1 = require("./krokorok");
const krookodile_1 = require("./krookodile");
const lanturn_1 = require("./lanturn");
const lapras_gx_1 = require("./lapras-gx");
const lillipup_1 = require("./lillipup");
const litten_1 = require("./litten");
const lunala_gx_1 = require("./lunala-gx");
const lurantis_gx_1 = require("./lurantis-gx");
const makuhita_1 = require("./makuhita");
const mareanie_1 = require("./mareanie");
const masquerain_1 = require("./masquerain");
const metapod_1 = require("./metapod");
const morelull_1 = require("./morelull");
const oranguru_1 = require("./oranguru");
const palossand_1 = require("./palossand");
const paras_1 = require("./paras");
const parasect_1 = require("./parasect");
const passimian_1 = require("./passimian");
const pelipper_1 = require("./pelipper");
const pikipek_1 = require("./pikipek");
const pinsir_1 = require("./pinsir");
const poliwag_1 = require("./poliwag");
const poliwhirl_1 = require("./poliwhirl");
const poliwrath_1 = require("./poliwrath");
const popplio_1 = require("./popplio");
const primarina_1 = require("./primarina");
const primarina_gx_1 = require("./primarina-gx");
const psyduck_1 = require("./psyduck");
const pyukumuku_1 = require("./pyukumuku");
const ribombee_1 = require("./ribombee");
const roggenrola_1 = require("./roggenrola");
const rowlet_1 = require("./rowlet");
const sandile_1 = require("./sandile");
const sandygast_1 = require("./sandygast");
const sharpedo_1 = require("./sharpedo");
const shellder_1 = require("./shellder");
const shiinotic_1 = require("./shiinotic");
const skarmory_1 = require("./skarmory");
const snubbull_1 = require("./snubbull");
const solgaleo_gx_1 = require("./solgaleo-gx");
const spearow_1 = require("./spearow");
const spinda_1 = require("./spinda");
const steenee_1 = require("./steenee");
const stoutland_1 = require("./stoutland");
const stufful_1 = require("./stufful");
const surskit_1 = require("./surskit");
const tauros_gx_1 = require("./tauros-gx");
const togedemaru_1 = require("./togedemaru");
const torkoal_1 = require("./torkoal");
const torracat_1 = require("./torracat");
const toucannon_1 = require("./toucannon");
const toxapex_1 = require("./toxapex");
const trumbeak_1 = require("./trumbeak");
const tsareena_1 = require("./tsareena");
const umbreon_gx_1 = require("./umbreon-gx");
const vikavolt_1 = require("./vikavolt");
const wingull_1 = require("./wingull");
const wishiwashi_1 = require("./wishiwashi");
const yungoos_1 = require("./yungoos");
const zubat_1 = require("./zubat");
const big_malasada_1 = require("./big-malasada");
const ilima_1 = require("./ilima");
const poison_barb_1 = require("./poison-barb");
const professor_kukui_1 = require("./professor-kukui");
const repel_1 = require("./repel");
const rainbow_energy_1 = require("./rainbow-energy");
const rotom_dex_1 = require("./rotom-dex");
const team_skull_grunt_1 = require("./team-skull-grunt");
const timer_ball_1 = require("./timer-ball");
const basic_energies_1 = require("./basic-energies");
const other_prints_1 = require("./other-prints");
exports.setSunAndMoon = [
    // Pokemon
    new alolan_rattata_1.AlolanRattata(),
    new alolan_diglett_1.AlolanDiglett(),
    new alolan_dugtrio_1.AlolanDugtrio(),
    new alolan_grimer_1.AlolanGrimer(),
    new alolan_meowth_1.AlolanMeowth(),
    new alolan_muk_1.AlolanMuk(),
    new alolan_persian_1.AlolanPersian(),
    new alolan_raticate_1.AlolanRaticate(),
    new araquanid_1.Araquanid(),
    new arcanine_1.Arcanine(),
    new bewear_1.Bewear(),
    new boldore_1.Boldore(),
    new bounsweet_1.Bounsweet(),
    new brionne_1.Brionne(),
    new bruxish_1.Bruxish(),
    new butterfree_1.Butterfree(),
    new carvanha_1.Carvanha(),
    new caterpie_1.Caterpie(),
    new charjabug_1.Charjabug(),
    new chinchou_1.Chinchou(),
    new cloyster_1.Cloyster(),
    new corsola_1.Corsola(),
    new cosmoem_1.Cosmoem(),
    new cosmog_1.Cosmog(),
    new crabominable_1.Crabominable(),
    new crabrawler_1.Crabrawler(),
    new crobat_1.Crobat(),
    new cutiefly_1.Cutiefly(),
    new dartrix_1.Dartrix(),
    new decidueye_1.Decidueye(),
    new decidueye_gx_1.DecidueyeGX(),
    new dewpider_1.Dewpider(),
    new dragonair_1.Dragonair(),
    new dragonite_1.Dragonite(),
    new dratini_1.Dratini(),
    new drowzee_1.Drowzee(),
    new eevee_1.Eevee(),
    new espeon_gx_1.EspeonGX(),
    new fearow_1.Fearow(),
    new fomantis_1.Fomantis(),
    new gigalith_1.Gigalith(),
    new golbat_1.Golbat(),
    new golduck_1.Golduck(),
    new granbull_1.Granbull(),
    new growlithe_1.Growlithe(),
    new grubbin_1.Grubbin(),
    new gumshoos_gx_1.GumshoosGx(),
    new hariyama_1.Hariyama(),
    new herdier_1.Herdier(),
    new hypno_1.Hypno(),
    new incineroar_1.Incineroar(),
    new incineroar_gx_1.IncineroarGx(),
    new kangaskhan_1.Kangaskhan(),
    new krokorok_1.Krokorok(),
    new krookodile_1.Krookodile(),
    new lanturn_1.Lanturn(),
    new lapras_gx_1.LaprasGx(),
    new lillipup_1.Lillipup(),
    new litten_1.Litten(),
    new lunala_gx_1.LunalaGx(),
    new lurantis_gx_1.LurantisGX(),
    new makuhita_1.Makuhita(),
    new mareanie_1.Mareanie(),
    new masquerain_1.Masquerain(),
    new metapod_1.Metapod(),
    new morelull_1.Morelull(),
    new oranguru_1.Oranguru(),
    new palossand_1.Palossand(),
    new paras_1.Paras(),
    new parasect_1.Parasect(),
    new passimian_1.Passimian(),
    new pelipper_1.Pelipper(),
    new pikipek_1.Pikipek(),
    new pinsir_1.Pinsir(),
    new poliwag_1.Poliwag(),
    new poliwhirl_1.Poliwhirl(),
    new poliwrath_1.Poliwrath(),
    new popplio_1.Popplio(),
    new primarina_1.Primarina(),
    new primarina_gx_1.PrimarinaGx(),
    new psyduck_1.Psyduck(),
    new pyukumuku_1.Pyukumuku(),
    new ribombee_1.Ribombee(),
    new roggenrola_1.Roggenrola(),
    new rowlet_1.Rowlet(),
    new sandile_1.Sandile(),
    new sandygast_1.Sandygast(),
    new sharpedo_1.Sharpedo(),
    new shellder_1.Shellder(),
    new shiinotic_1.Shiinotic(),
    new skarmory_1.Skarmory(),
    new snubbull_1.Snubbull(),
    new solgaleo_gx_1.SolgaleoGx(),
    new spearow_1.Spearow(),
    new spinda_1.Spinda(),
    new steenee_1.Steenee(),
    new stoutland_1.Stoutland(),
    new stufful_1.Stufful(),
    new surskit_1.Surskit(),
    new tauros_gx_1.TaurosGX(),
    new togedemaru_1.Togedemaru(),
    new torkoal_1.Torkoal(),
    new torracat_1.Torracat(),
    new toucannon_1.Toucannon(),
    new toxapex_1.Toxapex(),
    new trumbeak_1.Trumbeak(),
    new tsareena_1.Tsareena(),
    new umbreon_gx_1.UmbreonGx(),
    new vikavolt_1.Vikavolt(),
    new wingull_1.Wingull(),
    new wishiwashi_1.Wishiwashi(),
    new yungoos_1.Yungoos(),
    new zubat_1.Zubat(),
    // Trainers
    new big_malasada_1.BigMalasada(),
    new ilima_1.Ilima(),
    new poison_barb_1.PoisonBarb(),
    new professor_kukui_1.ProfessorKukui(),
    new repel_1.Repel(),
    new rotom_dex_1.RotomDex(),
    new team_skull_grunt_1.TeamSkullGrunt(),
    new timer_ball_1.TimerBall(),
    // Energy
    new basic_energies_1.GrassEnergy(),
    new basic_energies_1.FireEnergy(),
    new basic_energies_1.WaterEnergy(),
    new basic_energies_1.LightningEnergy(),
    new basic_energies_1.PsychicEnergy(),
    new basic_energies_1.FightingEnergy(),
    new basic_energies_1.DarknessEnergy(),
    new basic_energies_1.MetalEnergy(),
    new basic_energies_1.FairyEnergy(),
    new rainbow_energy_1.RainbowEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.DoubleColorlessEnergySUM(),
    new card_images_1.EnergyRetrievalSUM(),
    new other_prints_1.ExpShareSUM(),
    new other_prints_1.HauSUM(),
    new other_prints_1.NestBallSUM(),
    new other_prints_1.RareCandySUM(),
    new other_prints_1.RotomDexSR(),
    new other_prints_1.UltraBallSUMSR(),
    new other_prints_1.CrushingHammerSUM(),
    new other_prints_1.EnergySwitchPKSUM(),
    new other_prints_1.GreatBallSUM(),
    new other_prints_1.LillieSUM(),
    new other_prints_1.PokeBallSUM(),
    new other_prints_1.PokemonCatcherSUM(),
    new other_prints_1.PotionSUM(),
    new other_prints_1.SwitchSUM(),
    new other_prints_1.UltraBallSUM(),
    new other_prints_1.LurantisGX2SUM(),
    new other_prints_1.EspeonGX2SUM(),
    new other_prints_1.TaurosGX2SUM(),
    new other_prints_1.Lillie2SUM(),
    new other_prints_1.ProfessorKukui2SUM(),
    new other_prints_1.TeamSkullGrunt2SUM(),
    new other_prints_1.LurantisGX3SUM(),
    new other_prints_1.EspeonGX3SUM(),
    new other_prints_1.TaurosGX3SUM(),
    new other_prints_1.NestBall2SUM(),
    new other_prints_1.Switch2SUM(),
    new other_prints_1.Eevee2SUM(),
    new other_prints_1.LaprasGx2(),
    new other_prints_1.LunalaGx2(),
    new other_prints_1.UmbreonGx2(),
    new other_prints_1.SolgaleoGx2(),
    new other_prints_1.GumshoosGx2(),
    new other_prints_1.Ilima2(),
    new other_prints_1.LaprasGx3(),
    new other_prints_1.LunalaGx3(),
    new other_prints_1.UmbreonGx3(),
    new other_prints_1.SolgaleoGx3(),
    new other_prints_1.GumshoosGx3(),
];

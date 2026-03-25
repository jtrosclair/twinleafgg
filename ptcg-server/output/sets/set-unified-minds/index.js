"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUnifiedMinds = void 0;
const abomasnow_1 = require("./abomasnow");
const aegislash_1 = require("./aegislash");
const aerodactyl_gx_1 = require("./aerodactyl-gx");
const alolan_grimer_1 = require("./alolan-grimer");
const alolan_marowak_1 = require("./alolan-marowak");
const alolan_raichu_1 = require("./alolan-raichu");
const amoonguss_1 = require("./amoonguss");
const araquanid_1 = require("./araquanid");
const archen_1 = require("./archen");
const archeops_1 = require("./archeops");
const audino_1 = require("./audino");
const axew_1 = require("./axew");
const azelf_1 = require("./azelf");
const basculin_1 = require("./basculin");
const beheeyem_1 = require("./beheeyem");
const bibarel_1 = require("./bibarel");
const bidoof_1 = require("./bidoof");
const bounsweet_1 = require("./bounsweet");
const breloom_1 = require("./breloom");
const camerupt_1 = require("./camerupt");
const carracosta_1 = require("./carracosta");
const celebi_1 = require("./celebi");
const chandelure_1 = require("./chandelure");
const cosmog_1 = require("./cosmog");
const cottonee_1 = require("./cottonee");
const cresselia_1 = require("./cresselia");
const crustle_1 = require("./crustle");
const cryogonal_1 = require("./cryogonal");
const cubone_1 = require("./cubone");
const dedenne_1 = require("./dedenne");
const dewpider_1 = require("./dewpider");
const dhelmise_1 = require("./dhelmise");
const doublade_1 = require("./doublade");
const dragonair_1 = require("./dragonair");
const dragonair_2_1 = require("./dragonair-2");
const dragonite_1 = require("./dragonite");
const dragonite_gx_1 = require("./dragonite-gx");
const drapion_1 = require("./drapion");
const dratini_1 = require("./dratini");
const dratini_2_1 = require("./dratini-2");
const drifblim_1 = require("./drifblim");
const drifloon_1 = require("./drifloon");
const drilbur_1 = require("./drilbur");
const druddigon_1 = require("./druddigon");
const dwebble_1 = require("./dwebble");
const eelektrik_1 = require("./eelektrik");
const eelektross_1 = require("./eelektross");
const elgyem_1 = require("./elgyem");
const escavalier_1 = require("./escavalier");
const espeon_and_deoxys_gx_1 = require("./espeon-and-deoxys-gx");
const excadrill_1 = require("./excadrill");
const exeggcute_1 = require("./exeggcute");
const exeggutor_1 = require("./exeggutor");
const finneon_1 = require("./finneon");
const fletchinder_1 = require("./fletchinder");
const fletchling_1 = require("./fletchling");
const fomantis_1 = require("./fomantis");
const foongus_1 = require("./foongus");
const fraxure_1 = require("./fraxure");
const froslass_1 = require("./froslass");
const gabite_1 = require("./gabite");
const galvantula_1 = require("./galvantula");
const garchomp_1 = require("./garchomp");
const garchomp_and_giratina_gx_1 = require("./garchomp-and-giratina-gx");
const gible_1 = require("./gible");
const giratina_1 = require("./giratina");
const golisopod_1 = require("./golisopod");
const gumshoos_1 = require("./gumshoos");
const haxorus_1 = require("./haxorus");
const heatran_gx_1 = require("./heatran-gx");
const heracross_1 = require("./heracross");
const honchkrow_1 = require("./honchkrow");
const honedge_1 = require("./honedge");
const honedge_2_1 = require("./honedge-2");
const hoopa_1 = require("./hoopa");
const hoothoot_1 = require("./hoothoot");
const jirachi_gx_1 = require("./jirachi-gx");
const joltik_1 = require("./joltik");
const jynx_1 = require("./jynx");
const kangaskhan_1 = require("./kangaskhan");
const karrablast_1 = require("./karrablast");
const keldeo_gx_1 = require("./keldeo-gx");
const komala_1 = require("./komala");
const lampent_1 = require("./lampent");
const lapras_1 = require("./lapras");
const latias_1 = require("./latias");
const latios_gx_1 = require("./latios-gx");
const leavanny_1 = require("./leavanny");
const lickilicky_1 = require("./lickilicky");
const lickitung_1 = require("./lickitung");
const liepard_1 = require("./liepard");
const litwick_1 = require("./litwick");
const lucario_1 = require("./lucario");
const lumineon_1 = require("./lumineon");
const lurantis_1 = require("./lurantis");
const magmar_1 = require("./magmar");
const magmortar_1 = require("./magmortar");
const magnemite_1 = require("./magnemite");
const magneton_1 = require("./magneton");
const magnezone_1 = require("./magnezone");
const mareanie_1 = require("./mareanie");
const mawile_gx_1 = require("./mawile-gx");
const medicham_1 = require("./medicham");
const meditite_1 = require("./meditite");
const mega_sableye_tyranitar_gx_1 = require("./mega-sableye-tyranitar-gx");
const meloetta_1 = require("./meloetta");
const mesprit_1 = require("./mesprit");
const mewtwo_and_mew_gx_1 = require("./mewtwo-and-mew-gx");
const munchlax_1 = require("./munchlax");
const munna_1 = require("./munna");
const murkrow_2_1 = require("./murkrow-2");
const musharna_1 = require("./musharna");
const naganadel_gx_1 = require("./naganadel-gx");
const necrozma_1 = require("./necrozma");
const noctowl_1 = require("./noctowl");
const noibat_1 = require("./noibat");
const noivern_1 = require("./noivern");
const numel_1 = require("./numel");
const onix_1 = require("./onix");
const oranguru_1 = require("./oranguru");
const pidove_1 = require("./pidove");
const pikachu_1 = require("./pikachu");
const pikachu_2_1 = require("./pikachu-2");
const poipole_1 = require("./poipole");
const purrloin_1 = require("./purrloin");
const pyukumuku_1 = require("./pyukumuku");
const raichu_and_alolan_raichu_gx_1 = require("./raichu-and-alolan-raichu-gx");
const relicanth_1 = require("./relicanth");
const riolu_1 = require("./riolu");
const rowlet_and_alolan_exeggutor_gx_1 = require("./rowlet-and-alolan-exeggutor-gx");
const sableye_1 = require("./sableye");
const salandit_1 = require("./salandit");
const salandit_2_1 = require("./salandit-2");
const salazzle_1 = require("./salazzle");
const salazzle_2_1 = require("./salazzle-2");
const scrafty_1 = require("./scrafty");
const scraggy_1 = require("./scraggy");
const sewaddle_1 = require("./sewaddle");
const sewaddle_2_1 = require("./sewaddle-2");
const shroomish_1 = require("./shroomish");
const silvally_1 = require("./silvally");
const skorupi_1 = require("./skorupi");
const slaking_1 = require("./slaking");
const slakoth_1 = require("./slakoth");
const slakoth_2_1 = require("./slakoth-2");
const slowpoke_and_psyduck_gx_1 = require("./slowpoke-and-psyduck-gx");
const sneasel_1 = require("./sneasel");
const snorunt_1 = require("./snorunt");
const snover_1 = require("./snover");
const steelix_1 = require("./steelix");
const steenee_1 = require("./steenee");
const stunfisk_1 = require("./stunfisk");
const swadloon_1 = require("./swadloon");
const talonflame_1 = require("./talonflame");
const tapu_fini_1 = require("./tapu-fini");
const tapu_koko_1 = require("./tapu-koko");
const tauros_1 = require("./tauros");
const terrakion_1 = require("./terrakion");
const thundurus_1 = require("./thundurus");
const tirtouga_1 = require("./tirtouga");
const tornadus_1 = require("./tornadus");
const toxapex_1 = require("./toxapex");
const tranquill_1 = require("./tranquill");
const tsareena_1 = require("./tsareena");
const tynamo_1 = require("./tynamo");
const tynamo_2_1 = require("./tynamo-2");
const type_null_1 = require("./type-null");
const umbreon_and_darkrai_gx_1 = require("./umbreon-and-darkrai-gx");
const unfezant_1 = require("./unfezant");
const uxie_1 = require("./uxie");
const victini_1 = require("./victini");
const vigoroth_1 = require("./vigoroth");
const weavile_gx_1 = require("./weavile-gx");
const whimsicott_1 = require("./whimsicott");
const wimpod_1 = require("./wimpod");
const wynaut_1 = require("./wynaut");
const xurkitree_1 = require("./xurkitree");
const yanma_1 = require("./yanma");
const yanmega_1 = require("./yanmega");
const yungoos_1 = require("./yungoos");
const yveltal_1 = require("./yveltal");
const zygarde_1 = require("./zygarde");
const blaines_quiz_show_1 = require("./blaines-quiz-show");
const blizzard_town_1 = require("./blizzard-town");
const blues_tactics_1 = require("./blues-tactics");
const bug_catcher_1 = require("./bug-catcher");
const channeler_1 = require("./channeler");
const cherish_ball_1 = require("./cherish-ball");
const coach_trainer_1 = require("./coach-trainer");
const dark_city_1 = require("./dark-city");
const ear_ringing_bell_1 = require("./ear-ringing-bell");
const flyinium_z_air_slash_1 = require("./flyinium-z-air-slash");
const giant_bomb_1 = require("./giant-bomb");
const great_potion_1 = require("./great-potion");
const grimsley_1 = require("./grimsley");
const hapu_1 = require("./hapu");
const karate_belt_1 = require("./karate-belt");
const mistys_favor_1 = require("./mistys-favor");
const normalium_z_tackle_1 = require("./normalium-z-tackle");
const poke_maniac_1 = require("./poke-maniac");
const pokemon_research_lab_1 = require("./pokemon-research-lab");
const reset_stamp_1 = require("./reset-stamp");
const slumbering_forest_1 = require("./slumbering-forest");
const stadium_nav_1 = require("./stadium-nav");
const tag_switch_1 = require("./tag_switch");
const u_turn_board_1 = require("./u-turn-board");
const recycle_energy_1 = require("./recycle-energy");
const weakness_guard_energy_1 = require("./weakness-guard-energy");
const other_prints_1 = require("./other-prints");
exports.setUnifiedMinds = [
    // Pokemon
    new abomasnow_1.Abomasnow(),
    new aegislash_1.Aegislash(),
    new aerodactyl_gx_1.AerodactylGx(),
    new alolan_grimer_1.AlolanGrimer(),
    new alolan_marowak_1.AlolanMarowak(),
    new alolan_raichu_1.AlolanRaichu(),
    new amoonguss_1.Amoonguss(),
    new araquanid_1.Araquanid(),
    new archen_1.Archen(),
    new archeops_1.Archeops(),
    new audino_1.Audino(),
    new axew_1.Axew(),
    new azelf_1.Azelf(),
    new basculin_1.Basculin(),
    new beheeyem_1.Beheeyem(),
    new bibarel_1.Bibarel(),
    new bidoof_1.Bidoof(),
    new bounsweet_1.Bounsweet(),
    new breloom_1.Breloom(),
    new camerupt_1.Camerupt(),
    new carracosta_1.Carracosta(),
    new celebi_1.Celebi(),
    new chandelure_1.Chandelure(),
    new cosmog_1.Cosmog(),
    new cottonee_1.Cottonee(),
    new cresselia_1.Cresselia(),
    new crustle_1.Crustle(),
    new cryogonal_1.Cryogonal(),
    new cubone_1.Cubone(),
    new dedenne_1.Dedenne(),
    new dewpider_1.Dewpider(),
    new dhelmise_1.Dhelmise(),
    new doublade_1.Doublade(),
    new dragonair_1.Dragonair(),
    new dragonair_2_1.Dragonair2(),
    new dragonite_1.Dragonite(),
    new dragonite_gx_1.DragoniteGx(),
    new drapion_1.Drapion(),
    new dratini_1.Dratini(),
    new dratini_2_1.Dratini2(),
    new drifblim_1.Drifblim(),
    new drifloon_1.Drifloon(),
    new drilbur_1.Drilbur(),
    new druddigon_1.Druddigon(),
    new dwebble_1.Dwebble(),
    new eelektrik_1.Eelektrik(),
    new eelektross_1.Eelektross(),
    new elgyem_1.Elgyem(),
    new escavalier_1.Escavalier(),
    new espeon_and_deoxys_gx_1.EspeonDeoxysGX(),
    new excadrill_1.Excadrill(),
    new exeggcute_1.Exeggcute(),
    new exeggutor_1.Exeggutor(),
    new finneon_1.Finneon(),
    new fletchinder_1.Fletchinder(),
    new fletchling_1.Fletchling(),
    new fomantis_1.Fomantis(),
    new foongus_1.Foongus(),
    new fraxure_1.Fraxure(),
    new froslass_1.Froslass(),
    new gabite_1.Gabite(),
    new galvantula_1.Galvantula(),
    new garchomp_1.Garchomp(),
    new garchomp_and_giratina_gx_1.GarchompGiratinaGX(),
    new gible_1.Gible(),
    new giratina_1.Giratina(),
    new golisopod_1.Golisopod(),
    new gumshoos_1.Gumshoos(),
    new haxorus_1.Haxorus(),
    new heatran_gx_1.HeatranGX(),
    new heracross_1.Heracross(),
    new honchkrow_1.Honchkrow(),
    new honedge_1.Honedge(),
    new honedge_2_1.Honedge2(),
    new hoopa_1.Hoopa(),
    new hoothoot_1.Hoothoot(),
    new jirachi_gx_1.JirachiGx(),
    new joltik_1.Joltik(),
    new jynx_1.Jynx(),
    new kangaskhan_1.Kangaskhan(),
    new karrablast_1.Karrablast(),
    new keldeo_gx_1.KeldeoGX(),
    new komala_1.Komala(),
    new lampent_1.Lampent(),
    new lapras_1.Lapras(),
    new latias_1.Latias(),
    new latios_gx_1.LatiosGx(),
    new leavanny_1.Leavanny(),
    new lickilicky_1.Lickilicky(),
    new lickitung_1.Lickitung(),
    new liepard_1.Liepard(),
    new litwick_1.Litwick(),
    new lucario_1.Lucario(),
    new lumineon_1.Lumineon(),
    new lurantis_1.Lurantis(),
    new magmar_1.Magmar(),
    new magmortar_1.Magmortar(),
    new magnemite_1.Magnemite(),
    new magneton_1.Magneton(),
    new magnezone_1.Magnezone(),
    new mareanie_1.Mareanie(),
    new mawile_gx_1.MawileGX(),
    new medicham_1.Medicham(),
    new meditite_1.Meditite(),
    new mega_sableye_tyranitar_gx_1.MegaSableyeTyranitarGX(),
    new meloetta_1.Meloetta(),
    new mesprit_1.Mesprit(),
    new mewtwo_and_mew_gx_1.MewtwoMewGX(),
    new munchlax_1.Munchlax(),
    new munna_1.Munna(),
    new murkrow_2_1.Murkrow2(),
    new musharna_1.Musharna(),
    new naganadel_gx_1.NaganadelGx(),
    new necrozma_1.Necrozma(),
    new noctowl_1.Noctowl(),
    new noibat_1.Noibat(),
    new noivern_1.Noivern(),
    new numel_1.Numel(),
    new onix_1.Onix(),
    new oranguru_1.Oranguru(),
    new pidove_1.Pidove(),
    new pikachu_1.Pikachu(),
    new pikachu_2_1.Pikachu2(),
    new poipole_1.Poipole(),
    new purrloin_1.Purrloin(),
    new pyukumuku_1.Pyukumuku(),
    new raichu_and_alolan_raichu_gx_1.RaichuAlolanRaichuGX(),
    new relicanth_1.Relicanth(),
    new riolu_1.Riolu(),
    new rowlet_and_alolan_exeggutor_gx_1.RowletAlolanExeggutorGX(),
    new sableye_1.Sableye(),
    new salandit_1.Salandit(),
    new salandit_2_1.Salandit2(),
    new salazzle_1.Salazzle(),
    new salazzle_2_1.Salazzle2(),
    new scrafty_1.Scrafty(),
    new scraggy_1.Scraggy(),
    new sewaddle_1.Sewaddle(),
    new sewaddle_2_1.Sewaddle2(),
    new shroomish_1.Shroomish(),
    new silvally_1.Silvally(),
    new skorupi_1.Skorupi(),
    new slaking_1.Slaking(),
    new slakoth_1.Slakoth(),
    new slakoth_2_1.Slakoth2(),
    new slowpoke_and_psyduck_gx_1.SlowpokePsyduckGX(),
    new sneasel_1.Sneasel(),
    new snorunt_1.Snorunt(),
    new snover_1.Snover(),
    new steelix_1.Steelix(),
    new steenee_1.Steenee(),
    new stunfisk_1.Stunfisk(),
    new swadloon_1.Swadloon(),
    new talonflame_1.Talonflame(),
    new tapu_fini_1.TapuFini(),
    new tapu_koko_1.TapuKoko(),
    new tauros_1.Tauros(),
    new terrakion_1.Terrakion(),
    new thundurus_1.Thundurus(),
    new tirtouga_1.Tirtouga(),
    new tornadus_1.Tornadus(),
    new toxapex_1.Toxapex(),
    new tranquill_1.Tranquill(),
    new tsareena_1.Tsareena(),
    new tynamo_1.Tynamo(),
    new tynamo_2_1.Tynamo2(),
    new type_null_1.TypeNull(),
    new umbreon_and_darkrai_gx_1.UmbreonDarkraiGX(),
    new unfezant_1.Unfezant(),
    new uxie_1.Uxie(),
    new victini_1.Victini(),
    new vigoroth_1.Vigoroth(),
    new weavile_gx_1.WeavileGX(),
    new whimsicott_1.Whimsicott(),
    new wimpod_1.Wimpod(),
    new wynaut_1.Wynaut(),
    new xurkitree_1.Xurkitree(),
    new yanma_1.Yanma(),
    new yanmega_1.Yanmega(),
    new yungoos_1.Yungoos(),
    new yveltal_1.Yveltal(),
    new zygarde_1.Zygarde(),
    // Trainers
    new blaines_quiz_show_1.BlainesQuizShow(),
    new blizzard_town_1.BlizzardTown(),
    new blues_tactics_1.BluesTactics(),
    new bug_catcher_1.BugCatcher(),
    new channeler_1.Channeler(),
    new cherish_ball_1.CherishBall(),
    new coach_trainer_1.CoachTrainer(),
    new dark_city_1.DarkCity(),
    new ear_ringing_bell_1.EarRingingBell(),
    new flyinium_z_air_slash_1.FlyiniumZAirSlash(),
    new giant_bomb_1.GiantBomb(),
    new great_potion_1.GreatPotion(),
    new grimsley_1.Grimsley(),
    new hapu_1.Hapu(),
    new karate_belt_1.KarateBelt(),
    new mistys_favor_1.MistysFavor(),
    new normalium_z_tackle_1.NormaliumZTackle(),
    new poke_maniac_1.PokeManiac(),
    new pokemon_research_lab_1.PokemonResearchLab(),
    new reset_stamp_1.ResetStamp(),
    new slumbering_forest_1.SlumberingForest(),
    new stadium_nav_1.StadiumNav(),
    new tag_switch_1.TagSwitch(),
    new u_turn_board_1.UTurnBoard(),
    // Energy
    new recycle_energy_1.RecycleEnergy(),
    new weakness_guard_energy_1.WeaknessGuardEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.Riolu2UNM(),
    new other_prints_1.MurkrowUNM(),
    new other_prints_1.UnidentifiedFossilUNM(),
    new other_prints_1.RowletAlolanExeggutorGX2UNM(),
    new other_prints_1.RowletAlolanExeggutorGX3UNM(),
    new other_prints_1.SlowpokePsyduckGX2UNM(),
    new other_prints_1.SlowpokePsyduckGX3UNM(),
    new other_prints_1.KeldeoGX2UNM(),
    new other_prints_1.RaichuAlolanRaichuGX2UNM(),
    new other_prints_1.RaichuAlolanRaichuGX3UNM(),
    new other_prints_1.MewtwoMewGX2UNM(),
    new other_prints_1.MegaSableyeTyranitarGX2UNM(),
    new other_prints_1.MegaSableyeTyranitarGX3UNM(),
    new other_prints_1.GarchompGiratinaGX2UNM(),
    new other_prints_1.Grimsley2UNM(),
    new other_prints_1.MistysFavor2UNM(),
    new other_prints_1.RowletAlolanExeggutorGX4UNM(),
    new other_prints_1.SlowpokePsyduckGX4UNM(),
    new other_prints_1.KeldeoGX3UNM(),
    new other_prints_1.RaichuAlolanRaichuGX4UNM(),
    new other_prints_1.MewtwoMewGX3UNM(),
    new other_prints_1.MegaSableyeTyranitarGX4UNM(),
    new other_prints_1.GarchompGiratinaGX3UNM(),
    new other_prints_1.CherishBall3UNM(),
    new other_prints_1.KarateBelt2UNM(),
    new other_prints_1.ResetStamp3UNM(),
    new other_prints_1.TagSwitch2UNM(),
    new other_prints_1.UTurnBoard2UNM(),
    new other_prints_1.ViridianForestUNM(),
    new other_prints_1.RecycleEnergyN12UNM(),
    new other_prints_1.WeaknessGuardEnergy2UNM(),
    new other_prints_1.CherishBall2UNM(),
    new other_prints_1.ResetStamp2UNM(),
    new other_prints_1.Litwick2(),
    new other_prints_1.JirachiGx2(),
    new other_prints_1.HeatranGx2(),
    new other_prints_1.LatiosGx2(),
    new other_prints_1.AerodactylGx2(),
    new other_prints_1.MawileGx2(),
    new other_prints_1.DragoniteGx2(),
    new other_prints_1.NaganadelGx2(),
    new other_prints_1.BluesTactics2(),
    new other_prints_1.Channeler2(),
    new other_prints_1.CoachTrainer2(),
    new other_prints_1.PokeManiac2(),
    new other_prints_1.HeatranGx3(),
    new other_prints_1.LatiosGx3(),
    new other_prints_1.AerodactylGx3(),
    new other_prints_1.MawileGx3(),
    new other_prints_1.DragoniteGx3(),
    new other_prints_1.NaganadelGx3(),
    new other_prints_1.GiantBomb2(),
];

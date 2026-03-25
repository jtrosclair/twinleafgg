"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCosmicEclipse = void 0;
const absol_1 = require("./absol");
const aipom_1 = require("./aipom");
const alolan_grimer_1 = require("./alolan-grimer");
const alolan_meowth_1 = require("./alolan-meowth");
const alolan_muk_1 = require("./alolan-muk");
const alolan_ninetales_1 = require("./alolan-ninetales");
const alolan_persian_gx_1 = require("./alolan-persian-gx");
const alolan_sandshrew_1 = require("./alolan-sandshrew");
const alolan_sandslash_1 = require("./alolan-sandslash");
const alolan_vulpix_1 = require("./alolan-vulpix");
const ambipom_1 = require("./ambipom");
const anorith_1 = require("./anorith");
const araquanid_1 = require("./araquanid");
const arceus_dialga_palkia_gx_1 = require("./arceus-dialga-palkia-gx");
const armaldo_1 = require("./armaldo");
const azurill_1 = require("./azurill");
const bewear_1 = require("./bewear");
const bisharp_1 = require("./bisharp");
const blacephalon_1 = require("./blacephalon");
const black_kyurem_1 = require("./black-kyurem");
const blastoise_piplup_gx_1 = require("./blastoise-piplup-gx");
const braviary_1 = require("./braviary");
const buzzwole_1 = require("./buzzwole");
const carvanha_1 = require("./carvanha");
const charizard_braixen_gx_1 = require("./charizard-braixen-gx");
const chinchou_1 = require("./chinchou");
const clefairy_1 = require("./clefairy");
const cosmoem_1 = require("./cosmoem");
const cosmog_1 = require("./cosmog");
const cosmog_2_1 = require("./cosmog-2");
const cottonee_1 = require("./cottonee");
const crabominable_1 = require("./crabominable");
const crabrawler_1 = require("./crabrawler");
const cradily_1 = require("./cradily");
const dartrix_1 = require("./dartrix");
const decidueye_1 = require("./decidueye");
const deerling_1 = require("./deerling");
const dewpider_1 = require("./dewpider");
const dhelmise_1 = require("./dhelmise");
const dragalge_1 = require("./dragalge");
const drampa_1 = require("./drampa");
const drilbur_1 = require("./drilbur");
const ducklett_1 = require("./ducklett");
const dusclops_1 = require("./dusclops");
const dusknoir_1 = require("./dusknoir");
const duskull_1 = require("./duskull");
const eevee_1 = require("./eevee");
const eevee_2_1 = require("./eevee-2");
const emboar_1 = require("./emboar");
const empoleon_1 = require("./empoleon");
const entei_1 = require("./entei");
const excadrill_1 = require("./excadrill");
const flabebe_1 = require("./flabebe");
const flabebe_2_1 = require("./flabebe-2");
const flareon_1 = require("./flareon");
const floette_1 = require("./floette");
const florges_1 = require("./florges");
const flygon_gx_1 = require("./flygon-gx");
const gallade_1 = require("./gallade");
const glalie_1 = require("./glalie");
const gloom_1 = require("./gloom");
const golduck_1 = require("./golduck");
const golett_1 = require("./golett");
const golurk_1 = require("./golurk");
const groudon_1 = require("./groudon");
const guzzlord_1 = require("./guzzlord");
const hakamo_o_1 = require("./hakamo-o");
const heliolisk_1 = require("./heliolisk");
const helioptile_1 = require("./helioptile");
const heracross_1 = require("./heracross");
const herdier_1 = require("./herdier");
const igglybuff_1 = require("./igglybuff");
const jangmo_o_1 = require("./jangmo-o");
const jangmo_o_2_1 = require("./jangmo-o-2");
const jolteon_1 = require("./jolteon");
const kirlia_1 = require("./kirlia");
const koffing_1 = require("./koffing");
const kommo_o_1 = require("./kommo-o");
const kricketot_1 = require("./kricketot");
const kricketune_1 = require("./kricketune");
const kyogre_1 = require("./kyogre");
const lanturn_1 = require("./lanturn");
const larvesta_1 = require("./larvesta");
const lileep_1 = require("./lileep");
const lillipup_1 = require("./lillipup");
const litleo_1 = require("./litleo");
const lunala_1 = require("./lunala");
const lycanroc_1 = require("./lycanroc");
const magcargo_1 = require("./magcargo");
const magnemite_1 = require("./magnemite");
const magneton_1 = require("./magneton");
const marshadow_1 = require("./marshadow");
const mawile_1 = require("./mawile");
const mega_lopuny_and_jigglypuff_gx_1 = require("./mega-lopuny-and-jigglypuff-gx");
const mimikyu_1 = require("./mimikyu");
const mimikyu_2_1 = require("./mimikyu-2");
const naganadel_guzzlord_gx_1 = require("./naganadel-guzzlord-gx");
const natu_1 = require("./natu");
const nosepass_1 = require("./nosepass");
const oddish_1 = require("./oddish");
const onix_1 = require("./onix");
const oricorio_gx_1 = require("./oricorio-gx");
const palossand_1 = require("./palossand");
const palpitoad_1 = require("./palpitoad");
const pancham_1 = require("./pancham");
const pangoro_1 = require("./pangoro");
const passimian_1 = require("./passimian");
const pawniard_1 = require("./pawniard");
const phantump_1 = require("./phantump");
const phione_1 = require("./phione");
const pignite_1 = require("./pignite");
const pikachu_1 = require("./pikachu");
const piplup_1 = require("./piplup");
const ponyta_1 = require("./ponyta");
const prinplup_1 = require("./prinplup");
const probopass_1 = require("./probopass");
const psyduck_1 = require("./psyduck");
const pyroar_1 = require("./pyroar");
const raichu_1 = require("./raichu");
const ralts_1 = require("./ralts");
const rapidash_1 = require("./rapidash");
const reshiram_and_zekrom_gx_1 = require("./reshiram-and-zekrom-gx");
const rockruff_1 = require("./rockruff");
const rotom_1 = require("./rotom");
const rowlet_1 = require("./rowlet");
const rowlet_2_1 = require("./rowlet-2");
const rufflet_1 = require("./rufflet");
const sandygast_1 = require("./sandygast");
const sawsbuck_1 = require("./sawsbuck");
const sealeo_1 = require("./sealeo");
const seismitoad_1 = require("./seismitoad");
const silvally_gx_1 = require("./silvally-gx");
const skrelp_1 = require("./skrelp");
const slugma_1 = require("./slugma");
const slurpuff_1 = require("./slurpuff");
const sneasel_1 = require("./sneasel");
const snorunt_1 = require("./snorunt");
const solgaleo_1 = require("./solgaleo");
const solgaleo_and_lunala_gx_1 = require("./solgaleo-and-lunala-gx");
const spheal_1 = require("./spheal");
const spheal_2_1 = require("./spheal-2");
const steelix_1 = require("./steelix");
const stoutland_1 = require("./stoutland");
const stufful_1 = require("./stufful");
const sunflora_1 = require("./sunflora");
const sunkern_1 = require("./sunkern");
const swanna_1 = require("./swanna");
const swirlix_1 = require("./swirlix");
const swoobat_1 = require("./swoobat");
const sylveon_1 = require("./sylveon");
const tangela_1 = require("./tangela");
const tangrowth_1 = require("./tangrowth");
const teddiursa_1 = require("./teddiursa");
const tepig_1 = require("./tepig");
const throh_1 = require("./throh");
const togedemaru_1 = require("./togedemaru");
const togedemaru_2_1 = require("./togedemaru-2");
const togepi_cleffa_igglybuff_gx_1 = require("./togepi-cleffa-igglybuff-gx");
const torkoal_1 = require("./torkoal");
const trapinch_1 = require("./trapinch");
const trapinch_2_1 = require("./trapinch-2");
const trevenant_1 = require("./trevenant");
const tropius_1 = require("./tropius");
const tympole_1 = require("./tympole");
const type_null_1 = require("./type-null");
const ultra_necrozma_1 = require("./ultra-necrozma");
const ursaring_1 = require("./ursaring");
const vaporeon_1 = require("./vaporeon");
const venusaur_and_snivy_gx_1 = require("./venusaur-and-snivy-gx");
const vibrava_1 = require("./vibrava");
const victini_1 = require("./victini");
const vileplume_gx_1 = require("./vileplume-gx");
const volcarona_gx_1 = require("./volcarona-gx");
const wailmer_1 = require("./wailmer");
const wailord_1 = require("./wailord");
const walrein_1 = require("./walrein");
const weavile_1 = require("./weavile");
const weezing_1 = require("./weezing");
const whimsicott_1 = require("./whimsicott");
const wishiwashi_1 = require("./wishiwashi");
const wishiwashi_gx_1 = require("./wishiwashi-gx");
const woobat_1 = require("./woobat");
const xatu_1 = require("./xatu");
const zangoose_1 = require("./zangoose");
const beastite_1 = require("./beastite");
const bellelba_and_brycen_man_1 = require("./bellelba-and-brycen-man");
const chaotic_swell_1 = require("./chaotic-swell");
const clay_1 = require("./clay");
const cynthia_and_caitlin_1 = require("./cynthia-and-caitlin");
const dragonium_z_1 = require("./dragonium-z");
const erika_1 = require("./erika");
const great_catcher_1 = require("./great-catcher");
const guzma_and_hala_1 = require("./guzma-and-hala");
const island_challenge_amulet_1 = require("./island-challenge-amulet");
const lanas_fishing_rod_1 = require("./lanas-fishing-rod");
const lillies_full_force_1 = require("./lillies-full-force");
const lillies_poke_doll_1 = require("./lillies-poke-doll");
const mallow_and_lana_1 = require("./mallow-and-lana");
const misty_and_lorelei_1 = require("./misty-and-lorelei");
const ns_resolve_1 = require("./ns-resolve");
const professor_oaks_setup_1 = require("./professor-oaks-setup");
const red_and_blue_1 = require("./red-and-blue");
const roller_skater_1 = require("./roller-skater");
const rosa_1 = require("./rosa");
const roxie_1 = require("./roxie");
const tag_call_1 = require("./tag-call");
const will_1 = require("./will");
const draw_energy_1 = require("./draw-energy");
const other_prints_1 = require("./other-prints");
exports.setCosmicEclipse = [
    // Pokemon
    new absol_1.Absol(),
    new aipom_1.Aipom(),
    new alolan_grimer_1.AlolanGrimer(),
    new alolan_meowth_1.AlolanMeowth(),
    new alolan_muk_1.AlolanMuk(),
    new alolan_ninetales_1.AlolanNinetales(),
    new alolan_persian_gx_1.AlolanPersianGX(),
    new alolan_sandshrew_1.AlolanSandshrew(),
    new alolan_sandslash_1.AlolanSandslash(),
    new alolan_vulpix_1.AlolanVulpix(),
    new ambipom_1.Ambipom(),
    new anorith_1.Anorith(),
    new araquanid_1.Araquanid(),
    new arceus_dialga_palkia_gx_1.ArceusDialgaPalkiaGX(),
    new armaldo_1.Armaldo(),
    new azurill_1.Azurill(),
    new bewear_1.Bewear(),
    new bisharp_1.Bisharp(),
    new blacephalon_1.Blacephalon(),
    new black_kyurem_1.BlackKyurem(),
    new blastoise_piplup_gx_1.BlastoisePiplupGX(),
    new braviary_1.Braviary(),
    new buzzwole_1.Buzzwole(),
    new carvanha_1.Carvanha(),
    new charizard_braixen_gx_1.CharizardBraixenGX(),
    new chinchou_1.Chinchou(),
    new clefairy_1.Clefairy(),
    new cosmoem_1.Cosmoem(),
    new cosmog_1.Cosmog(),
    new cosmog_2_1.Cosmog2(),
    new cottonee_1.Cottonee(),
    new crabominable_1.Crabominable(),
    new crabrawler_1.Crabrawler(),
    new cradily_1.Cradily(),
    new dartrix_1.Dartrix(),
    new decidueye_1.Decidueye(),
    new deerling_1.Deerling(),
    new dewpider_1.Dewpider(),
    new dhelmise_1.Dhelmise(),
    new dragalge_1.Dragalge(),
    new drampa_1.Drampa(),
    new drilbur_1.Drilbur(),
    new ducklett_1.Ducklett(),
    new dusclops_1.Dusclops(),
    new dusknoir_1.Dusknoir(),
    new duskull_1.Duskull(),
    new eevee_1.Eevee(),
    new eevee_2_1.Eevee2(),
    new emboar_1.Emboar(),
    new empoleon_1.Empoleon(),
    new entei_1.Entei(),
    new excadrill_1.Excadrill(),
    new flabebe_1.Flabebe(),
    new flabebe_2_1.Flabebe2(),
    new flareon_1.Flareon(),
    new floette_1.Floette(),
    new florges_1.Florges(),
    new flygon_gx_1.FlygonGx(),
    new gallade_1.Gallade(),
    new glalie_1.Glalie(),
    new gloom_1.Gloom(),
    new golduck_1.Golduck(),
    new golett_1.Golett(),
    new golurk_1.Golurk(),
    new groudon_1.Groudon(),
    new guzzlord_1.Guzzlord(),
    new hakamo_o_1.HakamoO(),
    new heliolisk_1.Heliolisk(),
    new helioptile_1.Helioptile(),
    new heracross_1.Heracross(),
    new herdier_1.Herdier(),
    new igglybuff_1.Igglybuff(),
    new jangmo_o_1.JangmoO(),
    new jangmo_o_2_1.JangmoO2(),
    new jolteon_1.Jolteon(),
    new kirlia_1.Kirlia(),
    new koffing_1.Koffing(),
    new kommo_o_1.KommoO(),
    new kricketot_1.Kricketot(),
    new kricketune_1.Kricketune(),
    new kyogre_1.Kyogre(),
    new lanturn_1.Lanturn(),
    new larvesta_1.Larvesta(),
    new lileep_1.Lileep(),
    new lillipup_1.Lillipup(),
    new litleo_1.Litleo(),
    new lunala_1.Lunala(),
    new lycanroc_1.Lycanroc(),
    new magcargo_1.Magcargo(),
    new magnemite_1.Magnemite(),
    new magneton_1.Magneton(),
    new marshadow_1.Marshadow(),
    new mawile_1.Mawile(),
    new mega_lopuny_and_jigglypuff_gx_1.MegaLopunnyJigglypuffGX(),
    new mimikyu_1.Mimikyu(),
    new mimikyu_2_1.Mimikyu2(),
    new naganadel_guzzlord_gx_1.NaganadelGuzzlordGX(),
    new natu_1.Natu(),
    new nosepass_1.Nosepass(),
    new oddish_1.Oddish(),
    new onix_1.Onix(),
    new oricorio_gx_1.OricorioGX(),
    new palossand_1.Palossand(),
    new palpitoad_1.Palpitoad(),
    new pancham_1.Pancham(),
    new pangoro_1.Pangoro(),
    new passimian_1.Passimian(),
    new pawniard_1.Pawniard(),
    new phantump_1.Phantump(),
    new phione_1.Phione(),
    new pignite_1.Pignite(),
    new pikachu_1.Pikachu(),
    new piplup_1.Piplup(),
    new ponyta_1.Ponyta(),
    new prinplup_1.Prinplup(),
    new probopass_1.Probopass(),
    new psyduck_1.Psyduck(),
    new pyroar_1.Pyroar(),
    new raichu_1.Raichu(),
    new ralts_1.Ralts(),
    new rapidash_1.Rapidash(),
    new reshiram_and_zekrom_gx_1.ReshiramAndZekromGx(),
    new rockruff_1.Rockruff(),
    new rotom_1.Rotom(),
    new rowlet_1.Rowlet(),
    new rowlet_2_1.Rowlet2(),
    new rufflet_1.Rufflet(),
    new sandygast_1.Sandygast(),
    new sawsbuck_1.Sawsbuck(),
    new sealeo_1.Sealeo(),
    new seismitoad_1.Seismitoad(),
    new silvally_gx_1.SilvallyGx(),
    new skrelp_1.Skrelp(),
    new slugma_1.Slugma(),
    new slurpuff_1.Slurpuff(),
    new sneasel_1.Sneasel(),
    new snorunt_1.Snorunt(),
    new solgaleo_1.Solgaleo(),
    new solgaleo_and_lunala_gx_1.SolgaleoLunalaGX(),
    new spheal_1.Spheal(),
    new spheal_2_1.Spheal2(),
    new steelix_1.Steelix(),
    new stoutland_1.Stoutland(),
    new stufful_1.Stufful(),
    new sunflora_1.Sunflora(),
    new sunkern_1.Sunkern(),
    new swanna_1.Swanna(),
    new swirlix_1.Swirlix(),
    new swoobat_1.Swoobat(),
    new sylveon_1.Sylveon(),
    new tangela_1.Tangela(),
    new tangrowth_1.Tangrowth(),
    new teddiursa_1.Teddiursa(),
    new tepig_1.Tepig(),
    new throh_1.Throh(),
    new togedemaru_1.Togedemaru(),
    new togedemaru_2_1.Togedemaru2(),
    new togepi_cleffa_igglybuff_gx_1.TogepiCleffaIgglybuffGX(),
    new torkoal_1.Torkoal(),
    new trapinch_1.Trapinch(),
    new trapinch_2_1.Trapinch2(),
    new trevenant_1.Trevenant(),
    new tropius_1.Tropius(),
    new tympole_1.Tympole(),
    new type_null_1.TypeNull(),
    new ultra_necrozma_1.UltraNecrozma(),
    new ursaring_1.Ursaring(),
    new vaporeon_1.Vaporeon(),
    new venusaur_and_snivy_gx_1.VenusaurSnivyGX(),
    new vibrava_1.Vibrava(),
    new victini_1.Victini(),
    new vileplume_gx_1.VileplumeGX(),
    new volcarona_gx_1.VolcaronaGx(),
    new wailmer_1.Wailmer(),
    new wailord_1.Wailord(),
    new walrein_1.Walrein(),
    new weavile_1.Weavile(),
    new weezing_1.Weezing(),
    new whimsicott_1.Whimsicott(),
    new wishiwashi_1.Wishiwashi(),
    new wishiwashi_gx_1.WishiwashiGx(),
    new woobat_1.Woobat(),
    new xatu_1.Xatu(),
    new zangoose_1.Zangoose(),
    // Trainers
    new beastite_1.Beastite(),
    new bellelba_and_brycen_man_1.BellelbaAndBrycenMan(),
    new chaotic_swell_1.ChaoticSwell(),
    new clay_1.Clay(),
    new cynthia_and_caitlin_1.CynthiaAndCaitlin(),
    new dragonium_z_1.DragoniumZDragonClaw(),
    new erika_1.Erika(),
    new great_catcher_1.GreatCatcher(),
    new guzma_and_hala_1.GuzmaAndHala(),
    new island_challenge_amulet_1.IslandChallengeAmulet(),
    new lanas_fishing_rod_1.LanasFishingRod(),
    new lillies_full_force_1.LilliesFullForce(),
    new lillies_poke_doll_1.LilliesPokeDoll(),
    new mallow_and_lana_1.MallowAndLana(),
    new misty_and_lorelei_1.MistyAndLorelei(),
    new ns_resolve_1.NsResolve(),
    new professor_oaks_setup_1.ProfessorOaksSetup(),
    new red_and_blue_1.RedAndBlue(),
    new roller_skater_1.RollerSkater(),
    new rosa_1.Rosa(),
    new roxie_1.Roxie(),
    new tag_call_1.TagCall(),
    new will_1.Will(),
    // Energy
    new draw_energy_1.DrawEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.GuzmaAndHalaCEC(),
    new other_prints_1.UnidentifiedFossilCEC(),
    new other_prints_1.VenusaurSnivyGX2CEC(),
    new other_prints_1.VileplumeGX2CEC(),
    new other_prints_1.CharizardBraixenGX2CEC(),
    new other_prints_1.BlastoisePiplupGX2CEC(),
    new other_prints_1.BlastoisePiplupGX3CEC(),
    new other_prints_1.SolgaleoLunalaGX2CEC(),
    new other_prints_1.OricorioGX2CEC(),
    new other_prints_1.AlolanPersianGX2CEC(),
    new other_prints_1.ArceusDialgaPalkiaGX2CEC(),
    new other_prints_1.ArceusDialgaPalkiaGX3CEC(),
    new other_prints_1.NaganadelGuzzlordGX2CEC(),
    new other_prints_1.NaganadelGuzzlordGX3CEC(),
    new other_prints_1.MegaLopunnyJigglypuffGX2CEC(),
    new other_prints_1.MegaLopunnyJigglypuffGX3CEC(),
    new other_prints_1.CynthiaAndCaitlin2CEC(),
    new other_prints_1.LilliesFullForce2CEC(),
    new other_prints_1.MallowAndLana2CEC(),
    new other_prints_1.ProfessorOaksSetup2CEC(),
    new other_prints_1.Rosa2CEC(),
    new other_prints_1.Wishiwashi2CEC(),
    new other_prints_1.Pikachu2CEC(),
    new other_prints_1.Koffing2CEC(),
    new other_prints_1.Mimikyu3CEC(),
    new other_prints_1.Excadrill2CEC(),
    new other_prints_1.Steelix2CEC(),
    new other_prints_1.Stoutland2CEC(),
    new other_prints_1.VenusaurSnivyGX3CEC(),
    new other_prints_1.VileplumeGX3CEC(),
    new other_prints_1.CharizardBraixenGX3CEC(),
    new other_prints_1.BlastoisePiplupGX4CEC(),
    new other_prints_1.SolgaleoLunalaGX3CEC(),
    new other_prints_1.OricorioGX3CEC(),
    new other_prints_1.AlolanPersianGX3CEC(),
    new other_prints_1.ArceusDialgaPalkiaGX4CEC(),
    new other_prints_1.NaganadelGuzzlordGX4CEC(),
    new other_prints_1.MegaLopunnyJigglypuffGX4CEC(),
    new other_prints_1.GiantHearthCEC(),
    new other_prints_1.GreatCatcher2CEC(),
    new other_prints_1.LanasFishingRod2CEC(),
    new other_prints_1.LilliesPokeDoll2CEC(),
    new other_prints_1.MartialArtsDojoCEC(),
    new other_prints_1.PowerPlantCEC(),
    new other_prints_1.TagCall2CEC(),
    new other_prints_1.DrawEnergy2CEC(),
    new other_prints_1.TogepiCleffaIgglybuffGX2CEC(),
    new other_prints_1.VolcaronaGx2(),
    new other_prints_1.FlygonGx2(),
    new other_prints_1.ReshiramAndZekromGx2(),
    new other_prints_1.SilvallyGx2(),
    new other_prints_1.NsResolve2(),
    new other_prints_1.RedAndBlue2(),
    new other_prints_1.RollerSkater2(),
    new other_prints_1.Torkoal2(),
    new other_prints_1.Weavile2(),
    new other_prints_1.Piplup2(),
    new other_prints_1.Magnemite2(),
    new other_prints_1.Gallade2(),
    new other_prints_1.VolcaronaGx3(),
    new other_prints_1.FlygonGx3(),
    new other_prints_1.ReshiramAndZekromGx3(),
    new other_prints_1.SilvallyGx3(),
    new other_prints_1.IslandChallengeAmulet2(),
];

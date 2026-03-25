"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFusionStrike = void 0;
const absol_1 = require("./absol");
const accelgor_1 = require("./accelgor");
const appletun_v_1 = require("./appletun-v");
const araquanid_1 = require("./araquanid");
const arcanine_1 = require("./arcanine");
const arrokuda_1 = require("./arrokuda");
const azumarill_1 = require("./azumarill");
const baltoy_1 = require("./baltoy");
const barraskewda_1 = require("./barraskewda");
const basculin_1 = require("./basculin");
const bewear_1 = require("./bewear");
const blissey_1 = require("./blissey");
const boltund_v_1 = require("./boltund-v");
const boltund_vmax_1 = require("./boltund-vmax");
const breloom_1 = require("./breloom");
const breloom_v_1 = require("./breloom-v");
const buneary_1 = require("./buneary");
const bunnelby_1 = require("./bunnelby");
const butterfree_1 = require("./butterfree");
const caterpie_1 = require("./caterpie");
const centiskorch_1 = require("./centiskorch");
const centiskorch_2_1 = require("./centiskorch-2");
const chandelure_v_1 = require("./chandelure-v");
const chandelure_vmax_1 = require("./chandelure-vmax");
const chansey_1 = require("./chansey");
const charjabug_1 = require("./charjabug");
const chewtle_1 = require("./chewtle");
const cinderace_v_1 = require("./cinderace-v");
const cinderace_v_2_1 = require("./cinderace-v-2");
const cinderace_vmax_1 = require("./cinderace-vmax");
const clamperl_1 = require("./clamperl");
const clauncher_1 = require("./clauncher");
const clawitzer_1 = require("./clawitzer");
const claydol_1 = require("./claydol");
const clobbopus_1 = require("./clobbopus");
const cloyster_1 = require("./cloyster");
const copperajah_1 = require("./copperajah");
const corviknight_1 = require("./corviknight");
const corvisquire_1 = require("./corvisquire");
const crabominable_v_1 = require("./crabominable-v");
const croagunk_1 = require("./croagunk");
const croconaw_1 = require("./croconaw");
const cufant_1 = require("./cufant");
const darkrai_1 = require("./darkrai");
const delcatty_1 = require("./delcatty");
const deoxys_1 = require("./deoxys");
const dewpider_1 = require("./dewpider");
const diggersby_1 = require("./diggersby");
const dodrio_v_1 = require("./dodrio-v");
const dragapult_1 = require("./dragapult");
const drakloak_1 = require("./drakloak");
const drednaw_1 = require("./drednaw");
const dreepy_1 = require("./dreepy");
const drilbur_1 = require("./drilbur");
const dubwool_1 = require("./dubwool");
const dunsparce_1 = require("./dunsparce");
const durant_1 = require("./durant");
const eelektrik_1 = require("./eelektrik");
const eelektross_1 = require("./eelektross");
const eevee_1 = require("./eevee");
const eldegoss_1 = require("./eldegoss");
const electrode_1 = require("./electrode");
const espeon_vmax_1 = require("./espeon-vmax");
const excadrill_1 = require("./excadrill");
const falinks_1 = require("./falinks");
const falinks_2_1 = require("./falinks-2");
const feraligatr_1 = require("./feraligatr");
const flaaffy_1 = require("./flaaffy");
const frosmoth_1 = require("./frosmoth");
const full_art_1 = require("./full-art");
const galarian_corsola_1 = require("./galarian-corsola");
const galarian_cursola_1 = require("./galarian-cursola");
const galarian_darmanitan_1 = require("./galarian-darmanitan");
const galarian_darumaka_1 = require("./galarian-darumaka");
const galarian_linoone_1 = require("./galarian-linoone");
const galarian_meowth_1 = require("./galarian-meowth");
const galarian_obstagoon_1 = require("./galarian-obstagoon");
const galarian_perrserker_1 = require("./galarian-perrserker");
const galarian_zigzagoon_1 = require("./galarian-zigzagoon");
const garbodor_1 = require("./garbodor");
const genesect_v_1 = require("./genesect-v");
const gengar_v_1 = require("./gengar-v");
const gengar_vmax_1 = require("./gengar-vmax");
const geodude_1 = require("./geodude");
const gligar_1 = require("./gligar");
const gliscor_1 = require("./gliscor");
const golem_1 = require("./golem");
const goodra_1 = require("./goodra");
const goomy_1 = require("./goomy");
const gorebyss_1 = require("./gorebyss");
const granbull_1 = require("./granbull");
const grapploct_1 = require("./grapploct");
const graveler_1 = require("./graveler");
const greedent_v_1 = require("./greedent-v");
const greedent_vmax_1 = require("./greedent-vmax");
const greninja_v_1 = require("./greninja-v");
const grimmsnarl_1 = require("./grimmsnarl");
const growlithe_1 = require("./growlithe");
const grubbin_1 = require("./grubbin");
const hariyama_1 = require("./hariyama");
const hawlucha_1 = require("./hawlucha");
const heatmor_1 = require("./heatmor");
const heliolisk_1 = require("./heliolisk");
const helioptile_1 = require("./helioptile");
const hoopa_v_1 = require("./hoopa-v");
const huntail_1 = require("./huntail");
const impidimp_1 = require("./impidimp");
const indeedee_1 = require("./indeedee");
const inteleon_v_1 = require("./inteleon-v");
const inteleon_vmax_1 = require("./inteleon-vmax");
const jigglypuff_1 = require("./jigglypuff");
const jynx_1 = require("./jynx");
const kangaskhan_1 = require("./kangaskhan");
const klefki_1 = require("./klefki");
const landorus_1 = require("./landorus");
const lapras_1 = require("./lapras");
const latias_1 = require("./latias");
const latios_1 = require("./latios");
const leavanny_1 = require("./leavanny");
const lopunny_1 = require("./lopunny");
const lucario_v_1 = require("./lucario-v");
const luxio_1 = require("./luxio");
const luxray_1 = require("./luxray");
const magcargo_1 = require("./magcargo");
const makuhita_1 = require("./makuhita");
const mandibuzz_1 = require("./mandibuzz");
const mantine_1 = require("./mantine");
const maractus_1 = require("./maractus");
const marill_1 = require("./marill");
const marshtomp_1 = require("./marshtomp");
const mawile_1 = require("./mawile");
const melmetal_1 = require("./melmetal");
const meloetta_1 = require("./meloetta");
const meltan_1 = require("./meltan");
const meowth_1 = require("./meowth");
const metapod_1 = require("./metapod");
const mew_v_1 = require("./mew-v");
const mew_vmax_1 = require("./mew-vmax");
const minun_1 = require("./minun");
const morgrem_1 = require("./morgrem");
const morpeko_2_1 = require("./morpeko-2");
const mudkip_1 = require("./mudkip");
const munna_1 = require("./munna");
const musharna_1 = require("./musharna");
const ninetales_1 = require("./ninetales");
const ninetales_2_1 = require("./ninetales-2");
const onix_1 = require("./onix");
const oricorio_1 = require("./oricorio");
const palossand_1 = require("./palossand");
const pancham_1 = require("./pancham");
const pangoro_1 = require("./pangoro");
const panpour_1 = require("./panpour");
const pansage_1 = require("./pansage");
const pansear_1 = require("./pansear");
const persian_1 = require("./persian");
const phantump_1 = require("./phantump");
const pikachu_v_1 = require("./pikachu-v");
const plusle_1 = require("./plusle");
const primeape_1 = require("./primeape");
const pyukumuku_1 = require("./pyukumuku");
const qwilfish_1 = require("./qwilfish");
const rillaboom_v_1 = require("./rillaboom-v");
const rillaboom_vmax_1 = require("./rillaboom-vmax");
const rookidee_1 = require("./rookidee");
const rotom_1 = require("./rotom");
const sandaconda_v_1 = require("./sandaconda-v");
const sandshrew_1 = require("./sandshrew");
const sandslash_1 = require("./sandslash");
const sandygast_1 = require("./sandygast");
const sewaddle_1 = require("./sewaddle");
const sharpedo_1 = require("./sharpedo");
const shellder_1 = require("./shellder");
const shelmet_1 = require("./shelmet");
const shinx_1 = require("./shinx");
const shroomish_1 = require("./shroomish");
const sigilyph_1 = require("./sigilyph");
const simipour_1 = require("./simipour");
const simisage_1 = require("./simisage");
const simisear_1 = require("./simisear");
const sizzlipede_1 = require("./sizzlipede");
const sizzlipede_2_1 = require("./sizzlipede-2");
const skarmory_1 = require("./skarmory");
const skitty_1 = require("./skitty");
const sliggoo_1 = require("./sliggoo");
const slugma_1 = require("./slugma");
const smeargle_1 = require("./smeargle");
const snom_1 = require("./snom");
const snorlax_1 = require("./snorlax");
const snubbull_1 = require("./snubbull");
const stantler_1 = require("./stantler");
const starmie_1 = require("./starmie");
const staryu_1 = require("./staryu");
const steelix_1 = require("./steelix");
const stufful_1 = require("./stufful");
const swadloon_1 = require("./swadloon");
const swampert_1 = require("./swampert");
const togedemaru_1 = require("./togedemaru");
const totodile_1 = require("./totodile");
const toxel_1 = require("./toxel");
const toxel_2_1 = require("./toxel-2");
const toxicroak_1 = require("./toxicroak");
const toxtricity_1 = require("./toxtricity");
const toxtricity_2_1 = require("./toxtricity-2");
const trevenant_1 = require("./trevenant");
const trubbish_1 = require("./trubbish");
const tsareena_v_1 = require("./tsareena-v");
const turtonator_1 = require("./turtonator");
const tynamo_1 = require("./tynamo");
const tyranitar_v_1 = require("./tyranitar-v");
const victini_1 = require("./victini");
const vikavolt_1 = require("./vikavolt");
const virizion_1 = require("./virizion");
const voltorb_1 = require("./voltorb");
const vullaby_1 = require("./vullaby");
const vulpix_1 = require("./vulpix");
const vulpix_2_1 = require("./vulpix-2");
const wigglytuff_1 = require("./wigglytuff");
const wooloo_1 = require("./wooloo");
const wooloo_2_1 = require("./wooloo-2");
const yveltal_1 = require("./yveltal");
const zarude_1 = require("./zarude");
const zeraora_1 = require("./zeraora");
const zoroark_1 = require("./zoroark");
const zorua_1 = require("./zorua");
const adventurers_discovery_1 = require("./adventurers-discovery");
const battle_vip_pass_1 = require("./battle-vip-pass");
const chili_and_cilan_and_cress_1 = require("./chili-and-cilan-and-cress");
const cook_1 = require("./cook");
const cram_o_matic_1 = require("./cram-o-matic");
const cross_switcher_1 = require("./cross-switcher");
const crossceiver_1 = require("./crossceiver");
const dancer_1 = require("./dancer");
const elesas_sparkle_1 = require("./elesas-sparkle");
const farewell_bell_1 = require("./farewell-bell");
const judge_1 = require("./judge");
const power_tablet_1 = require("./power-tablet");
const schoolboy_1 = require("./schoolboy");
const schoolgirl_1 = require("./schoolgirl");
const shauna_1 = require("./shauna");
const sidney_1 = require("./sidney");
const skaters_park_1 = require("./skaters-park");
const spongy_gloves_1 = require("./spongy-gloves");
const fusion_strike_energy_1 = require("./fusion-strike-energy");
const other_prints_1 = require("./other-prints");
exports.setFusionStrike = [
    // Pokemon
    new absol_1.Absol(),
    new accelgor_1.Accelgor(),
    new appletun_v_1.AppletunV(),
    new araquanid_1.Araquanid(),
    new arcanine_1.Arcanine(),
    new arrokuda_1.Arrokuda(),
    new azumarill_1.Azumarill(),
    new baltoy_1.Baltoy(),
    new barraskewda_1.Barraskewda(),
    new basculin_1.Basculin(),
    new bewear_1.Bewear(),
    new blissey_1.Blissey(),
    new boltund_v_1.BoltundV(),
    new boltund_vmax_1.BoltundVmax(),
    new breloom_1.Breloom(),
    new breloom_v_1.BreloomV(),
    new buneary_1.Buneary(),
    new bunnelby_1.Bunnelby(),
    new butterfree_1.Butterfree(),
    new caterpie_1.Caterpie(),
    new centiskorch_1.Centiskorch(),
    new centiskorch_2_1.Centiskorch2(),
    new chandelure_v_1.ChandelureV(),
    new chandelure_vmax_1.ChandelureVmax(),
    new chansey_1.Chansey(),
    new charjabug_1.Charjabug(),
    new chewtle_1.Chewtle(),
    new cinderace_v_1.CinderaceV(),
    new cinderace_v_2_1.CinderaceV2(),
    new cinderace_vmax_1.CinderaceVmax(),
    new clamperl_1.Clamperl(),
    new clauncher_1.Clauncher(),
    new clawitzer_1.Clawitzer(),
    new claydol_1.Claydol(),
    new clobbopus_1.Clobbopus(),
    new cloyster_1.Cloyster(),
    new copperajah_1.Copperajah(),
    new corviknight_1.Corviknight(),
    new corvisquire_1.Corvisquire(),
    new crabominable_v_1.CrabominableV(),
    new croagunk_1.Croagunk(),
    new croconaw_1.Croconaw(),
    new cufant_1.Cufant(),
    new darkrai_1.Darkrai(),
    new delcatty_1.Delcatty(),
    new deoxys_1.Deoxys(),
    new dewpider_1.Dewpider(),
    new diggersby_1.Diggersby(),
    new dodrio_v_1.DodrioV(),
    new dragapult_1.Dragapult(),
    new drakloak_1.Drakloak(),
    new drednaw_1.Drednaw(),
    new dreepy_1.Dreepy(),
    new drilbur_1.Drilbur(),
    new dubwool_1.Dubwool(),
    new dunsparce_1.Dunsparce(),
    new durant_1.Durant(),
    new eelektrik_1.Eelektrik(),
    new eelektross_1.Eelektross(),
    new eevee_1.Eevee(),
    new eldegoss_1.Eldegoss(),
    new electrode_1.Electrode(),
    new espeon_vmax_1.EspeonVmax(),
    new excadrill_1.Excadrill(),
    new falinks_1.Falinks(),
    new falinks_2_1.Falinks2(),
    new feraligatr_1.Feraligatr(),
    new flaaffy_1.Flaaffy(),
    new frosmoth_1.Frosmoth(),
    new full_art_1.CelebiVFA(),
    new galarian_corsola_1.GalarianCorsola(),
    new galarian_cursola_1.GalarianCursola(),
    new galarian_darmanitan_1.GalarianDarmanitan(),
    new galarian_darumaka_1.GalarianDarumaka(),
    new galarian_linoone_1.GalarianLinoone(),
    new galarian_meowth_1.GalarianMeowth(),
    new galarian_obstagoon_1.GalarianObstagoon(),
    new galarian_perrserker_1.GalarianPerrserker(),
    new galarian_zigzagoon_1.GalarianZigzagoon(),
    new garbodor_1.Garbodor(),
    new genesect_v_1.GenesectV(),
    new gengar_v_1.GengarV(),
    new gengar_vmax_1.GengarVMAX(),
    new geodude_1.Geodude(),
    new gligar_1.Gligar(),
    new gliscor_1.Gliscor(),
    new golem_1.Golem(),
    new goodra_1.Goodra(),
    new goomy_1.Goomy(),
    new gorebyss_1.Gorebyss(),
    new granbull_1.Granbull(),
    new grapploct_1.Grapploct(),
    new graveler_1.Graveler(),
    new greedent_v_1.GreedentV(),
    new greedent_vmax_1.GreedentVMAX(),
    new greninja_v_1.GreninjaV(),
    new grimmsnarl_1.Grimmsnarl(),
    new growlithe_1.Growlithe(),
    new grubbin_1.Grubbin(),
    new hariyama_1.Hariyama(),
    new hawlucha_1.Hawlucha(),
    new heatmor_1.Heatmor(),
    new heliolisk_1.Heliolisk(),
    new helioptile_1.Helioptile(),
    new hoopa_v_1.HoopaV(),
    new huntail_1.Huntail(),
    new impidimp_1.Impidimp(),
    new indeedee_1.Indeedee(),
    new inteleon_v_1.InteleonV(),
    new inteleon_vmax_1.InteleonVMAX(),
    new jigglypuff_1.Jigglypuff(),
    new jynx_1.Jynx(),
    new kangaskhan_1.Kangaskhan(),
    new klefki_1.Klefki(),
    new landorus_1.Landorus(),
    new lapras_1.Lapras(),
    new latias_1.Latias(),
    new latios_1.Latios(),
    new leavanny_1.Leavanny(),
    new lopunny_1.Lopunny(),
    new lucario_v_1.LucarioV(),
    new luxio_1.Luxio(),
    new luxray_1.Luxray(),
    new magcargo_1.Magcargo(),
    new makuhita_1.Makuhita(),
    new mandibuzz_1.Mandibuzz(),
    new mantine_1.Mantine(),
    new maractus_1.Maractus(),
    new marill_1.Marill(),
    new marshtomp_1.Marshtomp(),
    new mawile_1.Mawile(),
    new melmetal_1.Melmetal(),
    new meloetta_1.Meloetta(),
    new meltan_1.Meltan(),
    new meowth_1.Meowth(),
    new metapod_1.Metapod(),
    new mew_v_1.MewV(),
    new mew_vmax_1.MewVMAX(),
    new minun_1.Minun(),
    new morgrem_1.Morgrem(),
    new morpeko_2_1.Morpeko2(),
    new mudkip_1.Mudkip(),
    new munna_1.Munna(),
    new musharna_1.Musharna(),
    new ninetales_1.Ninetales(),
    new ninetales_2_1.Ninetales2(),
    new onix_1.Onix(),
    new oricorio_1.Oricorio(),
    new palossand_1.Palossand(),
    new pancham_1.Pancham(),
    new pangoro_1.Pangoro(),
    new panpour_1.Panpour(),
    new pansage_1.Pansage(),
    new pansear_1.Pansear(),
    new persian_1.Persian(),
    new phantump_1.Phantump(),
    new pikachu_v_1.PikachuV(),
    new plusle_1.Plusle(),
    new primeape_1.Primeape(),
    new pyukumuku_1.Pyukumuku(),
    new qwilfish_1.Qwilfish(),
    new rillaboom_v_1.RillaboomV(),
    new rillaboom_vmax_1.RillaboomVmax(),
    new rookidee_1.Rookidee(),
    new rotom_1.Rotom(),
    new sandaconda_v_1.SandacondaV(),
    new sandshrew_1.Sandshrew(),
    new sandslash_1.Sandslash(),
    new sandygast_1.Sandygast(),
    new sewaddle_1.Sewaddle(),
    new sharpedo_1.Sharpedo(),
    new shellder_1.Shellder(),
    new shelmet_1.Shelmet(),
    new shinx_1.Shinx(),
    new shroomish_1.Shroomish(),
    new sigilyph_1.Sigilyph(),
    new simipour_1.Simipour(),
    new simisage_1.Simisage(),
    new simisear_1.Simisear(),
    new sizzlipede_1.Sizzlipede(),
    new sizzlipede_2_1.Sizzlipede2(),
    new skarmory_1.Skarmory(),
    new skitty_1.Skitty(),
    new sliggoo_1.Sliggoo(),
    new slugma_1.Slugma(),
    new smeargle_1.Smeargle(),
    new snom_1.Snom(),
    new snorlax_1.Snorlax(),
    new snubbull_1.Snubbull(),
    new stantler_1.Stantler(),
    new starmie_1.Starmie(),
    new staryu_1.Staryu(),
    new steelix_1.Steelix(),
    new stufful_1.Stufful(),
    new swadloon_1.Swadloon(),
    new swampert_1.Swampert(),
    new togedemaru_1.Togedemaru(),
    new totodile_1.Totodile(),
    new toxel_1.Toxel(),
    new toxel_2_1.Toxel2(),
    new toxicroak_1.Toxicroak(),
    new toxtricity_1.Toxtricity(),
    new toxtricity_2_1.Toxtricity2(),
    new trevenant_1.Trevenant(),
    new trubbish_1.Trubbish(),
    new tsareena_v_1.TsareenaV(),
    new turtonator_1.Turtonator(),
    new tynamo_1.Tynamo(),
    new tyranitar_v_1.TyranitarV(),
    new victini_1.Victini(),
    new vikavolt_1.Vikavolt(),
    new virizion_1.Virizion(),
    new voltorb_1.Voltorb(),
    new vullaby_1.Vullaby(),
    new vulpix_1.Vulpix(),
    new vulpix_2_1.Vulpix2(),
    new wigglytuff_1.Wigglytuff(),
    new wooloo_1.Wooloo(),
    new wooloo_2_1.Wooloo2(),
    new yveltal_1.Yveltal(),
    new zarude_1.Zarude(),
    new zeraora_1.Zeraora(),
    new zoroark_1.Zoroark(),
    new zorua_1.Zorua(),
    // Trainers
    new adventurers_discovery_1.AdventurersDiscovery(),
    new battle_vip_pass_1.BattleVIPPass(),
    new chili_and_cilan_and_cress_1.ChiliAndCilanAndCress(),
    new cook_1.Cook(),
    new cram_o_matic_1.Creamomatic(),
    new cross_switcher_1.CrossSwitcher(),
    new crossceiver_1.Crossceiver(),
    new dancer_1.Dancer(),
    new elesas_sparkle_1.ElesasSparkle(),
    new farewell_bell_1.FarewellBell(),
    new judge_1.Judge(),
    new power_tablet_1.PowerTablet(),
    new schoolboy_1.Schoolboy(),
    new schoolgirl_1.Schoolgirl(),
    new shauna_1.Shauna(),
    new sidney_1.Sidney(),
    new skaters_park_1.SkatersPark(),
    new spongy_gloves_1.SpongyGloves(),
    // Energy
    new fusion_strike_energy_1.FusionStrikeEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.QuickBallFST(),
    new other_prints_1.GossifleurFST(),
    new other_prints_1.MankeyFST(),
    new other_prints_1.CarvanhaFST(),
    new other_prints_1.BugCatcherFST(),
    new other_prints_1.TsareenaV2(),
    new other_prints_1.ChandelureV2(),
    new other_prints_1.CrabominableV2(),
    new other_prints_1.BoltundV2(),
    new other_prints_1.MewV2(),
    new other_prints_1.MewV3(),
    new other_prints_1.GenesectV2(),
    new other_prints_1.GenesectV3(),
    new other_prints_1.GreedentV2(),
    new other_prints_1.GreedentV3(),
    new other_prints_1.ChiliAndCilanAndCress2(),
    new other_prints_1.Dancer2(),
    new other_prints_1.ElesasSparkle2(),
    new other_prints_1.Schoolboy2(),
    new other_prints_1.Schoolgirl2(),
    new other_prints_1.Shauna2(),
    new other_prints_1.Sidney2(),
    new other_prints_1.ChandelureVmax2(),
    new other_prints_1.InteleonVmax2(),
    new other_prints_1.BoltundVmax2(),
    new other_prints_1.MewVmax2(),
    new other_prints_1.MewVmax3(),
    new other_prints_1.GengarVmax2(),
    new other_prints_1.GreedentVmax2(),
    new other_prints_1.ChiliAndCilanAndCress3(),
    new other_prints_1.Dancer3(),
    new other_prints_1.ElesasSparkle3(),
    new other_prints_1.Schoolboy3(),
    new other_prints_1.Schoolgirl3(),
    new other_prints_1.Shauna3(),
    new other_prints_1.Sidney3(),
    new other_prints_1.PowerTablet2(),
    new other_prints_1.TrainingCourtFST(),
];

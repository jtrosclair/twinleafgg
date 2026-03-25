"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBoundariesCrossed = void 0;
const audino_1 = require("./audino");
const azumarill_1 = require("./azumarill");
const bellossom_1 = require("./bellossom");
const black_kyurem_1 = require("./black-kyurem");
const black_kyurem_ex_1 = require("./black-kyurem-ex");
const blastoise_1 = require("./blastoise");
const blitzle_1 = require("./blitzle");
const buneary_1 = require("./buneary");
const camerupt_1 = require("./camerupt");
const celebi_ex_1 = require("./celebi-ex");
const charizard_1 = require("./charizard");
const charmander_1 = require("./charmander");
const charmeleon_1 = require("./charmeleon");
const chinchou_1 = require("./chinchou");
const cottonee_1 = require("./cottonee");
const cresselia_ex_1 = require("./cresselia-ex");
const croagunk_1 = require("./croagunk");
const croagunk_2_1 = require("./croagunk-2");
const crustle_1 = require("./crustle");
const cryogonal_1 = require("./cryogonal");
const darmanitan_1 = require("./darmanitan");
const darumaka_1 = require("./darumaka");
const delcatty_1 = require("./delcatty");
const delibird_1 = require("./delibird");
const dewott_1 = require("./dewott");
const ditto_1 = require("./ditto");
const ducklett_1 = require("./ducklett");
const dunsparce_1 = require("./dunsparce");
const dusclops_1 = require("./dusclops");
const dusknoir_1 = require("./dusknoir");
const duskull_1 = require("./duskull");
const dwebble_1 = require("./dwebble");
const electabuzz_1 = require("./electabuzz");
const electivire_1 = require("./electivire");
const electrode_1 = require("./electrode");
const emboar_1 = require("./emboar");
const farfetchd_1 = require("./farfetchd");
const flygon_1 = require("./flygon");
const frillish_1 = require("./frillish");
const gligar_1 = require("./gligar");
const gliscor_1 = require("./gliscor");
const gloom_1 = require("./gloom");
const golduck_1 = require("./golduck");
const golduck_2_1 = require("./golduck-2");
const golurk_1 = require("./golurk");
const gothita_1 = require("./gothita");
const gothorita_1 = require("./gothorita");
const grumpig_1 = require("./grumpig");
const heracross_1 = require("./heracross");
const herdier_1 = require("./herdier");
const jellicent_1 = require("./jellicent");
const keldeo_1 = require("./keldeo");
const keldeo_2_1 = require("./keldeo-2");
const keldeo_ex_1 = require("./keldeo-ex");
const klink_1 = require("./klink");
const landorus_ex_1 = require("./landorus-ex");
const liepard_1 = require("./liepard");
const lilligant_1 = require("./lilligant");
const lillipup_1 = require("./lillipup");
const lopunny_1 = require("./lopunny");
const makuhita_1 = require("./makuhita");
const mandibuzz_1 = require("./mandibuzz");
const marill_1 = require("./marill");
const meloetta_1 = require("./meloetta");
const meowth_1 = require("./meowth");
const mienfoo_1 = require("./mienfoo");
const mienfoo_2_1 = require("./mienfoo-2");
const mienshao_1 = require("./mienshao");
const munna_1 = require("./munna");
const musharna_1 = require("./musharna");
const numel_1 = require("./numel");
const oddish_1 = require("./oddish");
const oshawott_1 = require("./oshawott");
const patrat_1 = require("./patrat");
const petilil_1 = require("./petilil");
const pidove_1 = require("./pidove");
const pignite_1 = require("./pignite");
const pikachu_1 = require("./pikachu");
const psyduck_1 = require("./psyduck");
const psyduck_2_1 = require("./psyduck-2");
const purrloin_1 = require("./purrloin");
const raticate_1 = require("./raticate");
const rattata_1 = require("./rattata");
const samurott_1 = require("./samurott");
const sandshrew_1 = require("./sandshrew");
const sandslash_1 = require("./sandslash");
const scizor_1 = require("./scizor");
const scolipede_1 = require("./scolipede");
const scyther_1 = require("./scyther");
const serperior_1 = require("./serperior");
const servine_1 = require("./servine");
const shaymin_1 = require("./shaymin");
const skarmory_1 = require("./skarmory");
const skarmory_2_1 = require("./skarmory-2");
const skitty_1 = require("./skitty");
const snivy_1 = require("./snivy");
const snorlax_1 = require("./snorlax");
const spinda_1 = require("./spinda");
const spoink_1 = require("./spoink");
const squirtle_1 = require("./squirtle");
const stoutland_1 = require("./stoutland");
const swanna_1 = require("./swanna");
const swoobat_1 = require("./swoobat");
const taillow_1 = require("./taillow");
const tangela_1 = require("./tangela");
const tangrowth_1 = require("./tangrowth");
const tepig_1 = require("./tepig");
const togepi_1 = require("./togepi");
const toxicroak_1 = require("./toxicroak");
const tranquill_1 = require("./tranquill");
const trapinch_1 = require("./trapinch");
const unfezant_1 = require("./unfezant");
const venipede_1 = require("./venipede");
const vibrava_1 = require("./vibrava");
const victini_1 = require("./victini");
const vileplume_1 = require("./vileplume");
const voltorb_1 = require("./voltorb");
const vullaby_1 = require("./vullaby");
const wartortle_1 = require("./wartortle");
const watchog_1 = require("./watchog");
const whimsicott_1 = require("./whimsicott");
const whirlipede_1 = require("./whirlipede");
const white_kyurem_1 = require("./white-kyurem");
const white_kyurem_ex_1 = require("./white-kyurem-ex");
const wobbuffet_1 = require("./wobbuffet");
const woobat_1 = require("./woobat");
const zebstrika_1 = require("./zebstrika");
const aspertia_city_gym_1 = require("./aspertia-city-gym");
const computer_search_1 = require("./computer-search");
const crystal_edge_1 = require("./crystal-edge");
const crystal_wall_1 = require("./crystal-wall");
const gold_potion_1 = require("./gold-potion");
const hugh_1 = require("./hugh");
const potion_1 = require("./potion");
const skyla_1 = require("./skyla");
const other_prints_1 = require("./other-prints");
exports.setBoundariesCrossed = [
    // Pokemon
    new audino_1.Audino(),
    new azumarill_1.Azumarill(),
    new bellossom_1.Bellossom(),
    new black_kyurem_1.BlackKyurem(),
    new black_kyurem_ex_1.BlackKyuremEx(),
    new blastoise_1.Blastoise(),
    new blitzle_1.Blitzle(),
    new buneary_1.Buneary(),
    new camerupt_1.Camerupt(),
    new celebi_ex_1.CelebiEx(),
    new charizard_1.Charizard(),
    new charmander_1.Charmander(),
    new charmeleon_1.Charmeleon(),
    new chinchou_1.Chinchou(),
    new cottonee_1.Cottonee(),
    new cresselia_ex_1.CresseliaEx(),
    new croagunk_1.Croagunk(),
    new croagunk_2_1.Croagunk2(),
    new crustle_1.Crustle(),
    new cryogonal_1.Cryogonal(),
    new darmanitan_1.Darmanitan(),
    new darumaka_1.Darumaka(),
    new delcatty_1.Delcatty(),
    new delibird_1.Delibird(),
    new dewott_1.Dewott(),
    new ditto_1.Ditto(),
    new ducklett_1.Ducklett(),
    new dunsparce_1.Dunsparce(),
    new dusclops_1.Dusclops(),
    new dusknoir_1.Dusknoir(),
    new duskull_1.Duskull(),
    new dwebble_1.Dwebble(),
    new electabuzz_1.Electabuzz(),
    new electivire_1.Electivire(),
    new electrode_1.Electrode(),
    new emboar_1.Emboar(),
    new farfetchd_1.Farfetchd(),
    new flygon_1.Flygon(),
    new frillish_1.Frillish(),
    new gligar_1.Gligar(),
    new gliscor_1.Gliscor(),
    new gloom_1.Gloom(),
    new golduck_1.Golduck(),
    new golduck_2_1.Golduck2(),
    new golurk_1.Golurk(),
    new gothita_1.Gothita(),
    new gothorita_1.Gothorita(),
    new grumpig_1.Grumpig(),
    new heracross_1.Heracross(),
    new herdier_1.Herdier(),
    new jellicent_1.Jellicent(),
    new keldeo_1.Keldeo(),
    new keldeo_2_1.Keldeo2(),
    new keldeo_ex_1.KeldeoEx(),
    new klink_1.Klink(),
    new landorus_ex_1.LandorusEx(),
    new liepard_1.Liepard(),
    new lilligant_1.Lilligant(),
    new lillipup_1.Lillipup(),
    new lopunny_1.Lopunny(),
    new makuhita_1.Makuhita(),
    new mandibuzz_1.Mandibuzz(),
    new marill_1.Marill(),
    new meloetta_1.Meloetta(),
    new meowth_1.Meowth(),
    new mienfoo_1.Mienfoo(),
    new mienfoo_2_1.Mienfoo2(),
    new mienshao_1.Mienshao(),
    new munna_1.Munna(),
    new musharna_1.Musharna(),
    new numel_1.Numel(),
    new oddish_1.Oddish(),
    new oshawott_1.Oshawott(),
    new patrat_1.Patrat(),
    new petilil_1.Petilil(),
    new pidove_1.Pidove(),
    new pignite_1.Pignite(),
    new pikachu_1.Pikachu(),
    new psyduck_1.Psyduck(),
    new psyduck_2_1.Psyduck2(),
    new purrloin_1.Purrloin(),
    new raticate_1.Raticate(),
    new rattata_1.Rattata(),
    new samurott_1.Samurott(),
    new sandshrew_1.Sandshrew(),
    new sandslash_1.Sandslash(),
    new scizor_1.Scizor(),
    new scolipede_1.Scolipede(),
    new scyther_1.Scyther(),
    new serperior_1.Serperior(),
    new servine_1.Servine(),
    new shaymin_1.Shaymin(),
    new skarmory_1.Skarmory(),
    new skarmory_2_1.Skarmory2(),
    new skitty_1.Skitty(),
    new snivy_1.Snivy(),
    new snorlax_1.Snorlax(),
    new spinda_1.Spinda(),
    new spoink_1.Spoink(),
    new squirtle_1.Squirtle(),
    new stoutland_1.Stoutland(),
    new swanna_1.Swanna(),
    new swoobat_1.Swoobat(),
    new taillow_1.Taillow(),
    new tangela_1.Tangela(),
    new tangrowth_1.Tangrowth(),
    new tepig_1.Tepig(),
    new togepi_1.Togepi(),
    new toxicroak_1.Toxicroak(),
    new tranquill_1.Tranquill(),
    new trapinch_1.Trapinch(),
    new unfezant_1.Unfezant(),
    new venipede_1.Venipede(),
    new vibrava_1.Vibrava(),
    new victini_1.Victini(),
    new vileplume_1.Vileplume(),
    new voltorb_1.Voltorb(),
    new vullaby_1.Vullaby(),
    new wartortle_1.Wartortle(),
    new watchog_1.Watchog(),
    new whimsicott_1.Whimsicott(),
    new whirlipede_1.Whirlipede(),
    new white_kyurem_1.WhiteKyurem(),
    new white_kyurem_ex_1.WhiteKyuremEx(),
    new wobbuffet_1.Wobbuffet(),
    new woobat_1.Woobat(),
    new zebstrika_1.Zebstrika(),
    // Trainers
    new aspertia_city_gym_1.AspertiaCityGym(),
    new computer_search_1.ComputerSearch(),
    new crystal_edge_1.CrystalEdge(),
    new crystal_wall_1.CrystalWall(),
    new gold_potion_1.GoldPotion(),
    new hugh_1.Hugh(),
    new potion_1.Potion(),
    new skyla_1.Skyla(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.KeldeoExBCR(),
    new other_prints_1.RockyHelmetBCR(),
    new other_prints_1.EnergySearchBCR(),
    new other_prints_1.GreatBallBCR(),
    new other_prints_1.PokeBallBCR(),
    new other_prints_1.SwitchBCR(),
    new other_prints_1.TownMapBCR(),
    new other_prints_1.LandorusEx2BCR(),
    new other_prints_1.BiancaBCR(),
    new other_prints_1.CherenBCR(),
    new other_prints_1.Skyla2BCR(),
    new other_prints_1.TerrakionBCR(),
    new other_prints_1.AltariaBCR(),
    new other_prints_1.RockyHelmet2BCR(),
    new other_prints_1.CelebiEx2(),
    new other_prints_1.CresseliaEx2(),
    new other_prints_1.BlackKyuremEx2(),
    new other_prints_1.WhiteKyuremEx2(),
];

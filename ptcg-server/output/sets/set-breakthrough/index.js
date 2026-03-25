"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBreakthrough = void 0;
const abomasnow_1 = require("./abomasnow");
const aromatisse_1 = require("./aromatisse");
const axew_1 = require("./axew");
const axew_2_1 = require("./axew-2");
const beheeyem_1 = require("./beheeyem");
const braixen_1 = require("./braixen");
const braviary_1 = require("./braviary");
const bronzong_1 = require("./bronzong");
const bronzor_1 = require("./bronzor");
const cacnea_1 = require("./cacnea");
const cacturne_1 = require("./cacturne");
const chatot_1 = require("./chatot");
const chesnaught_1 = require("./chesnaught");
const chesnaught_break_1 = require("./chesnaught-break");
const chespin_1 = require("./chespin");
const chespin_2_1 = require("./chespin-2");
const chespin_3_1 = require("./chespin-3");
const cresselia_1 = require("./cresselia");
const cubone_1 = require("./cubone");
const cyndaquil_1 = require("./cyndaquil");
const dedenne_1 = require("./dedenne");
const dodrio_1 = require("./dodrio");
const doduo_1 = require("./doduo");
const doduo_2_1 = require("./doduo-2");
const elgyem_1 = require("./elgyem");
const empoleon_1 = require("./empoleon");
const fennekin_1 = require("./fennekin");
const flabebe_1 = require("./flabebe");
const floette_1 = require("./floette");
const florges_1 = require("./florges");
const florges_break_1 = require("./florges-break");
const fraxure_1 = require("./fraxure");
const froakie_1 = require("./froakie");
const frogadier_1 = require("./frogadier");
const gallade_1 = require("./gallade");
const gastly_1 = require("./gastly");
const gengar_1 = require("./gengar");
const glalie_ex_1 = require("./glalie-ex");
const gogoat_1 = require("./gogoat");
const goldeen_1 = require("./goldeen");
const granbull_1 = require("./granbull");
const haunter_1 = require("./haunter");
const hawlucha_1 = require("./hawlucha");
const haxorus_1 = require("./haxorus");
const hippopotas_1 = require("./hippopotas");
const hoothoot_1 = require("./hoothoot");
const houndoom_ex_1 = require("./houndoom-ex");
const inkay_1 = require("./inkay");
const kirlia_1 = require("./kirlia");
const m_glalie_ex_1 = require("./m-glalie-ex");
const m_houndoom_ex_1 = require("./m-houndoom-ex");
const m_mewtwo_ex_1 = require("./m-mewtwo-ex");
const m_mewtwo_ex_2_1 = require("./m-mewtwo-ex-2");
const magnemite_1 = require("./magnemite");
const magnemite_2_1 = require("./magnemite-2");
const magneton_1 = require("./magneton");
const magnezone_1 = require("./magnezone");
const mamoswine_1 = require("./mamoswine");
const marowak_1 = require("./marowak");
const marowak_break_1 = require("./marowak-break");
const meloetta_1 = require("./meloetta");
const meowth_1 = require("./meowth");
const mewtwo_ex_1 = require("./mewtwo-ex");
const mewtwo_ex_2_1 = require("./mewtwo-ex-2");
const misdreavus_1 = require("./misdreavus");
const mismagius_1 = require("./mismagius");
const mr_mime_1 = require("./mr-mime");
const noctowl_1 = require("./noctowl");
const noibat_1 = require("./noibat");
const noibat_2_1 = require("./noibat-2");
const noivern_1 = require("./noivern");
const noivern_break_1 = require("./noivern-break");
const octillery_1 = require("./octillery");
const pancham_1 = require("./pancham");
const panpour_1 = require("./panpour");
const pansage_1 = require("./pansage");
const pansear_1 = require("./pansear");
const paras_1 = require("./paras");
const parasect_1 = require("./parasect");
const pikachu_1 = require("./pikachu");
const piloswine_1 = require("./piloswine");
const pinsir_1 = require("./pinsir");
const piplup_1 = require("./piplup");
const prinplup_1 = require("./prinplup");
const quilava_1 = require("./quilava");
const quilladin_1 = require("./quilladin");
const raichu_1 = require("./raichu");
const raichu_break_1 = require("./raichu-break");
const raikou_1 = require("./raikou");
const ralts_1 = require("./ralts");
const ralts_2_1 = require("./ralts-2");
const remoraid_1 = require("./remoraid");
const remoraid_2_1 = require("./remoraid-2");
const rufflet_1 = require("./rufflet");
const sandshrew_1 = require("./sandshrew");
const sandslash_1 = require("./sandslash");
const scatterbug_1 = require("./scatterbug");
const seaking_1 = require("./seaking");
const simipour_1 = require("./simipour");
const simisage_1 = require("./simisage");
const simisear_1 = require("./simisear");
const skiddo_1 = require("./skiddo");
const smeargle_1 = require("./smeargle");
const snorlax_1 = require("./snorlax");
const snover_1 = require("./snover");
const snubbull_1 = require("./snubbull");
const spewpa_1 = require("./spewpa");
const spritzee_1 = require("./spritzee");
const staraptor_1 = require("./staraptor");
const staravia_1 = require("./staravia");
const starly_1 = require("./starly");
const starmie_1 = require("./starmie");
const staryu_1 = require("./staryu");
const stunfisk_1 = require("./stunfisk");
const swinub_1 = require("./swinub");
const swoobat_1 = require("./swoobat");
const teddiursa_1 = require("./teddiursa");
const typhlosion_1 = require("./typhlosion");
const ursaring_1 = require("./ursaring");
const vanillish_1 = require("./vanillish");
const vanillite_1 = require("./vanillite");
const vanilluxe_1 = require("./vanilluxe");
const vivillon_1 = require("./vivillon");
const wobbuffet_1 = require("./wobbuffet");
const woobat_1 = require("./woobat");
const xerneas_1 = require("./xerneas");
const yveltal_1 = require("./yveltal");
const zoroark_1 = require("./zoroark");
const zoroark_break_1 = require("./zoroark-break");
const zorua_1 = require("./zorua");
const zorua_2_1 = require("./zorua-2");
const assault_vest_1 = require("./assault-vest");
const brigette_1 = require("./brigette");
const buddy_buddy_rescue_1 = require("./buddy-buddy-rescue");
const giovannis_scheme_1 = require("./giovannis-scheme");
const glalie_spirit_link_1 = require("./glalie-spirit-link");
const heavy_boots_1 = require("./heavy-boots");
const houndoom_spirit_link_1 = require("./houndoom-spirit-link");
const mewtwo_spirit_link_1 = require("./mewtwo-spirit-link");
const parallel_city_1 = require("./parallel-city");
const reserved_ticket_1 = require("./reserved-ticket");
const town_map_1 = require("./town-map");
const burning_energy_1 = require("./burning-energy");
const other_prints_1 = require("./other-prints");
exports.setBreakthrough = [
    // Pokemon
    new abomasnow_1.Abomasnow(),
    new aromatisse_1.Aromatisse(),
    new axew_1.Axew(),
    new axew_2_1.Axew2(),
    new beheeyem_1.Beheeyem(),
    new braixen_1.Braixen(),
    new braviary_1.Braviary(),
    new bronzong_1.Bronzong(),
    new bronzor_1.Bronzor(),
    new cacnea_1.Cacnea(),
    new cacturne_1.Cacturne(),
    new chatot_1.Chatot(),
    new chesnaught_1.Chesnaught(),
    new chesnaught_break_1.ChesnaughtBreak(),
    new chespin_1.Chespin(),
    new chespin_2_1.Chespin2(),
    new chespin_3_1.Chespin3(),
    new cresselia_1.Cresselia(),
    new cubone_1.Cubone(),
    new cyndaquil_1.Cyndaquil(),
    new dedenne_1.Dedenne(),
    new dodrio_1.Dodrio(),
    new doduo_1.Doduo(),
    new doduo_2_1.Doduo2(),
    new elgyem_1.Elgyem(),
    new empoleon_1.Empoleon(),
    new fennekin_1.Fennekin(),
    new flabebe_1.Flabebe(),
    new floette_1.Floette(),
    new florges_1.Florges(),
    new florges_break_1.FlorgesBreak(),
    new fraxure_1.Fraxure(),
    new froakie_1.Froakie(),
    new frogadier_1.Frogadier(),
    new gallade_1.Gallade(),
    new gastly_1.Gastly(),
    new gengar_1.Gengar(),
    new glalie_ex_1.GlalieEx(),
    new gogoat_1.Gogoat(),
    new goldeen_1.Goldeen(),
    new granbull_1.Granbull(),
    new haunter_1.Haunter(),
    new hawlucha_1.Hawlucha(),
    new haxorus_1.Haxorus(),
    new hippopotas_1.Hippopotas(),
    new hoothoot_1.Hoothoot(),
    new houndoom_ex_1.HoundoomEx(),
    new inkay_1.Inkay(),
    new kirlia_1.Kirlia(),
    new m_glalie_ex_1.MGlalieEx(),
    new m_houndoom_ex_1.MHoundoomEx(),
    new m_mewtwo_ex_1.MMewtwoEx(),
    new m_mewtwo_ex_2_1.MMewtwoEx2(),
    new magnemite_1.Magnemite(),
    new magnemite_2_1.Magnemite2(),
    new magneton_1.Magneton(),
    new magnezone_1.Magnezone(),
    new mamoswine_1.Mamoswine(),
    new marowak_1.Marowak(),
    new marowak_break_1.MarowakBreak(),
    new meloetta_1.Meloetta(),
    new meowth_1.Meowth(),
    new mewtwo_ex_1.MewtwoEx(),
    new mewtwo_ex_2_1.MewtwoEx2(),
    new misdreavus_1.Misdreavus(),
    new mismagius_1.Mismagius(),
    new mr_mime_1.MrMime(),
    new noctowl_1.Noctowl(),
    new noibat_1.Noibat(),
    new noibat_2_1.Noibat2(),
    new noivern_1.Noivern(),
    new noivern_break_1.NoivernBreak(),
    new octillery_1.Octillery(),
    new pancham_1.Pancham(),
    new panpour_1.Panpour(),
    new pansage_1.Pansage(),
    new pansear_1.Pansear(),
    new paras_1.Paras(),
    new parasect_1.Parasect(),
    new pikachu_1.Pikachu(),
    new piloswine_1.Piloswine(),
    new pinsir_1.Pinsir(),
    new piplup_1.Piplup(),
    new prinplup_1.Prinplup(),
    new quilava_1.Quilava(),
    new quilladin_1.Quilladin(),
    new raichu_1.Raichu(),
    new raichu_break_1.RaichuBreak(),
    new raikou_1.Raikou(),
    new ralts_1.Ralts(),
    new ralts_2_1.Ralts2(),
    new remoraid_1.Remoraid(),
    new remoraid_2_1.Remoraid2(),
    new rufflet_1.Rufflet(),
    new sandshrew_1.Sandshrew(),
    new sandslash_1.Sandslash(),
    new scatterbug_1.Scatterbug(),
    new seaking_1.Seaking(),
    new simipour_1.Simipour(),
    new simisage_1.Simisage(),
    new simisear_1.Simisear(),
    new skiddo_1.Skiddo(),
    new smeargle_1.Smeargle(),
    new snorlax_1.Snorlax(),
    new snover_1.Snover(),
    new snubbull_1.Snubbull(),
    new spewpa_1.Spewpa(),
    new spritzee_1.Spritzee(),
    new staraptor_1.Staraptor(),
    new staravia_1.Staravia(),
    new starly_1.Starly(),
    new starmie_1.Starmie(),
    new staryu_1.Staryu(),
    new stunfisk_1.Stunfisk(),
    new swinub_1.Swinub(),
    new swoobat_1.Swoobat(),
    new teddiursa_1.Teddiursa(),
    new typhlosion_1.Typhlosion(),
    new ursaring_1.Ursaring(),
    new vanillish_1.Vanillish(),
    new vanillite_1.Vanillite(),
    new vanilluxe_1.Vanilluxe(),
    new vivillon_1.Vivillon(),
    new wobbuffet_1.Wobbuffet(),
    new woobat_1.Woobat(),
    new xerneas_1.Xerneas(),
    new yveltal_1.Yveltal(),
    new zoroark_1.Zoroark(),
    new zoroark_break_1.ZoroarkBreak(),
    new zorua_1.Zorua(),
    new zorua_2_1.Zorua2(),
    // Trainers
    new assault_vest_1.AssaultVest(),
    new brigette_1.Brigette(),
    new buddy_buddy_rescue_1.BuddyBuddyRescue(),
    new giovannis_scheme_1.GiovannisScheme(),
    new glalie_spirit_link_1.GlalieSpiritLink(),
    new heavy_boots_1.HeavyBoots(),
    new houndoom_spirit_link_1.HoundoomSpiritLink(),
    new mewtwo_spirit_link_1.MewtwoSpiritLink(),
    new parallel_city_1.ParallelCity(),
    new reserved_ticket_1.ReservedTicket(),
    new town_map_1.TownMap(),
    // Energy
    new burning_energy_1.BurningEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.FishermanBKT(),
    new other_prints_1.FloatStoneBKT(),
    new other_prints_1.ProfessorsLetterBKT(),
    new other_prints_1.HeavyBallBKT(),
    new other_prints_1.JudgeULBKT(),
    new other_prints_1.SkylaBKT(),
    new other_prints_1.SuperRodBKT(),
    new other_prints_1.RainbowEnergyPLBKT(),
    new other_prints_1.Brigette2BKT(),
    new other_prints_1.ProfessorsLetter2BKT(),
    new other_prints_1.SwabluBKT(),
    new other_prints_1.HoundoomEx2(),
    new other_prints_1.MHoundoomEx2(),
    new other_prints_1.GlalieEx2(),
    new other_prints_1.MGlalieEx2(),
    new other_prints_1.MewtwoEx3(),
    new other_prints_1.MewtwoEx4(),
    new other_prints_1.MMewtwoEx3(),
    new other_prints_1.MMewtwoEx4(),
    new other_prints_1.GiovannisScheme2(),
    new other_prints_1.MewtwoEx5(),
    new other_prints_1.MewtwoEx6(),
];

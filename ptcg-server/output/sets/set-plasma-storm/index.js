"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPlasmaStorm = void 0;
const amoonguss_1 = require("./amoonguss");
const articuno_ex_1 = require("./articuno-ex");
const beartic_1 = require("./beartic");
const beheeyem_1 = require("./beheeyem");
const black_kyurem_ex_1 = require("./black-kyurem-ex");
const bouffalant_1 = require("./bouffalant");
const braviary_1 = require("./braviary");
const carvanha_1 = require("./carvanha");
const cherrim_1 = require("./cherrim");
const cherubi_1 = require("./cherubi");
const chimchar_1 = require("./chimchar");
const clefable_1 = require("./clefable");
const clefairy_1 = require("./clefairy");
const cobalion_ex_1 = require("./cobalion-ex");
const combee_1 = require("./combee");
const conkeldurr_1 = require("./conkeldurr");
const crobat_1 = require("./crobat");
const cubchoo_1 = require("./cubchoo");
const dodrio_1 = require("./dodrio");
const doduo_1 = require("./doduo");
const donphan_1 = require("./donphan");
const druddigon_1 = require("./druddigon");
const durant_1 = require("./durant");
const durant_2_1 = require("./durant-2");
const elgyem_1 = require("./elgyem");
const elgyem_2_1 = require("./elgyem-2");
const exploud_1 = require("./exploud");
const foongus_1 = require("./foongus");
const frillish_1 = require("./frillish");
const gallade_1 = require("./gallade");
const galvantula_1 = require("./galvantula");
const garbodor_1 = require("./garbodor");
const garbodor_2_1 = require("./garbodor-2");
const giratina_1 = require("./giratina");
const golbat_1 = require("./golbat");
const grotle_1 = require("./grotle");
const gurdurr_1 = require("./gurdurr");
const heatmor_1 = require("./heatmor");
const infernape_1 = require("./infernape");
const jellicent_1 = require("./jellicent");
const joltik_1 = require("./joltik");
const kirlia_1 = require("./kirlia");
const klang_1 = require("./klang");
const klink_1 = require("./klink");
const klinklang_1 = require("./klinklang");
const koffing_1 = require("./koffing");
const koffing_2_1 = require("./koffing-2");
const lampent_1 = require("./lampent");
const leavanny_1 = require("./leavanny");
const liepard_1 = require("./liepard");
const litwick_1 = require("./litwick");
const lombre_1 = require("./lombre");
const lotad_1 = require("./lotad");
const loudred_1 = require("./loudred");
const lucario_1 = require("./lucario");
const lucario_2_1 = require("./lucario-2");
const ludicolo_1 = require("./ludicolo");
const lugia_ex_1 = require("./lugia-ex");
const lunatone_1 = require("./lunatone");
const magnemite_1 = require("./magnemite");
const magnemite_2_1 = require("./magnemite-2");
const magneton_1 = require("./magneton");
const magneton_2_1 = require("./magneton-2");
const magnezone_1 = require("./magnezone");
const magnezone_2_1 = require("./magnezone-2");
const mamoswine_1 = require("./mamoswine");
const manaphy_1 = require("./manaphy");
const maractus_1 = require("./maractus");
const moltres_ex_1 = require("./moltres-ex");
const monferno_1 = require("./monferno");
const pansear_1 = require("./pansear");
const patrat_1 = require("./patrat");
const patrat_2_1 = require("./patrat-2");
const phanpy_1 = require("./phanpy");
const piloswine_1 = require("./piloswine");
const purrloin_1 = require("./purrloin");
const purrloin_2_1 = require("./purrloin-2");
const ralts_1 = require("./ralts");
const riolu_1 = require("./riolu");
const riolu_2_1 = require("./riolu-2");
const rotom_1 = require("./rotom");
const rufflet_1 = require("./rufflet");
const scrafty_1 = require("./scrafty");
const scraggy_1 = require("./scraggy");
const sewaddle_1 = require("./sewaddle");
const sharpedo_1 = require("./sharpedo");
const simisear_1 = require("./simisear");
const skarmory_1 = require("./skarmory");
const skitty_1 = require("./skitty");
const snorlax_1 = require("./snorlax");
const solrock_1 = require("./solrock");
const squirtle_1 = require("./squirtle");
const swadloon_1 = require("./swadloon");
const swinub_1 = require("./swinub");
const timburr_1 = require("./timburr");
const togekiss_1 = require("./togekiss");
const togepi_1 = require("./togepi");
const togetic_1 = require("./togetic");
const torterra_1 = require("./torterra");
const trubbish_1 = require("./trubbish");
const trubbish_2_1 = require("./trubbish-2");
const trubbish_3_1 = require("./trubbish-3");
const turtwig_1 = require("./turtwig");
const vanillish_1 = require("./vanillish");
const vanillite_1 = require("./vanillite");
const vanilluxe_1 = require("./vanilluxe");
const vespiquen_1 = require("./vespiquen");
const victini_ex_1 = require("./victini-ex");
const watchog_1 = require("./watchog");
const watchog_2_1 = require("./watchog-2");
const weezing_1 = require("./weezing");
const whismur_1 = require("./whismur");
const white_kyurem_ex_1 = require("./white-kyurem-ex");
const zapdos_ex_1 = require("./zapdos-ex");
const zubat_1 = require("./zubat");
const zubat_2_1 = require("./zubat-2");
const bicycle_1 = require("./bicycle");
const colress_1 = require("./colress");
const colress_machine_1 = require("./colress-machine");
const dowsing_machine_1 = require("./dowsing-machine");
const escape_rope_1 = require("./escape-rope");
const ether_1 = require("./ether");
const hypnotoxic_laser_1 = require("./hypnotoxic-laser");
const plasma_frigate_1 = require("./plasma-frigate");
const scramble_switch_1 = require("./scramble-switch");
const team_plasma_grunt_1 = require("./team-plasma-grunt");
const victory_piece_1 = require("./victory-piece");
const virbank_city_gym_1 = require("./virbank-city-gym");
const plasma_energy_1 = require("./plasma-energy");
const other_prints_1 = require("./other-prints");
exports.setPlasmaStorm = [
    // Pokemon
    new amoonguss_1.Amoonguss(),
    new articuno_ex_1.ArticunoEx(),
    new beartic_1.Beartic(),
    new beheeyem_1.Beheeyem(),
    new black_kyurem_ex_1.BlackKyuremEX(),
    new bouffalant_1.Bouffalant(),
    new braviary_1.Braviary(),
    new carvanha_1.Carvanha(),
    new cherrim_1.Cherrim(),
    new cherubi_1.Cherubi(),
    new chimchar_1.Chimchar(),
    new clefable_1.Clefable(),
    new clefairy_1.Clefairy(),
    new cobalion_ex_1.CobalionEx(),
    new combee_1.Combee(),
    new conkeldurr_1.Conkeldurr(),
    new crobat_1.Crobat(),
    new cubchoo_1.Cubchoo(),
    new dodrio_1.Dodrio(),
    new doduo_1.Doduo(),
    new donphan_1.Donphan(),
    new druddigon_1.Druddigon(),
    new durant_1.Durant(),
    new durant_2_1.Durant2(),
    new elgyem_1.Elgyem(),
    new elgyem_2_1.Elgyem2(),
    new exploud_1.Exploud(),
    new foongus_1.Foongus(),
    new frillish_1.Frillish(),
    new gallade_1.Gallade(),
    new galvantula_1.Galvantula(),
    new garbodor_1.Garbodor(),
    new garbodor_2_1.Garbodor2(),
    new giratina_1.Giratina(),
    new golbat_1.Golbat(),
    new grotle_1.Grotle(),
    new gurdurr_1.Gurdurr(),
    new heatmor_1.Heatmor(),
    new infernape_1.Infernape(),
    new jellicent_1.Jellicent(),
    new joltik_1.Joltik(),
    new kirlia_1.Kirlia(),
    new klang_1.Klang(),
    new klink_1.Klink(),
    new klinklang_1.Klinklang(),
    new koffing_1.Koffing(),
    new koffing_2_1.Koffing2(),
    new lampent_1.Lampent(),
    new leavanny_1.Leavanny(),
    new liepard_1.Liepard(),
    new litwick_1.Litwick(),
    new lombre_1.Lombre(),
    new lotad_1.Lotad(),
    new loudred_1.Loudred(),
    new lucario_1.Lucario(),
    new lucario_2_1.Lucario2(),
    new ludicolo_1.Ludicolo(),
    new lugia_ex_1.LugiaEx(),
    new lunatone_1.Lunatone(),
    new magnemite_1.Magnemite(),
    new magnemite_2_1.Magnemite2(),
    new magneton_1.Magneton(),
    new magneton_2_1.Magneton2(),
    new magnezone_1.Magnezone(),
    new magnezone_2_1.Magnezone2(),
    new mamoswine_1.Mamoswine(),
    new manaphy_1.Manaphy(),
    new maractus_1.Maractus(),
    new moltres_ex_1.MoltresEx(),
    new monferno_1.Monferno(),
    new pansear_1.Pansear(),
    new patrat_1.Patrat(),
    new patrat_2_1.Patrat2(),
    new phanpy_1.Phanpy(),
    new piloswine_1.Piloswine(),
    new purrloin_1.Purrloin(),
    new purrloin_2_1.Purrloin2(),
    new ralts_1.Ralts(),
    new riolu_1.Riolu(),
    new riolu_2_1.Riolu2(),
    new rotom_1.Rotom(),
    new rufflet_1.Rufflet(),
    new scrafty_1.Scrafty(),
    new scraggy_1.Scraggy(),
    new sewaddle_1.Sewaddle(),
    new sharpedo_1.Sharpedo(),
    new simisear_1.Simisear(),
    new skarmory_1.Skarmory(),
    new skitty_1.Skitty(),
    new snorlax_1.Snorlax(),
    new solrock_1.Solrock(),
    new squirtle_1.Squirtle(),
    new swadloon_1.Swadloon(),
    new swinub_1.Swinub(),
    new timburr_1.Timburr(),
    new togekiss_1.Togekiss(),
    new togepi_1.Togepi(),
    new togetic_1.Togetic(),
    new torterra_1.Torterra(),
    new trubbish_1.Trubbish(),
    new trubbish_2_1.Trubbish2(),
    new trubbish_3_1.Trubbish3(),
    new turtwig_1.Turtwig(),
    new vanillish_1.Vanillish(),
    new vanillite_1.Vanillite(),
    new vanilluxe_1.Vanilluxe(),
    new vespiquen_1.Vespiquen(),
    new victini_ex_1.VictiniEX(),
    new watchog_1.Watchog(),
    new watchog_2_1.Watchog2(),
    new weezing_1.Weezing(),
    new whismur_1.Whismur(),
    new white_kyurem_ex_1.WhiteKyuremEx(),
    new zapdos_ex_1.ZapdosEx(),
    new zubat_1.Zubat(),
    new zubat_2_1.Zubat2(),
    // Trainers
    new bicycle_1.Bicycle(),
    new colress_1.Colress(),
    new colress_machine_1.ColressMachine(),
    new dowsing_machine_1.DowsingMachine(),
    new escape_rope_1.EscapeRope(),
    new ether_1.Ether(),
    new hypnotoxic_laser_1.HypnotoxicLaser(),
    new plasma_frigate_1.PlasmaFrigate(),
    new scramble_switch_1.ScrambleSwitch(),
    new team_plasma_grunt_1.TeamPlasmaGrunt(),
    new victory_piece_1.VictoryPiece(),
    new virbank_city_gym_1.VirbankCityGym(),
    // Energy
    new plasma_energy_1.PlasmaEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.EviolitePLS(),
    new other_prints_1.VictiniEX2PLS(),
    new other_prints_1.LugiaEx2PLS(),
    new other_prints_1.Colress2PLS(),
    new other_prints_1.BlastoisePLS(),
    new other_prints_1.RandomReceiverPLS(),
    new other_prints_1.ArticunoEx2(),
    new other_prints_1.CobalionEx2(),
    new other_prints_1.CharizardPLS(),
];

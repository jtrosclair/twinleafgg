"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPhantomForces = void 0;
const aegislash_ex_1 = require("./aegislash-ex");
const alomomola_1 = require("./alomomola");
const blissey_1 = require("./blissey");
const boldore_1 = require("./boldore");
const bronzong_1 = require("./bronzong");
const bronzor_1 = require("./bronzor");
const bunnelby_1 = require("./bunnelby");
const chandelure_1 = require("./chandelure");
const chansey_1 = require("./chansey");
const crobat_1 = require("./crobat");
const croconaw_1 = require("./croconaw");
const dedenne_1 = require("./dedenne");
const deino_1 = require("./deino");
const dialga_ex_1 = require("./dialga-ex");
const diancie_1 = require("./diancie");
const diggersby_1 = require("./diggersby");
const escavalier_1 = require("./escavalier");
const exploud_1 = require("./exploud");
const fearow_1 = require("./fearow");
const feraligatr_1 = require("./feraligatr");
const finneon_1 = require("./finneon");
const fletchinder_1 = require("./fletchinder");
const fletchling_1 = require("./fletchling");
const florges_ex_1 = require("./florges-ex");
const frillish_1 = require("./frillish");
const galvantula_1 = require("./galvantula");
const gengar_ex_1 = require("./gengar-ex");
const gigalith_1 = require("./gigalith");
const girafarig_1 = require("./girafarig");
const gligar_1 = require("./gligar");
const gliscor_1 = require("./gliscor");
const golbat_1 = require("./golbat");
const goodra_1 = require("./goodra");
const gourgeist_1 = require("./gourgeist");
const gulpin_1 = require("./gulpin");
const heatran_1 = require("./heatran");
const heliolisk_1 = require("./heliolisk");
const helioptile_1 = require("./helioptile");
const helioptile_2_1 = require("./helioptile-2");
const honchkrow_1 = require("./honchkrow");
const hydreigon_1 = require("./hydreigon");
const jellicent_1 = require("./jellicent");
const joltik_1 = require("./joltik");
const karrablast_1 = require("./karrablast");
const kingler_1 = require("./kingler");
const klefki_1 = require("./klefki");
const krabby_1 = require("./krabby");
const lampent_1 = require("./lampent");
const leavanny_1 = require("./leavanny");
const liepard_1 = require("./liepard");
const litleo_1 = require("./litleo");
const litwick_1 = require("./litwick");
const loudred_1 = require("./loudred");
const lumineon_1 = require("./lumineon");
const m_gengar_ex_1 = require("./m-gengar-ex");
const m_manectric_ex_1 = require("./m-manectric-ex");
const malamar_ex_1 = require("./malamar-ex");
const manectric_ex_1 = require("./manectric-ex");
const mightyena_1 = require("./mightyena");
const munna_1 = require("./munna");
const murkrow_1 = require("./murkrow");
const musharna_1 = require("./musharna");
const pachirisu_1 = require("./pachirisu");
const poochyena_1 = require("./poochyena");
const pumpkaboo_1 = require("./pumpkaboo");
const purrloin_1 = require("./purrloin");
const pyroar_1 = require("./pyroar");
const regigigas_1 = require("./regigigas");
const roggenrola_1 = require("./roggenrola");
const sewaddle_1 = require("./sewaddle");
const skarmory_1 = require("./skarmory");
const slurpuff_1 = require("./slurpuff");
const spearow_1 = require("./spearow");
const spiritomb_1 = require("./spiritomb");
const swadloon_1 = require("./swadloon");
const swalot_1 = require("./swalot");
const swirlix_1 = require("./swirlix");
const talonflame_1 = require("./talonflame");
const totodile_1 = require("./totodile");
const venomoth_1 = require("./venomoth");
const venonat_1 = require("./venonat");
const whismur_1 = require("./whismur");
const wobbuffet_1 = require("./wobbuffet");
const yanma_1 = require("./yanma");
const yanmega_1 = require("./yanmega");
const zubat_1 = require("./zubat");
const zweilous_1 = require("./zweilous");
const az_1 = require("./az");
const battle_compressor_1 = require("./battle-compressor");
const battle_compressor_team_flare_gear_1 = require("./battle-compressor-team-flare-gear");
const dimension_valley_1 = require("./dimension-valley");
const gengar_spirit_link_1 = require("./gengar-spirit-link");
const hand_scope_1 = require("./hand-scope");
const head_ringer_team_flare_hyper_gear_1 = require("./head-ringer-team-flare-hyper-gear");
const jamming_net_team_flare_hyper_gear_1 = require("./jamming-net-team-flare-hyper-gear");
const lysandres_trump_card_1 = require("./lysandres-trump-card");
const manectric_spirit_link_1 = require("./manectric-spirit-link");
const robo_substitute_team_flare_gear_1 = require("./robo-substitute-team-flare-gear");
const robo_substitutue_1 = require("./robo-substitutue");
const steel_shelter_1 = require("./steel-shelter");
const target_whistle_1 = require("./target-whistle");
const target_whistle_team_flare_gear_1 = require("./target-whistle-team-flare-gear");
const tierno_1 = require("./tierno");
const trick_coin_1 = require("./trick-coin");
const vs_seeker_1 = require("./vs-seeker");
const xerosic_1 = require("./xerosic");
const mystery_energy_1 = require("./mystery-energy");
const other_prints_1 = require("./other-prints");
exports.setPhantomForces = [
    // Pokemon
    new aegislash_ex_1.AegislashEX(),
    new alomomola_1.Alomomola(),
    new blissey_1.Blissey(),
    new boldore_1.Boldore(),
    new bronzong_1.Bronzong(),
    new bronzor_1.Bronzor(),
    new bunnelby_1.Bunnelby(),
    new chandelure_1.Chandelure(),
    new chansey_1.Chansey(),
    new crobat_1.Crobat(),
    new croconaw_1.Croconaw(),
    new dedenne_1.Dedenne(),
    new deino_1.Deino(),
    new dialga_ex_1.DialgaEx(),
    new diancie_1.Diancie(),
    new diggersby_1.Diggersby(),
    new escavalier_1.Escavalier(),
    new exploud_1.Exploud(),
    new fearow_1.Fearow(),
    new feraligatr_1.Feraligatr(),
    new finneon_1.Finneon(),
    new fletchinder_1.Fletchinder(),
    new fletchling_1.Fletchling(),
    new florges_ex_1.FlorgesEx(),
    new frillish_1.Frillish(),
    new galvantula_1.Galvantula(),
    new gengar_ex_1.GengarEx(),
    new gigalith_1.Gigalith(),
    new girafarig_1.Girafarig(),
    new gligar_1.Gligar(),
    new gliscor_1.Gliscor(),
    new golbat_1.Golbat(),
    new goodra_1.Goodra(),
    new gourgeist_1.Gourgeist(),
    new gulpin_1.Gulpin(),
    new heatran_1.Heatran(),
    new heliolisk_1.Heliolisk(),
    new helioptile_1.Helioptile(),
    new helioptile_2_1.Helioptile2(),
    new honchkrow_1.Honchkrow(),
    new hydreigon_1.Hydreigon(),
    new jellicent_1.Jellicent(),
    new joltik_1.Joltik(),
    new karrablast_1.Karrablast(),
    new kingler_1.Kingler(),
    new klefki_1.Klefki(),
    new krabby_1.Krabby(),
    new lampent_1.Lampent(),
    new leavanny_1.Leavanny(),
    new liepard_1.Liepard(),
    new litleo_1.Litleo(),
    new litwick_1.Litwick(),
    new loudred_1.Loudred(),
    new lumineon_1.Lumineon(),
    new m_gengar_ex_1.MGengarEx(),
    new m_manectric_ex_1.MManectricEx(),
    new malamar_ex_1.MalamarEx(),
    new manectric_ex_1.ManectricEx(),
    new mightyena_1.Mightyena(),
    new munna_1.Munna(),
    new murkrow_1.Murkrow(),
    new musharna_1.Musharna(),
    new pachirisu_1.Pachirisu(),
    new poochyena_1.Poochyena(),
    new pumpkaboo_1.Pumpkaboo(),
    new purrloin_1.Purrloin(),
    new pyroar_1.Pyroar(),
    new regigigas_1.Regigigas(),
    new roggenrola_1.Roggenrola(),
    new sewaddle_1.Sewaddle(),
    new skarmory_1.Skarmory(),
    new slurpuff_1.Slurpuff(),
    new spearow_1.Spearow(),
    new spiritomb_1.Spiritomb(),
    new swadloon_1.Swadloon(),
    new swalot_1.Swalot(),
    new swirlix_1.Swirlix(),
    new talonflame_1.Talonflame(),
    new totodile_1.Totodile(),
    new venomoth_1.Venomoth(),
    new venonat_1.Venonat(),
    new whismur_1.Whismur(),
    new wobbuffet_1.Wobbuffet(),
    new yanma_1.Yanma(),
    new yanmega_1.Yanmega(),
    new zubat_1.Zubat(),
    new zweilous_1.Zweilous(),
    // Trainers
    new az_1.AZ(),
    new battle_compressor_1.BattleCompressor(),
    new battle_compressor_team_flare_gear_1.BattleCompressorTeamFlareGear(),
    new dimension_valley_1.DimensionValley(),
    new gengar_spirit_link_1.GengarSpiritLink(),
    new hand_scope_1.HandScope(),
    new head_ringer_team_flare_hyper_gear_1.HeadRingerTeamFlareHyperGear(),
    new jamming_net_team_flare_hyper_gear_1.JammingNetTeamFlareHyperGear(),
    new lysandres_trump_card_1.LysandresTrumpCard(),
    new manectric_spirit_link_1.ManectricSpiritLink(),
    new robo_substitute_team_flare_gear_1.RoboSubstituteTeamFlareGear(),
    new robo_substitutue_1.RoboSubstitute(),
    new steel_shelter_1.SteelShelter(),
    new target_whistle_1.TargetWhistle(),
    new target_whistle_team_flare_gear_1.TargetWhistleTeamFlareGear(),
    new tierno_1.Tierno(),
    new trick_coin_1.TrickCoin(),
    new vs_seeker_1.VsSeeker(),
    new xerosic_1.Xerosic(),
    // Energy
    new mystery_energy_1.MysteryEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.AegislashEXPHF(),
    new other_prints_1.EnhancedHammerPHF(),
    new other_prints_1.ProfessorSycamoreXYPHF(),
    new other_prints_1.RollerSkatesPHF(),
    new other_prints_1.ShaunaPHF(),
    new other_prints_1.DoubleColorlessEnergyPHF(),
    new other_prints_1.GengarEx2PHF(),
    new other_prints_1.AZ2PHF(),
    new other_prints_1.LysandresTrumpCard2PHF(),
    new other_prints_1.Xerosic2PHF(),
    new other_prints_1.MGengarEx2PHF(),
    new other_prints_1.AegislashEX2PHF(),
    new other_prints_1.MManectricEx2(),
    new other_prints_1.GoomyPHF(),
    new other_prints_1.SliggooPHF(),
    new other_prints_1.FurfrouPHF(),
    new other_prints_1.ManectricEx2(),
    new other_prints_1.MalamarEx2(),
    new other_prints_1.FlorgesEx2(),
    new other_prints_1.MManectricEx3(),
    new other_prints_1.DialgaEx2(),
];

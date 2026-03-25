"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBreakpoint = void 0;
const aegislash_1 = require("./aegislash");
const arcanine_1 = require("./arcanine");
const aromatisse_1 = require("./aromatisse");
const bayleef_1 = require("./bayleef");
const blitzle_1 = require("./blitzle");
const camerupt_1 = require("./camerupt");
const chikorita_1 = require("./chikorita");
const clefable_1 = require("./clefable");
const clefairy_1 = require("./clefairy");
const cloyster_1 = require("./cloyster");
const corsola_1 = require("./corsola");
const darkrai_ex_1 = require("./darkrai-ex");
const doublade_1 = require("./doublade");
const dragalge_1 = require("./dragalge");
const drapion_1 = require("./drapion");
const drowzee_1 = require("./drowzee");
const ducklett_1 = require("./ducklett");
const dunsparce_1 = require("./dunsparce");
const durant_1 = require("./durant");
const electabuzz_1 = require("./electabuzz");
const electivire_1 = require("./electivire");
const emboar_ex_1 = require("./emboar-ex");
const espeon_ex_1 = require("./espeon-ex");
const espurr_1 = require("./espurr");
const ferroseed_1 = require("./ferroseed");
const ferrothorn_1 = require("./ferrothorn");
const froakie_1 = require("./froakie");
const frogadier_1 = require("./frogadier");
const furfrou_1 = require("./furfrou");
const gabite_1 = require("./gabite");
const garbodor_1 = require("./garbodor");
const garchomp_1 = require("./garchomp");
const gible_1 = require("./gible");
const glameow_1 = require("./glameow");
const golduck_1 = require("./golduck");
const golduck_break_1 = require("./golduck-break");
const greninja_1 = require("./greninja");
const greninja_break_1 = require("./greninja-break");
const growlithe_1 = require("./growlithe");
const gyarados_ex_1 = require("./gyarados-ex");
const heatmor_1 = require("./heatmor");
const ho_oh_ex_1 = require("./ho-oh-ex");
const ho_oh_ex_2_1 = require("./ho-oh-ex-2");
const honedge_1 = require("./honedge");
const hypno_1 = require("./hypno");
const kricketot_1 = require("./kricketot");
const kricketune_1 = require("./kricketune");
const lapras_1 = require("./lapras");
const lilligant_1 = require("./lilligant");
const luxio_1 = require("./luxio");
const luxray_1 = require("./luxray");
const luxray_break_1 = require("./luxray-break");
const m_gyarados_ex_1 = require("./m-gyarados-ex");
const m_scizor_ex_1 = require("./m-scizor-ex");
const manaphy_ex_1 = require("./manaphy-ex");
const mawile_1 = require("./mawile");
const meganium_1 = require("./meganium");
const meowstic_1 = require("./meowstic");
const numel_1 = require("./numel");
const nuzleaf_1 = require("./nuzleaf");
const palkia_ex_1 = require("./palkia-ex");
const palpitoad_1 = require("./palpitoad");
const pancham_1 = require("./pancham");
const pangoro_1 = require("./pangoro");
const petilil_1 = require("./petilil");
const phantump_1 = require("./phantump");
const psyduck_1 = require("./psyduck");
const purugly_1 = require("./purugly");
const raticate_1 = require("./raticate");
const raticate_break_1 = require("./raticate-break");
const rattata_1 = require("./rattata");
const scizor_ex_1 = require("./scizor-ex");
const seedot_1 = require("./seedot");
const seismitoad_1 = require("./seismitoad");
const shellder_1 = require("./shellder");
const shellder_2_1 = require("./shellder-2");
const shiftry_1 = require("./shiftry");
const shinx_1 = require("./shinx");
const sigilyph_1 = require("./sigilyph");
const skorupi_1 = require("./skorupi");
const skrelp_1 = require("./skrelp");
const slowbro_1 = require("./slowbro");
const slowking_1 = require("./slowking");
const slowpoke_1 = require("./slowpoke");
const spritzee_1 = require("./spritzee");
const stantler_1 = require("./stantler");
const staryu_1 = require("./staryu");
const sudowoodo_1 = require("./sudowoodo");
const suicune_1 = require("./suicune");
const swanna_1 = require("./swanna");
const togekiss_ex_1 = require("./togekiss-ex");
const trevenant_1 = require("./trevenant");
const trevenant_break_1 = require("./trevenant-break");
const trubbish_1 = require("./trubbish");
const tympole_1 = require("./tympole");
const zebstrika_1 = require("./zebstrika");
const all_night_party_1 = require("./all-night-party");
const bursting_balloon_1 = require("./bursting-balloon");
const delinquent_1 = require("./delinquent");
const fighting_fury_belt_1 = require("./fighting-fury-belt");
const gyarados_spirit_link_1 = require("./gyarados-spirit-link");
const max_elixir_1 = require("./max-elixir");
const psychics_third_eye_1 = require("./psychics-third-eye");
const puzzle_of_time_1 = require("./puzzle-of-time");
const reverse_valley_1 = require("./reverse-valley");
const scizor_spirit_link_1 = require("./scizor-spirit-link");
const splash_energy_1 = require("./splash-energy");
const other_prints_1 = require("./other-prints");
exports.setBreakpoint = [
    // Pokemon
    new aegislash_1.Aegislash(),
    new arcanine_1.Arcanine(),
    new aromatisse_1.Aromatisse(),
    new bayleef_1.Bayleef(),
    new blitzle_1.Blitzle(),
    new camerupt_1.Camerupt(),
    new chikorita_1.Chikorita(),
    new clefable_1.Clefable(),
    new clefairy_1.Clefairy(),
    new cloyster_1.Cloyster(),
    new corsola_1.Corsola(),
    new darkrai_ex_1.DarkraiEx(),
    new doublade_1.Doublade(),
    new dragalge_1.Dragalge(),
    new drapion_1.Drapion(),
    new drowzee_1.Drowzee(),
    new ducklett_1.Ducklett(),
    new dunsparce_1.Dunsparce(),
    new durant_1.Durant(),
    new electabuzz_1.Electabuzz(),
    new electivire_1.Electivire(),
    new emboar_ex_1.EmboarEx(),
    new espeon_ex_1.EspeonEX(),
    new espurr_1.Espurr(),
    new ferroseed_1.Ferroseed(),
    new ferrothorn_1.Ferrothorn(),
    new froakie_1.Froakie(),
    new frogadier_1.Frogadier(),
    new furfrou_1.Furfrou(),
    new gabite_1.Gabite(),
    new garbodor_1.Garbodor(),
    new garchomp_1.Garchomp(),
    new gible_1.Gible(),
    new glameow_1.Glameow(),
    new golduck_1.Golduck(),
    new golduck_break_1.GolduckBreak(),
    new greninja_1.Greninja(),
    new greninja_break_1.GreninjaBREAK(),
    new growlithe_1.Growlithe(),
    new gyarados_ex_1.GyaradosEx(),
    new heatmor_1.Heatmor(),
    new ho_oh_ex_1.HoOhEx(),
    new ho_oh_ex_2_1.HoOhEx2(),
    new honedge_1.Honedge(),
    new hypno_1.Hypno(),
    new kricketot_1.Kricketot(),
    new kricketune_1.Kricketune(),
    new lapras_1.Lapras(),
    new lilligant_1.Lilligant(),
    new luxio_1.Luxio(),
    new luxray_1.Luxray(),
    new luxray_break_1.LuxrayBreak(),
    new m_gyarados_ex_1.MGyaradosEx(),
    new m_scizor_ex_1.MScizorEx(),
    new manaphy_ex_1.ManaphyEX(),
    new mawile_1.Mawile(),
    new meganium_1.Meganium(),
    new meowstic_1.Meowstic(),
    new numel_1.Numel(),
    new nuzleaf_1.Nuzleaf(),
    new palkia_ex_1.PalkiaEx(),
    new palpitoad_1.Palpitoad(),
    new pancham_1.Pancham(),
    new pangoro_1.Pangoro(),
    new petilil_1.Petilil(),
    new phantump_1.Phantump(),
    new psyduck_1.Psyduck(),
    new purugly_1.Purugly(),
    new raticate_1.Raticate(),
    new raticate_break_1.RaticateBreak(),
    new rattata_1.Rattata(),
    new scizor_ex_1.ScizorEx(),
    new seedot_1.Seedot(),
    new seismitoad_1.Seismitoad(),
    new shellder_1.Shellder(),
    new shellder_2_1.Shellder2(),
    new shiftry_1.Shiftry(),
    new shinx_1.Shinx(),
    new sigilyph_1.Sigilyph(),
    new skorupi_1.Skorupi(),
    new skrelp_1.Skrelp(),
    new slowbro_1.Slowbro(),
    new slowking_1.Slowking(),
    new slowpoke_1.Slowpoke(),
    new spritzee_1.Spritzee(),
    new stantler_1.Stantler(),
    new staryu_1.Staryu(),
    new sudowoodo_1.Sudowoodo(),
    new suicune_1.Suicune(),
    new swanna_1.Swanna(),
    new togekiss_ex_1.TogekissEx(),
    new trevenant_1.Trevenant(),
    new trevenant_break_1.TrevenantBREAK(),
    new trubbish_1.Trubbish(),
    new tympole_1.Tympole(),
    new zebstrika_1.Zebstrika(),
    // Trainers
    new all_night_party_1.AllNightParty(),
    new bursting_balloon_1.BurstingBalloon(),
    new delinquent_1.Delinquent(),
    new fighting_fury_belt_1.FightingFuryBelt(),
    new gyarados_spirit_link_1.GyaradosSpiritLink(),
    new max_elixir_1.MaxElixir(),
    new psychics_third_eye_1.PsychicsThirdEye(),
    new puzzle_of_time_1.PuzzleOfTime(),
    new reverse_valley_1.ReverseValley(),
    new scizor_spirit_link_1.ScizorSpiritLink(),
    // Energy
    new splash_energy_1.SplashEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.GreatBallBKP(),
    new other_prints_1.MaxPotionBKP(),
    new other_prints_1.PokemonCatcherBKP(),
    new other_prints_1.PotionBKP(),
    new other_prints_1.ProfessorSycamoreXYBKP(),
    new other_prints_1.ManaphyEX2BKP(),
    new other_prints_1.SkylaBKP(),
    new other_prints_1.Delinquent2BKP(),
    new other_prints_1.Delinquent3BKP(),
    new other_prints_1.ProfessorSycamoreXY2BKP(),
    new other_prints_1.MistysDeterminationBKP(),
    new other_prints_1.TiernoBKP(),
    new other_prints_1.GyaradosEx2(),
    new other_prints_1.MGyaradosEx2(),
    new other_prints_1.EspeonEx2(),
    new other_prints_1.DarkraiEx2(),
    new other_prints_1.ScizorEx2(),
    new other_prints_1.MScizorEx2(),
    new other_prints_1.GyaradosEx3(),
];

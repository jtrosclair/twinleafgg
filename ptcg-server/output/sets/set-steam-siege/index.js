"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSteamSiege = void 0;
const aipom_1 = require("./aipom");
const ambipom_1 = require("./ambipom");
const amoonguss_1 = require("./amoonguss");
const ampharos_1 = require("./ampharos");
const anorith_1 = require("./anorith");
const armaldo_1 = require("./armaldo");
const avalugg_1 = require("./avalugg");
const azumarill_1 = require("./azumarill");
const bastiodon_1 = require("./bastiodon");
const bergmite_1 = require("./bergmite");
const bisharp_1 = require("./bisharp");
const braviary_1 = require("./braviary");
const chandelure_1 = require("./chandelure");
const chimchar_1 = require("./chimchar");
const clauncher_1 = require("./clauncher");
const clawitzer_1 = require("./clawitzer");
const clawitzer_break_1 = require("./clawitzer-break");
const cobalion_1 = require("./cobalion");
const croagunk_1 = require("./croagunk");
const deino_1 = require("./deino");
const dewott_1 = require("./dewott");
const drifblim_1 = require("./drifblim");
const drifloon_1 = require("./drifloon");
const druddigon_1 = require("./druddigon");
const flaaffy_1 = require("./flaaffy");
const fletchinder_1 = require("./fletchinder");
const fletchling_1 = require("./fletchling");
const foongus_1 = require("./foongus");
const galvantula_1 = require("./galvantula");
const gardevoir_ex_1 = require("./gardevoir-ex");
const gastrodon_1 = require("./gastrodon");
const hawlucha_1 = require("./hawlucha");
const hoopa_1 = require("./hoopa");
const hoppip_1 = require("./hoppip");
const hydreigon_1 = require("./hydreigon");
const hydreigon_break_1 = require("./hydreigon-break");
const infernape_1 = require("./infernape");
const joltik_1 = require("./joltik");
const jumpluff_1 = require("./jumpluff");
const klang_1 = require("./klang");
const klefki_1 = require("./klefki");
const klink_1 = require("./klink");
const klinklang_1 = require("./klinklang");
const lampent_1 = require("./lampent");
const larvesta_1 = require("./larvesta");
const litleo_1 = require("./litleo");
const litwick_1 = require("./litwick");
const m_gardevoir_ex_1 = require("./m-gardevoir-ex");
const m_steelix_ex_1 = require("./m-steelix-ex");
const magearna_ex_1 = require("./magearna-ex");
const mankey_1 = require("./mankey");
const mantine_1 = require("./mantine");
const mareep_1 = require("./mareep");
const marill_1 = require("./marill");
const meowth_1 = require("./meowth");
const monferno_1 = require("./monferno");
const nidoking_1 = require("./nidoking");
const nidoran_m_1 = require("./nidoran-m");
const nidorino_1 = require("./nidorino");
const nosepass_1 = require("./nosepass");
const nuzleaf_1 = require("./nuzleaf");
const oshawott_1 = require("./oshawott");
const pawniard_1 = require("./pawniard");
const persian_1 = require("./persian");
const ponyta_1 = require("./ponyta");
const primeape_1 = require("./primeape");
const probopass_1 = require("./probopass");
const pyroar_1 = require("./pyroar");
const pyroar_break_1 = require("./pyroar-break");
const rapidash_1 = require("./rapidash");
const rufflet_1 = require("./rufflet");
const samurott_1 = require("./samurott");
const seedot_1 = require("./seedot");
const shellos_1 = require("./shellos");
const shieldon_1 = require("./shieldon");
const shiftry_1 = require("./shiftry");
const skiploom_1 = require("./skiploom");
const sneasel_1 = require("./sneasel");
const spiritomb_1 = require("./spiritomb");
const steelix_ex_1 = require("./steelix-ex");
const talonflame_1 = require("./talonflame");
const talonflame_break_1 = require("./talonflame-break");
const tangela_1 = require("./tangela");
const tangrowth_1 = require("./tangrowth");
const toxicroak_1 = require("./toxicroak");
const volcanion_1 = require("./volcanion");
const volcanion_ex_1 = require("./volcanion-ex");
const volcarona_1 = require("./volcarona");
const weavile_1 = require("./weavile");
const xerneas_1 = require("./xerneas");
const xerneas_break_1 = require("./xerneas-break");
const yanma_1 = require("./yanma");
const yanmega_1 = require("./yanmega");
const yanmega_break_1 = require("./yanmega-break");
const yveltal_1 = require("./yveltal");
const yveltal_break_1 = require("./yveltal-break");
const zweilous_1 = require("./zweilous");
const armor_fossil_shieldon_1 = require("./armor-fossil-shieldon");
const captivating_poke_puff_1 = require("./captivating-poke-puff");
const claw_fossil_anorith_1 = require("./claw-fossil-anorith");
const greedy_dice_1 = require("./greedy-dice");
const ninja_boy_1 = require("./ninja-boy");
const pokemon_ranger_1 = require("./pokemon-ranger");
const special_charge_1 = require("./special-charge");
const steelix_spirit_link_1 = require("./steelix-spirit-link");
const other_prints_1 = require("./other-prints");
exports.setSteamSiege = [
    // Pokemon
    new aipom_1.Aipom(),
    new ambipom_1.Ambipom(),
    new amoonguss_1.Amoonguss(),
    new ampharos_1.Ampharos(),
    new anorith_1.Anorith(),
    new armaldo_1.Armaldo(),
    new avalugg_1.Avalugg(),
    new azumarill_1.Azumarill(),
    new bastiodon_1.Bastiodon(),
    new bergmite_1.Bergmite(),
    new bisharp_1.Bisharp(),
    new braviary_1.Braviary(),
    new chandelure_1.Chandelure(),
    new chimchar_1.Chimchar(),
    new clauncher_1.Clauncher(),
    new clawitzer_1.Clawitzer(),
    new clawitzer_break_1.ClawitzerBreak(),
    new cobalion_1.Cobalion(),
    new croagunk_1.Croagunk(),
    new deino_1.Deino(),
    new dewott_1.Dewott(),
    new drifblim_1.Drifblim(),
    new drifloon_1.Drifloon(),
    new druddigon_1.Druddigon(),
    new flaaffy_1.Flaaffy(),
    new fletchinder_1.Fletchinder(),
    new fletchling_1.Fletchling(),
    new foongus_1.Foongus(),
    new galvantula_1.Galvantula(),
    new gardevoir_ex_1.GardevoirEx(),
    new gastrodon_1.Gastrodon(),
    new hawlucha_1.Hawlucha(),
    new hoopa_1.Hoopa(),
    new hoppip_1.Hoppip(),
    new hydreigon_1.Hydreigon(),
    new hydreigon_break_1.HydreigonBreak(),
    new infernape_1.Infernape(),
    new joltik_1.Joltik(),
    new jumpluff_1.Jumpluff(),
    new klang_1.Klang(),
    new klefki_1.Klefki(),
    new klink_1.Klink(),
    new klinklang_1.Klinklang(),
    new lampent_1.Lampent(),
    new larvesta_1.Larvesta(),
    new litleo_1.Litleo(),
    new litwick_1.Litwick(),
    new m_gardevoir_ex_1.MGardevoirEx(),
    new m_steelix_ex_1.MSteelixEx(),
    new magearna_ex_1.MagearnaEX(),
    new mankey_1.Mankey(),
    new mantine_1.Mantine(),
    new mareep_1.Mareep(),
    new marill_1.Marill(),
    new meowth_1.Meowth(),
    new monferno_1.Monferno(),
    new nidoking_1.Nidoking(),
    new nidoran_m_1.NidoranM(),
    new nidorino_1.Nidorino(),
    new nosepass_1.Nosepass(),
    new nuzleaf_1.Nuzleaf(),
    new oshawott_1.Oshawott(),
    new pawniard_1.Pawniard(),
    new persian_1.Persian(),
    new ponyta_1.Ponyta(),
    new primeape_1.Primeape(),
    new probopass_1.Probopass(),
    new pyroar_1.Pyroar(),
    new pyroar_break_1.PyroarBreak(),
    new rapidash_1.Rapidash(),
    new rufflet_1.Rufflet(),
    new samurott_1.Samurott(),
    new seedot_1.Seedot(),
    new shellos_1.Shellos(),
    new shieldon_1.Shieldon(),
    new shiftry_1.Shiftry(),
    new skiploom_1.Skiploom(),
    new sneasel_1.Sneasel(),
    new spiritomb_1.Spiritomb(),
    new steelix_ex_1.SteelixEx(),
    new talonflame_1.Talonflame(),
    new talonflame_break_1.TalonflameBreak(),
    new tangela_1.Tangela(),
    new tangrowth_1.Tangrowth(),
    new toxicroak_1.Toxicroak(),
    new volcanion_1.Volcanion(),
    new volcanion_ex_1.VolcanionEX(),
    new volcarona_1.Volcarona(),
    new weavile_1.Weavile(),
    new xerneas_1.Xerneas(),
    new xerneas_break_1.XerneasBREAK(),
    new yanma_1.Yanma(),
    new yanmega_1.Yanmega(),
    new yanmega_break_1.YanmegaBreak(),
    new yveltal_1.Yveltal(),
    new yveltal_break_1.YveltalBreak(),
    new zweilous_1.Zweilous(),
    // Trainers
    new armor_fossil_shieldon_1.ArmorFossilShieldon(),
    new captivating_poke_puff_1.CaptivatingPokePuff(),
    new claw_fossil_anorith_1.ClawFossilAnorith(),
    new greedy_dice_1.GreedyDice(),
    new ninja_boy_1.NinjaBoy(),
    new pokemon_ranger_1.PokemonRanger(),
    new special_charge_1.SpecialCharge(),
    new steelix_spirit_link_1.SteelixSpiritLink(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.MagearnaEXSTS(),
    new other_prints_1.GardevoirSpiritLinkSTS(),
    new other_prints_1.VolcanionEX2STS(),
    new other_prints_1.GardevoirEx2STS(),
    new other_prints_1.MGardevoirEx2STS(),
    new other_prints_1.PokemonRanger2STS(),
    new other_prints_1.ProfessorSycamoreXYSTS(),
    new other_prints_1.VolcanionEX3STS(),
    new other_prints_1.GardevoirEx3STS(),
    new other_prints_1.SteelixEx2(),
    new other_prints_1.MSteelixEx2(),
];

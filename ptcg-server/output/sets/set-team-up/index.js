"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTeamUp = void 0;
const absol_1 = require("./absol");
const aegislash_1 = require("./aegislash");
const aerodactyl_1 = require("./aerodactyl");
const alolan_exeggutor_2_1 = require("./alolan-exeggutor-2");
const alolan_geodude_1 = require("./alolan-geodude");
const alolan_geodude_2_1 = require("./alolan-geodude-2");
const alolan_golem_1 = require("./alolan-golem");
const alolan_graveler_1 = require("./alolan-graveler");
const alolan_grimer_1 = require("./alolan-grimer");
const alolan_muk_1 = require("./alolan-muk");
const alolan_ninetales_1 = require("./alolan-ninetales");
const ampharos_gx_1 = require("./ampharos-gx");
const articuno_1 = require("./articuno");
const beedrill_1 = require("./beedrill");
const bisharp_1 = require("./bisharp");
const blastoise_1 = require("./blastoise");
const blitzle_1 = require("./blitzle");
const bronzong_1 = require("./bronzong");
const bronzor_1 = require("./bronzor");
const celebi_and_venusaur_gx_1 = require("./celebi-and-venusaur-gx");
const charizard_1 = require("./charizard");
const charmander_1 = require("./charmander");
const charmander_2_1 = require("./charmander-2");
const charmeleon_1 = require("./charmeleon");
const cobalion_gx_1 = require("./cobalion-gx");
const cosmoem_1 = require("./cosmoem");
const cosmog_1 = require("./cosmog");
const doublade_1 = require("./doublade");
const dragonair_1 = require("./dragonair");
const dragonite_1 = require("./dragonite");
const dratini_1 = require("./dratini");
const dratini_2_1 = require("./dratini-2");
const eevee_and_snorlax_gx_1 = require("./eevee-and-snorlax-gx");
const electrode_1 = require("./electrode");
const emolga_1 = require("./emolga");
const exeggcute_1 = require("./exeggcute");
const farfetchd_1 = require("./farfetchd");
const ferroseed_1 = require("./ferroseed");
const ferrothorn_1 = require("./ferrothorn");
const flaaffy_1 = require("./flaaffy");
const gengar_and_mimikyu_gx_1 = require("./gengar-and-mimikyu-gx");
const golduck_1 = require("./golduck");
const grimer_1 = require("./grimer");
const gyarados_1 = require("./gyarados");
const heliolisk_1 = require("./heliolisk");
const helioptile_1 = require("./helioptile");
const hitmonchan_1 = require("./hitmonchan");
const hitmonlee_1 = require("./hitmonlee");
const honedge_1 = require("./honedge");
const hoopa_gx_1 = require("./hoopa-gx");
const incineroar_gx_1 = require("./incineroar-gx");
const jirachi_1 = require("./jirachi");
const joltik_1 = require("./joltik");
const jynx_1 = require("./jynx");
const kabuto_1 = require("./kabuto");
const kabutops_1 = require("./kabutops");
const kakuna_1 = require("./kakuna");
const kangaskhan_1 = require("./kangaskhan");
const klefki_1 = require("./klefki");
const lapras_1 = require("./lapras");
const larvitar_1 = require("./larvitar");
const latias_and_latios_gx_1 = require("./latias-and-latios-gx");
const litten_1 = require("./litten");
const lugia_1 = require("./lugia");
const lycanroc_gx_1 = require("./lycanroc-gx");
const magikarp_1 = require("./magikarp");
const magikarp_and_wailord_gx_1 = require("./magikarp-and-wailord-gx");
const mandibuzz_1 = require("./mandibuzz");
const mankey_1 = require("./mankey");
const mareep_1 = require("./mareep");
const meowth_1 = require("./meowth");
const mightyena_1 = require("./mightyena");
const mimikyu_1 = require("./mimikyu");
const moltres_1 = require("./moltres");
const mr_mime_1 = require("./mr-mime");
const mr_mime_gx_1 = require("./mr-mime-gx");
const muk_1 = require("./muk");
const nidoking_1 = require("./nidoking");
const nidoqueen_1 = require("./nidoqueen");
const nidoran_f_1 = require("./nidoran-f");
const nidoran_female_1 = require("./nidoran-female");
const nidoran_m_1 = require("./nidoran-m");
const nidorina_1 = require("./nidorina");
const nidorino_1 = require("./nidorino");
const ninetales_1 = require("./ninetales");
const omanyte_1 = require("./omanyte");
const omastar_1 = require("./omastar");
const pancham_1 = require("./pancham");
const pangoro_1 = require("./pangoro");
const paras_1 = require("./paras");
const parasect_1 = require("./parasect");
const pawniard_1 = require("./pawniard");
const persian_1 = require("./persian");
const pidgeot_1 = require("./pidgeot");
const pidgeotto_1 = require("./pidgeotto");
const pidgey_1 = require("./pidgey");
const pidgey_2_1 = require("./pidgey-2");
const pinsir_1 = require("./pinsir");
const ponyta_1 = require("./ponyta");
const poochyena_1 = require("./poochyena");
const primeape_1 = require("./primeape");
const psyduck_1 = require("./psyduck");
const pupitar_1 = require("./pupitar");
const rapidash_1 = require("./rapidash");
const shaymin_1 = require("./shaymin");
const shaymin_prism_star_1 = require("./shaymin-prism-star");
const skarmory_1 = require("./skarmory");
const spiritomb_1 = require("./spiritomb");
const squirtle_1 = require("./squirtle");
const squirtle_2_1 = require("./squirtle-2");
const starmie_1 = require("./starmie");
const staryu_1 = require("./staryu");
const tapu_koko_1 = require("./tapu-koko");
const tapu_koko_prism_star_1 = require("./tapu-koko-prism-star");
const tauros_1 = require("./tauros");
const tentacool_1 = require("./tentacool");
const tentacruel_1 = require("./tentacruel");
const torracat_1 = require("./torracat");
const tyranitar_1 = require("./tyranitar");
const voltorb_1 = require("./voltorb");
const vullaby_1 = require("./vullaby");
const vulpix_1 = require("./vulpix");
const wartortle_1 = require("./wartortle");
const weedle_1 = require("./weedle");
const weedle_2_1 = require("./weedle-2");
const yveltal_1 = require("./yveltal");
const zangoose_1 = require("./zangoose");
const zapdos_1 = require("./zapdos");
const zebstrika_1 = require("./zebstrika");
const zeraora_1 = require("./zeraora");
const zoroark_1 = require("./zoroark");
const zorua_1 = require("./zorua");
const bills_analysis_1 = require("./bills-analysis");
const black_market_1 = require("./black-market");
const black_market_prism_star_1 = require("./black-market-prism-star");
const buff_padding_1 = require("./buff-padding");
const dana_1 = require("./dana");
const dangerous_drill_1 = require("./dangerous-drill");
const electrocharger_1 = require("./electrocharger");
const evelyn_1 = require("./evelyn");
const fairy_charm_ub_1 = require("./fairy-charm-ub");
const grass_memory_1 = require("./grass-memory");
const ingo_and_emmet_1 = require("./ingo-and-emmet");
const jasmine_1 = require("./jasmine");
const judge_whistle_1 = require("./judge-whistle");
const lavender_town_1 = require("./lavender-town");
const metal_goggles_1 = require("./metal-goggles");
const morgan_1 = require("./morgan");
const nanu_1 = require("./nanu");
const nita_1 = require("./nita");
const pokemon_communication_1 = require("./pokemon-communication");
const return_label_1 = require("./return-label");
const sabrinas_suggestion_1 = require("./sabrinas-suggestion");
const viridian_forest_1 = require("./viridian-forest");
const water_memory_1 = require("./water-memory");
const wondrous_labyrinth_1 = require("./wondrous-labyrinth");
const wondrous_labyrinth_prism_star_1 = require("./wondrous-labyrinth-prism-star");
const other_prints_1 = require("./other-prints");
const galvantula_1 = require("./galvantula");
exports.setTeamUp = [
    // Pokemon
    new absol_1.Absol(),
    new aegislash_1.Aegislash(),
    new aerodactyl_1.Aerodactyl(),
    new alolan_exeggutor_2_1.AlolanExeggutor2(),
    new alolan_geodude_1.AlolanGeodude(),
    new alolan_geodude_2_1.AlolanGeodude2(),
    new alolan_golem_1.AlolanGolem(),
    new alolan_graveler_1.AlolanGraveler(),
    new alolan_grimer_1.AlolanGrimer(),
    new alolan_muk_1.AlolanMuk(),
    new alolan_ninetales_1.AlolanNinetales(),
    new ampharos_gx_1.AmpharosGx(),
    new articuno_1.Articuno(),
    new beedrill_1.Beedrill(),
    new bisharp_1.Bisharp(),
    new blastoise_1.Blastoise(),
    new blitzle_1.Blitzle(),
    new bronzong_1.Bronzong(),
    new bronzor_1.Bronzor(),
    new celebi_and_venusaur_gx_1.CelebiVenusaurGX(),
    new charizard_1.Charizard(),
    new charmander_1.Charmander(),
    new charmander_2_1.Charmander2(),
    new charmeleon_1.Charmeleon(),
    new cobalion_gx_1.CobalionGX(),
    new cosmoem_1.Cosmoem(),
    new cosmog_1.Cosmog(),
    new doublade_1.Doublade(),
    new dragonair_1.Dragonair(),
    new dragonite_1.Dragonite(),
    new dratini_1.Dratini(),
    new dratini_2_1.Dratini2(),
    new eevee_and_snorlax_gx_1.EeveeSnorlaxGX(),
    new electrode_1.Electrode(),
    new emolga_1.Emolga(),
    new exeggcute_1.Exeggcute(),
    new farfetchd_1.Farfetchd(),
    new ferroseed_1.Ferroseed(),
    new ferrothorn_1.Ferrothorn(),
    new flaaffy_1.Flaaffy(),
    new galvantula_1.Galvantula(),
    new gengar_and_mimikyu_gx_1.GengarMimikyuGX(),
    new golduck_1.Golduck(),
    new grimer_1.Grimer(),
    new gyarados_1.Gyarados(),
    new heliolisk_1.Heliolisk(),
    new helioptile_1.Helioptile(),
    new hitmonchan_1.Hitmonchan(),
    new hitmonlee_1.Hitmonlee(),
    new honedge_1.Honedge(),
    new hoopa_gx_1.HoopaGx(),
    new incineroar_gx_1.IncineroarGx(),
    new jirachi_1.Jirachi(),
    new joltik_1.Joltik(),
    new jynx_1.Jynx(),
    new kabuto_1.Kabuto(),
    new kabutops_1.Kabutops(),
    new kakuna_1.Kakuna(),
    new kangaskhan_1.Kangaskhan(),
    new klefki_1.Klefki(),
    new lapras_1.Lapras(),
    new larvitar_1.Larvitar(),
    new latias_and_latios_gx_1.LatiasAndLatiosGx(),
    new litten_1.Litten(),
    new lugia_1.Lugia(),
    new lycanroc_gx_1.LycanrocGx(),
    new magikarp_1.Magikarp(),
    new magikarp_and_wailord_gx_1.MagikarpWailordGX(),
    new mandibuzz_1.Mandibuzz(),
    new mankey_1.Mankey(),
    new mareep_1.Mareep(),
    new meowth_1.Meowth(),
    new mightyena_1.Mightyena(),
    new mimikyu_1.Mimikyu(),
    new moltres_1.Moltres(),
    new mr_mime_1.MrMime(),
    new mr_mime_gx_1.MrMimeGX(),
    new muk_1.Muk(),
    new nidoking_1.Nidoking(),
    new nidoqueen_1.Nidoqueen(),
    new nidoran_f_1.NidoranF(),
    new nidoran_female_1.NidoranFemale(),
    new nidoran_m_1.NidoranM(),
    new nidorina_1.Nidorina(),
    new nidorino_1.Nidorino(),
    new ninetales_1.Ninetales(),
    new omanyte_1.Omanyte(),
    new omastar_1.Omastar(),
    new pancham_1.Pancham(),
    new pangoro_1.Pangoro(),
    new paras_1.Paras(),
    new parasect_1.Parasect(),
    new pawniard_1.Pawniard(),
    new persian_1.Persian(),
    new pidgeot_1.Pidgeot(),
    new pidgeotto_1.Pidgeotto(),
    new pidgey_1.Pidgey(),
    new pidgey_2_1.Pidgey2(),
    new pinsir_1.Pinsir(),
    new ponyta_1.Ponyta(),
    new poochyena_1.Poochyena(),
    new primeape_1.Primeape(),
    new psyduck_1.Psyduck(),
    new pupitar_1.Pupitar(),
    new rapidash_1.Rapidash(),
    new shaymin_1.Shaymin(),
    new shaymin_prism_star_1.ShayminPrismStar(),
    new skarmory_1.Skarmory(),
    new spiritomb_1.Spiritomb(),
    new squirtle_1.Squirtle(),
    new squirtle_2_1.Squirtle2(),
    new starmie_1.Starmie(),
    new staryu_1.Staryu(),
    new tapu_koko_1.TapuKoko(),
    new tapu_koko_prism_star_1.TapuKokoPrismStar(),
    new tauros_1.Tauros(),
    new tentacool_1.Tentacool(),
    new tentacruel_1.Tentacruel(),
    new torracat_1.Torracat(),
    new tyranitar_1.Tyranitar(),
    new voltorb_1.Voltorb(),
    new vullaby_1.Vullaby(),
    new vulpix_1.Vulpix(),
    new wartortle_1.Wartortle(),
    new weedle_1.Weedle(),
    new weedle_2_1.Weedle2(),
    new yveltal_1.Yveltal(),
    new zangoose_1.Zangoose(),
    new zapdos_1.Zapdos(),
    new zebstrika_1.Zebstrika(),
    new zeraora_1.Zeraora(),
    new zoroark_1.Zoroark(),
    new zorua_1.Zorua(),
    // Trainers
    new bills_analysis_1.BillsAnalysis(),
    new black_market_1.BlackMarket(),
    new black_market_prism_star_1.BlackMarketPrismStar(),
    new buff_padding_1.BuffPadding(),
    new dana_1.Dana(),
    new dangerous_drill_1.DangerousDrill(),
    new electrocharger_1.Electrocharger(),
    new evelyn_1.Evelyn(),
    new fairy_charm_ub_1.FairyCharmUb(),
    new grass_memory_1.GrassMemory(),
    new ingo_and_emmet_1.IngoAndEmmet(),
    new jasmine_1.Jasmine(),
    new judge_whistle_1.JudgeWhistle(),
    new lavender_town_1.LavenderTown(),
    new metal_goggles_1.MetalGoggles(),
    new morgan_1.Morgan(),
    new nanu_1.Nanu(),
    new nita_1.Nita(),
    new pokemon_communication_1.PokemonCommunication(),
    new return_label_1.ReturnLabel(),
    new sabrinas_suggestion_1.SabrinasSuggestion(),
    new viridian_forest_1.ViridianForest(),
    new water_memory_1.WaterMemory(),
    new wondrous_labyrinth_1.WondrousLabyrinth(),
    new wondrous_labyrinth_prism_star_1.WondrousLabyrinthPrismStar(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.BrocksGritTEU(),
    new other_prints_1.PikachuZekromGXTEU(),
    new other_prints_1.ErikasHospitalityTEU(),
    new other_prints_1.UnidentifiedFossilTEU(),
    new other_prints_1.CelebiVenusaurGX2TEU(),
    new other_prints_1.MagikarpWailordGX2TEU(),
    new other_prints_1.PikachuZekromGX2TEU(),
    new other_prints_1.GengarMimikyuGX2TEU(),
    new other_prints_1.GengarMimikyuGX3TEU(),
    new other_prints_1.CobalionGX2TEU(),
    new other_prints_1.EeveeSnorlaxGX2TEU(),
    new other_prints_1.BrocksGrit2TEU(),
    new other_prints_1.ErikasHospitality2TEU(),
    new other_prints_1.IngoAndEmmet2TEU(),
    new other_prints_1.Jasmine2TEU(),
    new other_prints_1.CelebiVenusaurGX3TEU(),
    new other_prints_1.MagikarpWailordGX3TEU(),
    new other_prints_1.PikachuZekromGX3TEU(),
    new other_prints_1.GengarMimikyuGX4TEU(),
    new other_prints_1.CobalionGX3TEU(),
    new other_prints_1.EeveeSnorlaxGX3TEU(),
    new other_prints_1.DangerousDrill2TEU(),
    new other_prints_1.JudgeWhistle2TEU(),
    new other_prints_1.MetalGoggles2TEU(),
    new other_prints_1.PokemonCommunicationHS4TEU(),
    new other_prints_1.PokemonCommunicationHS2TEU(),
    new other_prints_1.PokemonCommunicationHS3TEU(),
    new other_prints_1.GrassEnergyTEU(),
    new other_prints_1.FireEnergyTEU(),
    new other_prints_1.WaterEnergyTEU(),
    new other_prints_1.LightningEnergyTEU(),
    new other_prints_1.PsychicEnergyTEU(),
    new other_prints_1.FightingEnergyTEU(),
    new other_prints_1.DarknessEnergyTEU(),
    new other_prints_1.MetalEnergyTEU(),
    new other_prints_1.FairyEnergyTEU(),
    new other_prints_1.AlolanMarowakTEU(),
    new other_prints_1.AlolanExeggutorTEU(),
    new other_prints_1.AmpharosGx2(),
    new other_prints_1.HoopaGx2(),
    new other_prints_1.IncineroarGx2(),
    new other_prints_1.LatiasAndLatiosGx2(),
    new other_prints_1.LatiasAndLatiosGx3(),
    new other_prints_1.Dana2(),
    new other_prints_1.Evelyn2(),
    new other_prints_1.Morgan2(),
    new other_prints_1.Nanu2(),
    new other_prints_1.Nita2(),
    new other_prints_1.SabrinasSuggestion2(),
    new other_prints_1.AmpharosGx3(),
    new other_prints_1.HoopaGx3(),
    new other_prints_1.IncineroarGx3(),
    new other_prints_1.LatiasAndLatiosGx4(),
    new other_prints_1.Electrocharger2(),
];

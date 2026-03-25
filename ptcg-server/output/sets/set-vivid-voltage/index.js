"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVividVoltage = void 0;
const aegislash_v_1 = require("./aegislash-v");
const aegislash_vmax_1 = require("./aegislash-vmax");
const alakazam_v_1 = require("./alakazam-v");
const alcremie_1 = require("./alcremie");
const ampharos_v_1 = require("./ampharos-v");
const arrokuda_1 = require("./arrokuda");
const banette_1 = require("./banette");
const barraskewda_1 = require("./barraskewda");
const beedrill_1 = require("./beedrill");
const beldum_1 = require("./beldum");
const blitzle_1 = require("./blitzle");
const celebi_1 = require("./celebi");
const charizard_1 = require("./charizard");
const charmander_1 = require("./charmander");
const charmeleon_1 = require("./charmeleon");
const chatot_1 = require("./chatot");
const chewtle_1 = require("./chewtle");
const chimecho_1 = require("./chimecho");
const clefable_1 = require("./clefable");
const clefairy_1 = require("./clefairy");
const clobbopus_1 = require("./clobbopus");
const coalossal_v_1 = require("./coalossal-v");
const coalossal_vmax_1 = require("./coalossal-vmax");
const cottonee_1 = require("./cottonee");
const cramorant_1 = require("./cramorant");
const dedenne_1 = require("./dedenne");
const dewott_1 = require("./dewott");
const dhelmise_1 = require("./dhelmise");
const dialga_1 = require("./dialga");
const diancie_1 = require("./diancie");
const donphan_1 = require("./donphan");
const drapion_v_1 = require("./drapion-v");
const drednaw_1 = require("./drednaw");
const drilbur_1 = require("./drilbur");
const duraludon_1 = require("./duraludon");
const dusclops_1 = require("./dusclops");
const dusknoir_1 = require("./dusknoir");
const duskull_1 = require("./duskull");
const eelektrik_1 = require("./eelektrik");
const eelektross_1 = require("./eelektross");
const eevee_1 = require("./eevee");
const electrike_1 = require("./electrike");
const electrode_1 = require("./electrode");
const excadrill_1 = require("./excadrill");
const exeggcute_1 = require("./exeggcute");
const exeggutor_1 = require("./exeggutor");
const exploud_1 = require("./exploud");
const ferroseed_1 = require("./ferroseed");
const ferrothorn_1 = require("./ferrothorn");
const flareon_1 = require("./flareon");
const forretress_1 = require("./forretress");
const full_art_1 = require("./full-art");
const galarian_darmanitan_v_1 = require("./galarian-darmanitan-v");
const galarian_darmanitan_vmax_1 = require("./galarian-darmanitan-vmax");
const galarian_meowth_1 = require("./galarian-meowth");
const galarian_obstagoon_1 = require("./galarian-obstagoon");
const galarian_perrserker_1 = require("./galarian-perrserker");
const galarian_sirfetchd_v_1 = require("./galarian-sirfetchd-v");
const galarian_stunfisk_1 = require("./galarian-stunfisk");
const galvantula_1 = require("./galvantula");
const garbodor_1 = require("./garbodor");
const genesect_1 = require("./genesect");
const girafarig_1 = require("./girafarig");
const gogoat_1 = require("./gogoat");
const grapploct_1 = require("./grapploct");
const hitmontop_1 = require("./hitmontop");
const jirachi_1 = require("./jirachi");
const jolteon_1 = require("./jolteon");
const joltik_1 = require("./joltik");
const kakuna_1 = require("./kakuna");
const krokorok_1 = require("./krokorok");
const krookodile_1 = require("./krookodile");
const loudred_1 = require("./loudred");
const lucario_1 = require("./lucario");
const lugia_1 = require("./lugia");
const lycanroc_1 = require("./lycanroc");
const magcargo_1 = require("./magcargo");
const magearna_1 = require("./magearna");
const manectric_1 = require("./manectric");
const metagross_1 = require("./metagross");
const metang_1 = require("./metang");
const mightyena_1 = require("./mightyena");
const milcery_1 = require("./milcery");
const mudbray_1 = require("./mudbray");
const mudsdale_1 = require("./mudsdale");
const nincada_1 = require("./nincada");
const ninjask_1 = require("./ninjask");
const nuzleaf_1 = require("./nuzleaf");
const oranguru_1 = require("./oranguru");
const orbeetle_v_1 = require("./orbeetle-v");
const orbeetle_vmax_1 = require("./orbeetle-vmax");
const oshawott_1 = require("./oshawott");
const phanpy_1 = require("./phanpy");
const pikachu_v_1 = require("./pikachu-v");
const pikachu_vmax_1 = require("./pikachu-vmax");
const pikipek_1 = require("./pikipek");
const pincurchin_1 = require("./pincurchin");
const pineco_1 = require("./pineco");
const poochyena_1 = require("./poochyena");
const quagsire_1 = require("./quagsire");
const raikou_1 = require("./raikou");
const rayquaza_1 = require("./rayquaza");
const regirock_1 = require("./regirock");
const riolu_1 = require("./riolu");
const rockruff_1 = require("./rockruff");
const sableye_1 = require("./sableye");
const samurott_1 = require("./samurott");
const sandile_1 = require("./sandile");
const seedot_1 = require("./seedot");
const shaymin_1 = require("./shaymin");
const shedinja_1 = require("./shedinja");
const shiftry_1 = require("./shiftry");
const shuckle_1 = require("./shuckle");
const shuppet_1 = require("./shuppet");
const skiddo_1 = require("./skiddo");
const slugma_1 = require("./slugma");
const snorlax_1 = require("./snorlax");
const steelix_v_1 = require("./steelix-v");
const swellow_1 = require("./swellow");
const swoobat_1 = require("./swoobat");
const taillow_1 = require("./taillow");
const talonflame_v_1 = require("./talonflame-v");
const terrakion_1 = require("./terrakion");
const togekiss_v_1 = require("./togekiss-v");
const togekiss_vmax_1 = require("./togekiss-vmax");
const tornadus_1 = require("./tornadus");
const toucannon_1 = require("./toucannon");
const trubbish_1 = require("./trubbish");
const trumbeak_1 = require("./trumbeak");
const tynamo_1 = require("./tynamo");
const vaporeon_1 = require("./vaporeon");
const voltorb_1 = require("./voltorb");
const wailmer_1 = require("./wailmer");
const wailord_1 = require("./wailord");
const weedle_1 = require("./weedle");
const whimsicott_1 = require("./whimsicott");
const whismur_1 = require("./whismur");
const woobat_1 = require("./woobat");
const wooper_1 = require("./wooper");
const xerneas_1 = require("./xerneas");
const yanma_1 = require("./yanma");
const yanmega_1 = require("./yanmega");
const zacian_1 = require("./zacian");
const zamazenta_1 = require("./zamazenta");
const zapdos_1 = require("./zapdos");
const zarude_v_1 = require("./zarude-v");
const zebstrika_1 = require("./zebstrika");
const zekrom_1 = require("./zekrom");
const zeraora_1 = require("./zeraora");
const zygarde_1 = require("./zygarde");
const allister_1 = require("./allister");
const bea_1 = require("./bea");
const beauty_1 = require("./beauty");
const cara_liss_1 = require("./cara-liss");
const circhester_bath_1 = require("./circhester-bath");
const drone_rotom_1 = require("./drone-rotom");
const heros_medal_1 = require("./heros-medal");
const league_staff_1 = require("./league-staff");
const leon_1 = require("./leon");
const memory_capsule_1 = require("./memory-capsule");
const moomoo_cheese_1 = require("./moomoo-cheese");
const nessa_1 = require("./nessa");
const opal_1 = require("./opal");
const telescopic_sight_1 = require("./telescopic-sight");
const wyndon_stadium_1 = require("./wyndon-stadium");
const aromatic_grass_energy_1 = require("./aromatic-grass-energy");
const coating_metal_energy_1 = require("./coating-metal-energy");
const stone_fighting_energy_1 = require("./stone-fighting-energy");
const wash_water_energy_1 = require("./wash-water-energy");
const other_prints_1 = require("./other-prints");
exports.setVividVoltage = [
    // Pokemon
    new aegislash_v_1.AegislashV(),
    new aegislash_vmax_1.AegislashVmax(),
    new alakazam_v_1.AlakazamV(),
    new alcremie_1.Alcremie(),
    new ampharos_v_1.AmpharosV(),
    new arrokuda_1.Arrokuda(),
    new banette_1.Banette(),
    new barraskewda_1.Barraskewda(),
    new beedrill_1.Beedrill(),
    new beldum_1.Beldum(),
    new blitzle_1.Blitzle(),
    new celebi_1.Celebi(),
    new charizard_1.Charizard(),
    new charmander_1.Charmander(),
    new charmeleon_1.Charmeleon(),
    new chatot_1.Chatot(),
    new chewtle_1.Chewtle(),
    new chimecho_1.Chimecho(),
    new clefable_1.Clefable(),
    new clefairy_1.Clefairy(),
    new clobbopus_1.Clobbopus(),
    new coalossal_v_1.CoalossalV(),
    new coalossal_vmax_1.CoalossalVmax(),
    new cottonee_1.Cottonee(),
    new cramorant_1.Cramorant(),
    new dedenne_1.Dedenne(),
    new dewott_1.Dewott(),
    new dhelmise_1.Dhelmise(),
    new dialga_1.Dialga(),
    new diancie_1.Diancie(),
    new donphan_1.Donphan(),
    new drapion_v_1.DrapionV(),
    new drednaw_1.Drednaw(),
    new drilbur_1.Drilbur(),
    new duraludon_1.Duraludon(),
    new dusclops_1.Dusclops(),
    new dusknoir_1.Dusknoir(),
    new duskull_1.Duskull(),
    new eelektrik_1.Eelektrik(),
    new eelektross_1.Eelektross(),
    new eevee_1.Eevee(),
    new electrike_1.Electrike(),
    new electrode_1.Electrode(),
    new excadrill_1.Excadrill(),
    new exeggcute_1.Exeggcute(),
    new exeggutor_1.Exeggutor(),
    new exploud_1.Exploud(),
    new ferroseed_1.Ferroseed(),
    new ferrothorn_1.Ferrothorn(),
    new flareon_1.Flareon(),
    new forretress_1.Forretress(),
    new full_art_1.TalonflameVFA(),
    new galarian_darmanitan_v_1.GalarianDarmanitanV(),
    new galarian_darmanitan_vmax_1.GalarianDarmanitanVmax(),
    new galarian_meowth_1.GalarianMeowth(),
    new galarian_obstagoon_1.GalarianObstagoon(),
    new galarian_perrserker_1.GalarianPerrserker(),
    new galarian_sirfetchd_v_1.GalarianSirfetchdV(),
    new galarian_stunfisk_1.GalarianStunfisk(),
    new galvantula_1.Galvantula(),
    new garbodor_1.Garbodor(),
    new genesect_1.Genesect(),
    new girafarig_1.Girafarig(),
    new gogoat_1.Gogoat(),
    new grapploct_1.Grapploct(),
    new hitmontop_1.Hitmontop(),
    new jirachi_1.Jirachi(),
    new jolteon_1.Jolteon(),
    new joltik_1.Joltik(),
    new kakuna_1.Kakuna(),
    new krokorok_1.Krokorok(),
    new krookodile_1.Krookodile(),
    new loudred_1.Loudred(),
    new lucario_1.Lucario(),
    new lugia_1.Lugia(),
    new lycanroc_1.Lycanroc(),
    new magcargo_1.Magcargo(),
    new magearna_1.Magearna(),
    new manectric_1.Manectric(),
    new metagross_1.Metagross(),
    new metang_1.Metang(),
    new mightyena_1.Mightyena(),
    new milcery_1.Milcery(),
    new mudbray_1.Mudbray(),
    new mudsdale_1.Mudsdale(),
    new nincada_1.Nincada(),
    new ninjask_1.Ninjask(),
    new nuzleaf_1.Nuzleaf(),
    new oranguru_1.Oranguru(),
    new orbeetle_v_1.OrbeetleV(),
    new orbeetle_vmax_1.OrbeetleVmax(),
    new oshawott_1.Oshawott(),
    new phanpy_1.Phanpy(),
    new pikachu_v_1.PikachuV(),
    new pikachu_vmax_1.PikachuVmax(),
    new pikipek_1.Pikipek(),
    new pincurchin_1.Pincurchin(),
    new pineco_1.Pineco(),
    new poochyena_1.Poochyena(),
    new quagsire_1.Quagsire(),
    new raikou_1.Raikou(),
    new rayquaza_1.Rayquaza(),
    new regirock_1.Regirock(),
    new riolu_1.Riolu(),
    new rockruff_1.Rockruff(),
    new sableye_1.Sableye(),
    new samurott_1.Samurott(),
    new sandile_1.Sandile(),
    new seedot_1.Seedot(),
    new shaymin_1.Shaymin(),
    new shedinja_1.Shedinja(),
    new shiftry_1.Shiftry(),
    new shuckle_1.Shuckle(),
    new shuppet_1.Shuppet(),
    new skiddo_1.Skiddo(),
    new slugma_1.Slugma(),
    new snorlax_1.Snorlax(),
    new steelix_v_1.SteelixV(),
    new swellow_1.Swellow(),
    new swoobat_1.Swoobat(),
    new taillow_1.Taillow(),
    new talonflame_v_1.TalonflameV(),
    new terrakion_1.Terrakion(),
    new togekiss_v_1.TogekissV(),
    new togekiss_vmax_1.TogekissVmax(),
    new tornadus_1.Tornadus(),
    new toucannon_1.Toucannon(),
    new trubbish_1.Trubbish(),
    new trumbeak_1.Trumbeak(),
    new tynamo_1.Tynamo(),
    new vaporeon_1.Vaporeon(),
    new voltorb_1.Voltorb(),
    new wailmer_1.Wailmer(),
    new wailord_1.Wailord(),
    new weedle_1.Weedle(),
    new whimsicott_1.Whimsicott(),
    new whismur_1.Whismur(),
    new woobat_1.Woobat(),
    new wooper_1.Wooper(),
    new xerneas_1.Xerneas(),
    new yanma_1.Yanma(),
    new yanmega_1.Yanmega(),
    new zacian_1.Zacian(),
    new zamazenta_1.Zamazenta(),
    new zapdos_1.Zapdos(),
    new zarude_v_1.ZarudeV(),
    new zebstrika_1.Zebstrika(),
    new zekrom_1.Zekrom(),
    new zeraora_1.Zeraora(),
    new zygarde_1.Zygarde(),
    // Trainers
    new allister_1.Allister(),
    new bea_1.Bea(),
    new beauty_1.Beauty(),
    new cara_liss_1.CaraLiss(),
    new circhester_bath_1.CirchesterBath(),
    new drone_rotom_1.DroneRotom(),
    new heros_medal_1.HerosMedal(),
    new league_staff_1.LeagueStaff(),
    new leon_1.Leon(),
    new memory_capsule_1.MemoryCapsule(),
    new moomoo_cheese_1.MoomooCheese(),
    new nessa_1.Nessa(),
    new opal_1.Opal(),
    new telescopic_sight_1.TelescopicSight(),
    new wyndon_stadium_1.WyndonStadium(),
    // Energy
    new aromatic_grass_energy_1.AromaticGrassEnergy(),
    new coating_metal_energy_1.CoatingMetalEnergy(),
    new stone_fighting_energy_1.StoneFightingEnergy(),
    new wash_water_energy_1.WashWaterEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.RockyHelmetVIV(),
    new other_prints_1.OrbeetleV2(),
    new other_prints_1.ZarudeV2(),
    new other_prints_1.TalonflameV2(),
    new other_prints_1.GalarianDarmanitanV2(),
    new other_prints_1.PikachuV2(),
    new other_prints_1.AmpharosV2(),
    new other_prints_1.CoalossalV2(),
    new other_prints_1.DrapionV2(),
    new other_prints_1.SteelixV2(),
    new other_prints_1.AegislashV2(),
    new other_prints_1.TogekissV2(),
    new other_prints_1.Allister2(),
    new other_prints_1.Bea2(),
    new other_prints_1.Beauty2(),
    new other_prints_1.Leon2(),
    new other_prints_1.Nessa2(),
    new other_prints_1.Opal2(),
    new other_prints_1.PokemonCenterLadyVIV(),
    new other_prints_1.OrbeetleVmax2(),
    new other_prints_1.GalarianDarmanitanVmax2(),
    new other_prints_1.PikachuVmax2(),
    new other_prints_1.CoalossalVmax2(),
    new other_prints_1.AegislashVmax2(),
    new other_prints_1.TogekissVmax2(),
    new other_prints_1.Allister3(),
    new other_prints_1.Bea3(),
    new other_prints_1.Beauty3(),
    new other_prints_1.Leon3(),
    new other_prints_1.Nessa3(),
    new other_prints_1.Opal3(),
    new other_prints_1.CapeOfToughnessVIV(),
    new other_prints_1.HerosMedal2(),
    new other_prints_1.MemoryCapsule2(),
    new other_prints_1.TelescopicSight2(),
];

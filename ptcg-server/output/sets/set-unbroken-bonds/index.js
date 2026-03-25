"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUnbrokenBonds = void 0;
const aggron_1 = require("./aggron");
const alolan_diglett_1 = require("./alolan-diglett");
const alolan_dugtrio_1 = require("./alolan-dugtrio");
const arbok_1 = require("./arbok");
const arcanine_1 = require("./arcanine");
const aromatisse_1 = require("./aromatisse");
const aron_1 = require("./aron");
const bellsprout_1 = require("./bellsprout");
const blacephalon_1 = require("./blacephalon");
const blastoise_gx_1 = require("./blastoise-gx");
const butterfree_1 = require("./butterfree");
const carvanha_1 = require("./carvanha");
const caterpie_1 = require("./caterpie");
const celesteela_gx_1 = require("./celesteela-gx");
const charjabug_1 = require("./charjabug");
const chatot_1 = require("./chatot");
const clefable_1 = require("./clefable");
const clefairy_1 = require("./clefairy");
const cleffa_1 = require("./cleffa");
const cottonee_1 = require("./cottonee");
const crabominable_1 = require("./crabominable");
const crabrawler_1 = require("./crabrawler");
const crobat_1 = require("./crobat");
const cubone_1 = require("./cubone");
const darmanitan_1 = require("./darmanitan");
const darumaka_1 = require("./darumaka");
const dedenne_gx_1 = require("./dedenne-gx");
const dewgong_1 = require("./dewgong");
const diglett_1 = require("./diglett");
const dodrio_1 = require("./dodrio");
const doduo_1 = require("./doduo");
const drowzee_1 = require("./drowzee");
const dugtrio_1 = require("./dugtrio");
const ekans_1 = require("./ekans");
const espurr_1 = require("./espurr");
const fearow_1 = require("./fearow");
const froakie_1 = require("./froakie");
const frogadier_1 = require("./frogadier");
const gardevoir_and_sylveon_gx_1 = require("./gardevoir-and-sylveon-gx");
const gastly_1 = require("./gastly");
const gastly_2_1 = require("./gastly-2");
const genesect_1 = require("./genesect");
const gengar_1 = require("./gengar");
const geodude_1 = require("./geodude");
const glameow_1 = require("./glameow");
const gligar_1 = require("./gligar");
const gliscor_1 = require("./gliscor");
const gloom_1 = require("./gloom");
const golbat_1 = require("./golbat");
const goldeen_1 = require("./goldeen");
const golem_1 = require("./golem");
const graveler_1 = require("./graveler");
const greninja_1 = require("./greninja");
const growlithe_1 = require("./growlithe");
const grubbin_1 = require("./grubbin");
const happiny_1 = require("./happiny");
const haunter_1 = require("./haunter");
const hitmontop_1 = require("./hitmontop");
const honchkrow_gx_1 = require("./honchkrow-gx");
const hypno_1 = require("./hypno");
const incineroar_1 = require("./incineroar");
const inkay_1 = require("./inkay");
const jigglypuff_1 = require("./jigglypuff");
const kartana_1 = require("./kartana");
const kingler_1 = require("./kingler");
const koffing_1 = require("./koffing");
const krabby_1 = require("./krabby");
const krokorok_1 = require("./krokorok");
const krookodile_1 = require("./krookodile");
const kyurem_1 = require("./kyurem");
const lairon_1 = require("./lairon");
const landorus_1 = require("./landorus");
const lickilicky_1 = require("./lickilicky");
const lickitung_1 = require("./lickitung");
const litten_1 = require("./litten");
const litten_2_1 = require("./litten-2");
const lucario_1 = require("./lucario");
const lucario_and_melmetal_gx_1 = require("./lucario-and-melmetal-gx");
const malamar_1 = require("./malamar");
const marowak_1 = require("./marowak");
const marshadow_1 = require("./marshadow");
const marshadow_and_machamp_gx_1 = require("./marshadow-and-machamp-gx");
const melmetal_1 = require("./melmetal");
const meltan_1 = require("./meltan");
const meowstic_1 = require("./meowstic");
const meowth_1 = require("./meowth");
const metapod_1 = require("./metapod");
const mew_1 = require("./mew");
const mewtwo_1 = require("./mewtwo");
const misdreavus_1 = require("./misdreavus");
const mismagius_1 = require("./mismagius");
const muk_and_alolan_muk_gx_1 = require("./muk-and-alolan-muk-gx");
const murkrow_1 = require("./murkrow");
const oddish_1 = require("./oddish");
const oddish_2_1 = require("./oddish-2");
const persian_1 = require("./persian");
const persian_gx_1 = require("./persian-gx");
const pikachu_1 = require("./pikachu");
const poliwag_1 = require("./poliwag");
const poliwag_2_1 = require("./poliwag-2");
const poliwhirl_1 = require("./poliwhirl");
const poliwrath_1 = require("./poliwrath");
const porygon_1 = require("./porygon");
const porygon_2_1 = require("./porygon-2");
const porygon_z_1 = require("./porygon-z");
const porygon2_1 = require("./porygon2");
const purugly_1 = require("./purugly");
const pyukumuku_1 = require("./pyukumuku");
const quagsire_1 = require("./quagsire");
const raichu_1 = require("./raichu");
const raticate_1 = require("./raticate");
const rattata_1 = require("./rattata");
const reshiram_and_charizard_gx_1 = require("./reshiram-and-charizard-gx");
const rhydon_1 = require("./rhydon");
const rhyhorn_1 = require("./rhyhorn");
const rhyhorn_2_1 = require("./rhyhorn-2");
const rhyperior_1 = require("./rhyperior");
const riolu_1 = require("./riolu");
const salandit_1 = require("./salandit");
const salazzle_1 = require("./salazzle");
const sandile_1 = require("./sandile");
const sandile_2_1 = require("./sandile-2");
const sandshrew_1 = require("./sandshrew");
const sandslash_1 = require("./sandslash");
const seaking_1 = require("./seaking");
const seel_1 = require("./seel");
const sharpedo_1 = require("./sharpedo");
const slowbro_1 = require("./slowbro");
const slowpoke_1 = require("./slowpoke");
const snorlax_1 = require("./snorlax");
const spearow_1 = require("./spearow");
const spiritomb_1 = require("./spiritomb");
const spritzee_1 = require("./spritzee");
const squirtle_1 = require("./squirtle");
const stunfisk_1 = require("./stunfisk");
const tangela_1 = require("./tangela");
const tangrowth_1 = require("./tangrowth");
const tentacool_1 = require("./tentacool");
const tentacruel_1 = require("./tentacruel");
const togekiss_1 = require("./togekiss");
const togepi_1 = require("./togepi");
const togetic_1 = require("./togetic");
const torracat_1 = require("./torracat");
const tyrogue_1 = require("./tyrogue");
const venomoth_1 = require("./venomoth");
const venomoth_gx_1 = require("./venomoth-gx");
const venonat_1 = require("./venonat");
const venonat_2_1 = require("./venonat-2");
const victreebel_1 = require("./victreebel");
const vikavolt_1 = require("./vikavolt");
const vileplume_1 = require("./vileplume");
const volcanion_1 = require("./volcanion");
const wartortle_1 = require("./wartortle");
const weepinbell_1 = require("./weepinbell");
const weezing_1 = require("./weezing");
const whimsicott_gx_1 = require("./whimsicott-gx");
const wigglytuff_1 = require("./wigglytuff");
const wooper_1 = require("./wooper");
const zeraora_1 = require("./zeraora");
const zubat_1 = require("./zubat");
const beast_bringer_1 = require("./beast-bringer");
const chip_chip_ice_axe_1 = require("./chip-chip-ice-axe");
const devolution_spray_z_1 = require("./devolution-spray-z");
const dusk_stone_1 = require("./dusk-stone");
const dust_island_1 = require("./dust-island");
const electromagnetic_radar_1 = require("./electromagnetic-radar");
const energy_spinner_1 = require("./energy-spinner");
const fairy_charm_ability_1 = require("./fairy-charm-ability");
const fairy_charm_lightning_1 = require("./fairy-charm-lightning");
const fire_crystal_1 = require("./fire-crystal");
const giovannis_exile_1 = require("./giovannis-exile");
const greens_exploration_1 = require("./greens-exploration");
const janine_1 = require("./janine");
const kogas_trap_1 = require("./kogas-trap");
const lt_surges_strategy_1 = require("./lt-surges-strategy");
const martial_arts_dojo_1 = require("./martial-arts-dojo");
const metal_core_barrier_1 = require("./metal-core-barrier");
const molayne_1 = require("./molayne");
const power_plant_1 = require("./power-plant");
const reds_challenge_1 = require("./reds-challenge");
const samson_oak_1 = require("./samson-oak");
const stealthy_hood_1 = require("./stealthy-hood");
const surprise_box_1 = require("./surprise-box");
const ultra_forest_kartenvoy_1 = require("./ultra-forest-kartenvoy");
const triple_acceleration_energy_1 = require("./triple-acceleration-energy");
const other_prints_1 = require("./other-prints");
const greninja_and_zoroark_gx_1 = require("./greninja-and-zoroark-gx");
const pheromosa_and_buzzwole_gx_1 = require("./pheromosa-and-buzzwole-gx");
exports.setUnbrokenBonds = [
    // Pokemon
    new aggron_1.Aggron(),
    new alolan_diglett_1.AlolanDiglett(),
    new alolan_dugtrio_1.AlolanDugtrio(),
    new arbok_1.Arbok(),
    new arcanine_1.Arcanine(),
    new aromatisse_1.Aromatisse(),
    new aron_1.Aron(),
    new bellsprout_1.Bellsprout(),
    new blacephalon_1.Blacephalon(),
    new blastoise_gx_1.BlastoiseGx(),
    new butterfree_1.Butterfree(),
    new carvanha_1.Carvanha(),
    new caterpie_1.Caterpie(),
    new celesteela_gx_1.CelesteelaGx(),
    new charjabug_1.Charjabug(),
    new chatot_1.Chatot(),
    new clefable_1.Clefable(),
    new clefairy_1.Clefairy(),
    new cleffa_1.Cleffa(),
    new cottonee_1.Cottonee(),
    new crabominable_1.Crabominable(),
    new crabrawler_1.Crabrawler(),
    new crobat_1.Crobat(),
    new cubone_1.Cubone(),
    new darmanitan_1.Darmanitan(),
    new darumaka_1.Darumaka(),
    new dedenne_gx_1.DedenneGX(),
    new dewgong_1.Dewgong(),
    new diglett_1.Diglett(),
    new dodrio_1.Dodrio(),
    new doduo_1.Doduo(),
    new drowzee_1.Drowzee(),
    new dugtrio_1.Dugtrio(),
    new ekans_1.Ekans(),
    new espurr_1.Espurr(),
    new fearow_1.Fearow(),
    new froakie_1.Froakie(),
    new frogadier_1.Frogadier(),
    new gardevoir_and_sylveon_gx_1.GardevoirSylveonGX(),
    new gastly_1.Gastly(),
    new gastly_2_1.Gastly2(),
    new genesect_1.Genesect(),
    new gengar_1.Gengar(),
    new geodude_1.Geodude(),
    new glameow_1.Glameow(),
    new gligar_1.Gligar(),
    new gliscor_1.Gliscor(),
    new gloom_1.Gloom(),
    new golbat_1.Golbat(),
    new goldeen_1.Goldeen(),
    new golem_1.Golem(),
    new graveler_1.Graveler(),
    new greninja_1.Greninja(),
    new greninja_and_zoroark_gx_1.GreninjaAndZoroarkGX(),
    new growlithe_1.Growlithe(),
    new grubbin_1.Grubbin(),
    new happiny_1.Happiny(),
    new haunter_1.Haunter(),
    new hitmontop_1.Hitmontop(),
    new honchkrow_gx_1.HonchkrowGX(),
    new hypno_1.Hypno(),
    new incineroar_1.Incineroar(),
    new inkay_1.Inkay(),
    new jigglypuff_1.Jigglypuff(),
    new kartana_1.Kartana(),
    new kingler_1.Kingler(),
    new koffing_1.Koffing(),
    new krabby_1.Krabby(),
    new krokorok_1.Krokorok(),
    new krookodile_1.Krookodile(),
    new kyurem_1.Kyurem(),
    new lairon_1.Lairon(),
    new landorus_1.Landorus(),
    new lickilicky_1.Lickilicky(),
    new lickitung_1.Lickitung(),
    new litten_1.Litten(),
    new litten_2_1.Litten2(),
    new lucario_1.Lucario(),
    new lucario_and_melmetal_gx_1.LucarioMelmetalGX(),
    new malamar_1.Malamar(),
    new marowak_1.Marowak(),
    new marshadow_1.Marshadow(),
    new marshadow_and_machamp_gx_1.MarshadowMachampGX(),
    new melmetal_1.Melmetal(),
    new meltan_1.Meltan(),
    new meowstic_1.Meowstic(),
    new meowth_1.Meowth(),
    new metapod_1.Metapod(),
    new mew_1.Mew(),
    new mewtwo_1.Mewtwo(),
    new misdreavus_1.Misdreavus(),
    new mismagius_1.Mismagius(),
    new muk_and_alolan_muk_gx_1.MukAlolanMukGX(),
    new murkrow_1.Murkrow(),
    new oddish_1.Oddish(),
    new oddish_2_1.Oddish2(),
    new persian_1.Persian(),
    new persian_gx_1.PersianGx(),
    new pheromosa_and_buzzwole_gx_1.PheromosaAndBuzzwoleGX(),
    new pikachu_1.Pikachu(),
    new poliwag_1.Poliwag(),
    new poliwag_2_1.Poliwag2(),
    new poliwhirl_1.Poliwhirl(),
    new poliwrath_1.Poliwrath(),
    new porygon_1.Porygon(),
    new porygon_2_1.Porygon2(),
    new porygon_z_1.PorygonZ(),
    new porygon2_1.Porygon2(),
    new purugly_1.Purugly(),
    new pyukumuku_1.Pyukumuku(),
    new quagsire_1.Quagsire(),
    new raichu_1.Raichu(),
    new raticate_1.Raticate(),
    new rattata_1.Rattata(),
    new reshiram_and_charizard_gx_1.ReshiramCharizardGX(),
    new rhydon_1.Rhydon(),
    new rhyhorn_1.Rhyhorn(),
    new rhyhorn_2_1.Rhyhorn2(),
    new rhyperior_1.Rhyperior(),
    new riolu_1.Riolu(),
    new salandit_1.Salandit(),
    new salazzle_1.Salazzle(),
    new sandile_1.Sandile(),
    new sandile_2_1.Sandile2(),
    new sandshrew_1.Sandshrew(),
    new sandslash_1.Sandslash(),
    new seaking_1.Seaking(),
    new seel_1.Seel(),
    new sharpedo_1.Sharpedo(),
    new slowbro_1.Slowbro(),
    new slowpoke_1.Slowpoke(),
    new snorlax_1.Snorlax(),
    new spearow_1.Spearow(),
    new spiritomb_1.Spiritomb(),
    new spritzee_1.Spritzee(),
    new squirtle_1.Squirtle(),
    new stunfisk_1.Stunfisk(),
    new tangela_1.Tangela(),
    new tangrowth_1.Tangrowth(),
    new tentacool_1.Tentacool(),
    new tentacruel_1.Tentacruel(),
    new togekiss_1.Togekiss(),
    new togepi_1.Togepi(),
    new togetic_1.Togetic(),
    new torracat_1.Torracat(),
    new tyrogue_1.Tyrogue(),
    new venomoth_1.Venomoth(),
    new venomoth_gx_1.VenomothGx(),
    new venonat_1.Venonat(),
    new venonat_2_1.Venonat2(),
    new victreebel_1.Victreebel(),
    new vikavolt_1.Vikavolt(),
    new vileplume_1.Vileplume(),
    new volcanion_1.Volcanion(),
    new wartortle_1.Wartortle(),
    new weepinbell_1.Weepinbell(),
    new weezing_1.Weezing(),
    new whimsicott_gx_1.WhimsicottGx(),
    new wigglytuff_1.Wigglytuff(),
    new wooper_1.Wooper(),
    new zeraora_1.Zeraora(),
    new zubat_1.Zubat(),
    // Trainers
    new beast_bringer_1.BeastBringer(),
    new chip_chip_ice_axe_1.ChipChipIceAxe(),
    new devolution_spray_z_1.DevolutionSprayZ(),
    new dusk_stone_1.DuskStone(),
    new dust_island_1.DustIsland(),
    new electromagnetic_radar_1.ElectromagneticRadar(),
    new energy_spinner_1.EnergySpinner(),
    new fairy_charm_ability_1.FairyCharmAbility(),
    new fairy_charm_lightning_1.FairyCharmLightning(),
    new fire_crystal_1.FireCrystal(),
    new giovannis_exile_1.GiovannisExile(),
    new greens_exploration_1.GreensExploration(),
    new janine_1.Janine(),
    new kogas_trap_1.KogasTrap(),
    new lt_surges_strategy_1.LtSurgesStrategy(),
    new martial_arts_dojo_1.MartialArtsDojo(),
    new metal_core_barrier_1.MetalCoreBarrier(),
    new molayne_1.Molayne(),
    new other_prints_1.Pokegear30UNB(),
    new power_plant_1.PowerPlant(),
    new reds_challenge_1.RedsChallenge(),
    new samson_oak_1.SamsonOak(),
    new stealthy_hood_1.StealthyHood(),
    new surprise_box_1.SurpriseBox(),
    new ultra_forest_kartenvoy_1.UltraForestKartenvoy(),
    // Energy
    new triple_acceleration_energy_1.TripleAccelerationEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.DedenneGXUNB(),
    new other_prints_1.FirefighterPikachuUNB(),
    new other_prints_1.PheromosaBuzzwoleGX2UNB(),
    new other_prints_1.PheromosaBuzzwoleGX3UNB(),
    new other_prints_1.ReshiramCharizardGX2UNB(),
    new other_prints_1.MukAlolanMukGX2UNB(),
    new other_prints_1.MukAlolanMukGX3UNB(),
    new other_prints_1.MarshadowMachampGX2UNB(),
    new other_prints_1.MarshadowMachampGX3UNB(),
    new other_prints_1.GreninjaZoroarkGX2UNB(),
    new other_prints_1.GreninjaZoroarkGX3UNB(),
    new other_prints_1.HonchkrowGX2UNB(),
    new other_prints_1.LucarioMelmetalGX2UNB(),
    new other_prints_1.GardevoirSylveonGX2UNB(),
    new other_prints_1.GardevoirSylveonGX3UNB(),
    new other_prints_1.GreensExploration2UNB(),
    new other_prints_1.Welder3UNB(),
    new other_prints_1.PheromosaBuzzwoleGX4UNB(),
    new other_prints_1.ReshiramCharizardGX3UNB(),
    new other_prints_1.DedenneGX4UNB(),
    new other_prints_1.MukAlolanMukGX4UNB(),
    new other_prints_1.MarshadowMachampGX4UNB(),
    new other_prints_1.GreninjaZoroarkGX4UNB(),
    new other_prints_1.HonchkrowGX3UNB(),
    new other_prints_1.LucarioMelmetalGX3UNB(),
    new other_prints_1.GardevoirSylveonGX4UNB(),
    new other_prints_1.ElectromagneticRadar2UNB(),
    new other_prints_1.FireCrystal2UNB(),
    new other_prints_1.MetalCoreBarrier2UNB(),
    new other_prints_1.Pokegear30HS4UNB(),
    new other_prints_1.TripleAccelerationEnergy2UNB(),
    new other_prints_1.Pokegear30HS2UNB(),
    new other_prints_1.Pokegear30HS3UNB(),
    new other_prints_1.Welder2UNB(),
    new other_prints_1.DedenneGX3UNB(),
    new other_prints_1.VenomothGx2(),
    new other_prints_1.DedenneGx2(),
    new other_prints_1.WhimsicottGx2(),
    new other_prints_1.PersianGx2(),
    new other_prints_1.CelesteelaGx2(),
    new other_prints_1.Janine2(),
    new other_prints_1.KogasTrap2(),
    new other_prints_1.Molayne2(),
    new other_prints_1.RedsChallenge2(),
    new other_prints_1.VenomothGx3(),
    new other_prints_1.BlastoiseGx2(),
    new other_prints_1.WhimsicottGx3(),
    new other_prints_1.PersianGx3(),
    new other_prints_1.CelesteelaGx3(),
    new other_prints_1.BeastBringer2(),
];

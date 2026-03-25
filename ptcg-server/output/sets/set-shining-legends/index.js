"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setShiningLegends = void 0;
const arbok_1 = require("./arbok");
const breloom_1 = require("./breloom");
const buizel_1 = require("./buizel");
const bulbasaur_1 = require("./bulbasaur");
const carnivine_1 = require("./carnivine");
const croconaw_1 = require("./croconaw");
const ekans_1 = require("./ekans");
const electrode_1 = require("./electrode");
const entei_gx_1 = require("./entei-gx");
const feraligatr_1 = require("./feraligatr");
const floatzel_1 = require("./floatzel");
const golett_1 = require("./golett");
const golurk_1 = require("./golurk");
const hoopa_1 = require("./hoopa");
const incineroar_1 = require("./incineroar");
const ivysaur_1 = require("./ivysaur");
const jynx_1 = require("./jynx");
const keldeo_1 = require("./keldeo");
const larvesta_1 = require("./larvesta");
const latios_1 = require("./latios");
const liepard_1 = require("./liepard");
const litten_1 = require("./litten");
const manaphy_1 = require("./manaphy");
const marshadow_1 = require("./marshadow");
const mewtwo_gx_1 = require("./mewtwo-gx");
const minun_1 = require("./minun");
const palkia_1 = require("./palkia");
const pikachu_1 = require("./pikachu");
const plusle_1 = require("./plusle");
const purrloin_1 = require("./purrloin");
const qwilfish_1 = require("./qwilfish");
const raichu_gx_1 = require("./raichu-gx");
const raikou_1 = require("./raikou");
const reshiram_1 = require("./reshiram");
const scrafty_1 = require("./scrafty");
const scraggy_1 = require("./scraggy");
const shaymin_1 = require("./shaymin");
const shining_arceus_1 = require("./shining-arceus");
const shining_genesect_1 = require("./shining-genesect");
const shining_jirachi_1 = require("./shining-jirachi");
const shining_mew_1 = require("./shining-mew");
const shining_rayquaza_1 = require("./shining-rayquaza");
const shining_volcanion_1 = require("./shining-volcanion");
const shroomish_1 = require("./shroomish");
const spiritomb_1 = require("./spiritomb");
const stunfisk_1 = require("./stunfisk");
const torkoal_1 = require("./torkoal");
const torracat_1 = require("./torracat");
const totodile_1 = require("./totodile");
const venusaur_1 = require("./venusaur");
const virizion_1 = require("./virizion");
const volcarona_1 = require("./volcarona");
const voltorb_1 = require("./voltorb");
const yveltal_1 = require("./yveltal");
const zekrom_1 = require("./zekrom");
const zoroark_gx_1 = require("./zoroark-gx");
const zorua_1 = require("./zorua");
const damage_mover_1 = require("./damage-mover");
const warp_energy_1 = require("./warp-energy");
const other_prints_1 = require("./other-prints");
exports.setShiningLegends = [
    // Pokemon
    new arbok_1.Arbok(),
    new breloom_1.Breloom(),
    new buizel_1.Buizel(),
    new bulbasaur_1.Bulbasaur(),
    new carnivine_1.Carnivine(),
    new croconaw_1.Croconaw(),
    new ekans_1.Ekans(),
    new electrode_1.Electrode(),
    new entei_gx_1.EnteiGx(),
    new feraligatr_1.Feraligatr(),
    new floatzel_1.Floatzel(),
    new golett_1.Golett(),
    new golurk_1.Golurk(),
    new hoopa_1.Hoopa(),
    new incineroar_1.Incineroar(),
    new ivysaur_1.Ivysaur(),
    new jynx_1.Jynx(),
    new keldeo_1.Keldeo(),
    new larvesta_1.Larvesta(),
    new latios_1.Latios(),
    new liepard_1.Liepard(),
    new litten_1.Litten(),
    new manaphy_1.Manaphy(),
    new marshadow_1.Marshadow(),
    new mewtwo_gx_1.MewtwoGX(),
    new minun_1.Minun(),
    new palkia_1.Palkia(),
    new pikachu_1.Pikachu(),
    new plusle_1.Plusle(),
    new purrloin_1.Purrloin(),
    new qwilfish_1.Qwilfish(),
    new raichu_gx_1.RaichuGx(),
    new raikou_1.Raikou(),
    new reshiram_1.Reshiram(),
    new scrafty_1.Scrafty(),
    new scraggy_1.Scraggy(),
    new shaymin_1.Shaymin(),
    new shining_arceus_1.ShiningArceus(),
    new shining_genesect_1.ShiningGenesect(),
    new shining_jirachi_1.ShiningJirachi(),
    new shining_mew_1.ShiningMew(),
    new shining_rayquaza_1.ShiningRayquaza(),
    new shining_volcanion_1.ShiningVolcanion(),
    new shroomish_1.Shroomish(),
    new spiritomb_1.Spiritomb(),
    new stunfisk_1.Stunfisk(),
    new torkoal_1.Torkoal(),
    new torracat_1.Torracat(),
    new totodile_1.Totodile(),
    new venusaur_1.Venusaur(),
    new virizion_1.Virizion(),
    new volcarona_1.Volcarona(),
    new voltorb_1.Voltorb(),
    new yveltal_1.Yveltal(),
    new zekrom_1.Zekrom(),
    new zoroark_gx_1.ZoroarkGX(),
    new zorua_1.Zorua(),
    // Trainers
    new damage_mover_1.DamageMover(),
    // Energy
    new warp_energy_1.WarpEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.EnergyRetrievalSLG(),
    new other_prints_1.GreatBallSLG(),
    new other_prints_1.HauSLG(),
    new other_prints_1.LillieSLG(),
    new other_prints_1.PokemonBreederSLG(),
    new other_prints_1.PokemonCatcherSLG(),
    new other_prints_1.SophoclesSLG(),
    new other_prints_1.SuperScoopUpSLG(),
    new other_prints_1.SwitchSLG(),
    new other_prints_1.UltraBallSLG(),
    new other_prints_1.DoubleColorlessEnergySLG(),
    new other_prints_1.MewtwoGX2SLG(),
    new other_prints_1.PokemonBreeder2SLG(),
    new other_prints_1.MewtwoGX3SLG(),
    new other_prints_1.ZoroarkGX2SLG(),
    new other_prints_1.MewtwoGX4SLG(),
    new other_prints_1.UltraBall2SLG(),
    new other_prints_1.ZoroarkGX3SLG(),
    new other_prints_1.EnteiGx2(),
    new other_prints_1.EnteiGx3(),
    new other_prints_1.RaichuGx2(),
];

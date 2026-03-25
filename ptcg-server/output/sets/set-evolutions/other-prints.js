"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysDetermination2 = exports.MPidgeotEx2 = exports.PidgeotEx2 = exports.MewtwoEx2 = exports.MBlastoiseEx2 = exports.MCharizardEx2 = exports.ClefairyEVO = exports.MBlastoiseExEVO = exports.BlastoiseExEVO = exports.CharizardExEVO = exports.CharmeleonEVO = exports.CharmanderEVO = exports.VenusaurExEVO = exports.MVenusaurEXEVOSR = exports.MVenusaurEXEVO = exports.HereComesTeamRocketEVO = exports.BrocksGrit2EVO = exports.DragoniteEX2EVO = exports.FairyEnergyEVO = exports.MetalEnergyEVO = exports.FightingEnergyEVO = exports.PsychicEnergyEVO = exports.LightningEnergyEVO = exports.WaterEnergyEVO = exports.FireEnergyEVO = exports.GrassEnergyEVO = exports.DoubleColorlessEnergyEVO = exports.SwitchEVO = exports.SuperPotionEVO = exports.ReviveEVO = exports.PotionEVO = exports.MaintenanceEVO = exports.FullHealEVO = exports.EnergyRetrievalEVO = exports.WeedleEVO = exports.MetapodEVO = exports.CaterpieEVO = exports.DarknessEnergyEVO = exports.PokedexEVO = void 0;
const caterpie_1 = require("../set-base-set/caterpie");
const metapod_1 = require("../set-base-set/metapod");
const weedle_1 = require("../set-base-set/weedle");
const energy_retrieval_1 = require("../set-base-set/energy-retrieval");
const full_heal_1 = require("../set-base-set/full-heal");
const maintenance_1 = require("../set-base-set/maintenance");
const potion_1 = require("../set-base-set/potion");
const revive_1 = require("../set-base-set/revive");
const super_potion_1 = require("../set-base-set/super-potion");
const switch_1 = require("../set-base-set/switch");
const double_colorless_energy_1 = require("../set-base-set/double-colorless-energy");
const grass_energy_1 = require("../set-base-set-energy/grass-energy");
const fire_energy_1 = require("../set-base-set-energy/fire-energy");
const water_energy_1 = require("../set-base-set-energy/water-energy");
const lightning_energy_1 = require("../set-base-set-energy/lightning-energy");
const psychic_energy_1 = require("../set-base-set-energy/psychic-energy");
const fighting_energy_1 = require("../set-base-set-energy/fighting-energy");
const basic_energies_1 = require("../set-diamond-and-pearl/basic-energies");
const basic_energies_2 = require("../set-x-and-y/basic-energies");
const dragonite_ex_1 = require("../set-evolutions/dragonite-ex");
const brocks_grit_1 = require("../set-evolutions/brocks-grit");
const here_comes_team_rocket_1 = require("../set-ex-team-rocket-returns/here-comes-team-rocket");
const pokedex_1 = require("../set-black-and-white/pokedex");
const darkness_energy_1 = require("../set-scarlet-and-violet-energy/darkness-energy");
const m_venusaur_ex_1 = require("../set-x-and-y/m-venusaur-ex");
const venusaur_ex_1 = require("../set-x-and-y/venusaur-ex");
const charmander_1 = require("../set-base-set/charmander");
const charmeleon_1 = require("../set-base-set/charmeleon");
const charizard_ex_2_1 = require("../set-flashfire/charizard-ex-2");
const blastoise_ex_1 = require("../set-x-and-y/blastoise-ex");
const m_blastoise_ex_1 = require("../set-x-and-y/m-blastoise-ex");
const clefairy_1 = require("../set-base-set/clefairy");
const m_charizard_ex_1 = require("./m-charizard-ex");
const mewtwo_ex_1 = require("./mewtwo-ex");
const pidgeot_ex_1 = require("./pidgeot-ex");
const m_pidgeot_ex_1 = require("./m-pidgeot-ex");
const mistys_determination_1 = require("./mistys-determination");
class PokedexEVO extends pokedex_1.Pokedex {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '82';
        this.fullName = 'Pokedex EVO';
    }
}
exports.PokedexEVO = PokedexEVO;
class DarknessEnergyEVO extends darkness_energy_1.DarknessEnergy {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '97';
        this.fullName = 'Darkness Energy EVO';
    }
}
exports.DarknessEnergyEVO = DarknessEnergyEVO;
class CaterpieEVO extends caterpie_1.Caterpie {
    constructor() {
        super(...arguments);
        this.setNumber = '3';
        this.fullName = 'Caterpie EVO';
        this.set = 'EVO';
    }
}
exports.CaterpieEVO = CaterpieEVO;
class MetapodEVO extends metapod_1.Metapod {
    constructor() {
        super(...arguments);
        this.setNumber = '4';
        this.fullName = 'Metapod EVO';
        this.set = 'EVO';
    }
}
exports.MetapodEVO = MetapodEVO;
class WeedleEVO extends weedle_1.Weedle {
    constructor() {
        super(...arguments);
        this.setNumber = '5';
        this.fullName = 'Weedle EVO';
        this.set = 'EVO';
    }
}
exports.WeedleEVO = WeedleEVO;
class EnergyRetrievalEVO extends energy_retrieval_1.EnergyRetrieval {
    constructor() {
        super(...arguments);
        this.setNumber = '77';
        this.fullName = 'Energy Retrieval EVO';
        this.set = 'EVO';
    }
}
exports.EnergyRetrievalEVO = EnergyRetrievalEVO;
class FullHealEVO extends full_heal_1.FullHeal {
    constructor() {
        super(...arguments);
        this.setNumber = '78';
        this.fullName = 'Full Heal EVO';
        this.set = 'EVO';
    }
}
exports.FullHealEVO = FullHealEVO;
class MaintenanceEVO extends maintenance_1.Maintenance {
    constructor() {
        super(...arguments);
        this.setNumber = '79';
        this.fullName = 'Maintenance EVO';
        this.set = 'EVO';
    }
}
exports.MaintenanceEVO = MaintenanceEVO;
class PotionEVO extends potion_1.Potion {
    constructor() {
        super(...arguments);
        this.setNumber = '83';
        this.fullName = 'Potion EVO';
        this.set = 'EVO';
    }
}
exports.PotionEVO = PotionEVO;
class ReviveEVO extends revive_1.Revive {
    constructor() {
        super(...arguments);
        this.setNumber = '85';
        this.fullName = 'Revive EVO';
        this.set = 'EVO';
    }
}
exports.ReviveEVO = ReviveEVO;
class SuperPotionEVO extends super_potion_1.SuperPotion {
    constructor() {
        super(...arguments);
        this.setNumber = '87';
        this.fullName = 'Super Potion EVO';
        this.set = 'EVO';
    }
}
exports.SuperPotionEVO = SuperPotionEVO;
class SwitchEVO extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.setNumber = '88';
        this.fullName = 'Switch EVO';
        this.set = 'EVO';
    }
}
exports.SwitchEVO = SwitchEVO;
class DoubleColorlessEnergyEVO extends double_colorless_energy_1.DoubleColorlessEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '90';
        this.fullName = 'Double Colorless Energy EVO';
        this.set = 'EVO';
    }
}
exports.DoubleColorlessEnergyEVO = DoubleColorlessEnergyEVO;
class GrassEnergyEVO extends grass_energy_1.GrassEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '91';
        this.fullName = 'Grass Energy EVO';
        this.set = 'EVO';
    }
}
exports.GrassEnergyEVO = GrassEnergyEVO;
class FireEnergyEVO extends fire_energy_1.FireEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '92';
        this.fullName = 'Fire Energy EVO';
        this.set = 'EVO';
    }
}
exports.FireEnergyEVO = FireEnergyEVO;
class WaterEnergyEVO extends water_energy_1.WaterEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.fullName = 'Water Energy EVO';
        this.set = 'EVO';
    }
}
exports.WaterEnergyEVO = WaterEnergyEVO;
class LightningEnergyEVO extends lightning_energy_1.LightningEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '94';
        this.fullName = 'Lightning Energy EVO';
        this.set = 'EVO';
    }
}
exports.LightningEnergyEVO = LightningEnergyEVO;
class PsychicEnergyEVO extends psychic_energy_1.PsychicEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '95';
        this.fullName = 'Psychic Energy EVO';
        this.set = 'EVO';
    }
}
exports.PsychicEnergyEVO = PsychicEnergyEVO;
class FightingEnergyEVO extends fighting_energy_1.FightingEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '96';
        this.fullName = 'Fighting Energy EVO';
        this.set = 'EVO';
    }
}
exports.FightingEnergyEVO = FightingEnergyEVO;
class MetalEnergyEVO extends basic_energies_1.MetalEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '98';
        this.fullName = 'Metal Energy EVO';
        this.set = 'EVO';
    }
}
exports.MetalEnergyEVO = MetalEnergyEVO;
class FairyEnergyEVO extends basic_energies_2.FairyEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '99';
        this.fullName = 'Fairy Energy EVO';
        this.set = 'EVO';
    }
}
exports.FairyEnergyEVO = FairyEnergyEVO;
class DragoniteEX2EVO extends dragonite_ex_1.DragoniteEX {
    constructor() {
        super(...arguments);
        this.setNumber = '106';
        this.fullName = 'Dragonite EX2 EVO';
        this.set = 'EVO';
    }
}
exports.DragoniteEX2EVO = DragoniteEX2EVO;
class BrocksGrit2EVO extends brocks_grit_1.BrocksGrit {
    constructor() {
        super(...arguments);
        this.setNumber = '107';
        this.fullName = 'Brock\'s Grit2 EVO';
        this.set = 'EVO';
    }
}
exports.BrocksGrit2EVO = BrocksGrit2EVO;
class HereComesTeamRocketEVO extends here_comes_team_rocket_1.HereComesTeamRocket {
    constructor() {
        super(...arguments);
        this.setNumber = '113';
        this.fullName = 'Here Comes Team Rocket! EVO';
        this.set = 'EVO';
    }
}
exports.HereComesTeamRocketEVO = HereComesTeamRocketEVO;
class MVenusaurEXEVO extends m_venusaur_ex_1.MVenusaurEX {
    constructor() {
        super(...arguments);
        this.setNumber = '2';
        this.fullName = 'M Venusaur-EX EVO';
        this.set = 'EVO';
    }
}
exports.MVenusaurEXEVO = MVenusaurEXEVO;
class MVenusaurEXEVOSR extends m_venusaur_ex_1.MVenusaurEX {
    constructor() {
        super(...arguments);
        this.setNumber = '100';
        this.fullName = 'M Venusaur-EX SR EVO';
        this.set = 'EVO';
    }
}
exports.MVenusaurEXEVOSR = MVenusaurEXEVOSR;
class VenusaurExEVO extends venusaur_ex_1.VenusaurEx {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '1';
        this.fullName = 'Venusaur-EX EVO';
    }
}
exports.VenusaurExEVO = VenusaurExEVO;
class CharmanderEVO extends charmander_1.Charmander {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '9';
        this.fullName = 'Charmander EVO';
    }
}
exports.CharmanderEVO = CharmanderEVO;
class CharmeleonEVO extends charmeleon_1.Charmeleon {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '10';
        this.fullName = 'Charmeleon EVO';
    }
}
exports.CharmeleonEVO = CharmeleonEVO;
class CharizardExEVO extends charizard_ex_2_1.CharizardEx2 {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '12';
        this.fullName = 'Charizard-EX EVO';
    }
}
exports.CharizardExEVO = CharizardExEVO;
class BlastoiseExEVO extends blastoise_ex_1.BlastoiseEx {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '21';
        this.fullName = 'Blastoise-EX EVO';
    }
}
exports.BlastoiseExEVO = BlastoiseExEVO;
class MBlastoiseExEVO extends m_blastoise_ex_1.MBlastoiseEx {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '22';
        this.fullName = 'M Blastoise-EX EVO';
    }
}
exports.MBlastoiseExEVO = MBlastoiseExEVO;
class ClefairyEVO extends clefairy_1.Clefairy {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '63';
        this.fullName = 'Clefairy EVO';
    }
}
exports.ClefairyEVO = ClefairyEVO;
class MCharizardEx2 extends m_charizard_ex_1.MCharizardEx {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '101';
        this.fullName = 'M Charizard-EX EVO 101';
    }
}
exports.MCharizardEx2 = MCharizardEx2;
class MBlastoiseEx2 extends m_blastoise_ex_1.MBlastoiseEx {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '102';
        this.fullName = 'M Blastoise-EX EVO 102';
    }
}
exports.MBlastoiseEx2 = MBlastoiseEx2;
class MewtwoEx2 extends mewtwo_ex_1.MewtwoEx {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '103';
        this.fullName = 'Mewtwo-EX EVO 103';
    }
}
exports.MewtwoEx2 = MewtwoEx2;
class PidgeotEx2 extends pidgeot_ex_1.PidgeotEx {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '104';
        this.fullName = 'Pidgeot-EX EVO 104';
    }
}
exports.PidgeotEx2 = PidgeotEx2;
class MPidgeotEx2 extends m_pidgeot_ex_1.MPidgeotEx {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '105';
        this.fullName = 'M Pidgeot-EX EVO 105';
    }
}
exports.MPidgeotEx2 = MPidgeotEx2;
class MistysDetermination2 extends mistys_determination_1.MistysDetermination {
    constructor() {
        super(...arguments);
        this.set = 'EVO';
        this.setNumber = '108';
        this.fullName = 'Misty\'s Determination EVO 108';
    }
}
exports.MistysDetermination2 = MistysDetermination2;

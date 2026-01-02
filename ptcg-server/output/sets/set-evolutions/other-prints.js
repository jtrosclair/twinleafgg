"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HereComesTeamRocketEVO = exports.BrocksGrit2EVO = exports.DragoniteEX2EVO = exports.FairyEnergyEVO = exports.MetalEnergyEVO = exports.FightingEnergyEVO = exports.PsychicEnergyEVO = exports.LightningEnergyEVO = exports.WaterEnergyEVO = exports.FireEnergyEVO = exports.GrassEnergyEVO = exports.DoubleColorlessEnergyEVO = exports.SwitchEVO = exports.SuperPotionEVO = exports.ReviveEVO = exports.PotionEVO = exports.MaintenanceEVO = exports.FullHealEVO = exports.EnergyRetrievalEVO = exports.WeedleEVO = exports.MetapodEVO = exports.CaterpieEVO = exports.DarknessEnergyEVO = exports.PokedexEVO = void 0;
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
const here_comes_team_rocket_1 = require("../set-team-rocket/here-comes-team-rocket");
const pokedex_1 = require("../set-black-and-white/pokedex");
const darkness_energy_1 = require("../set-scarlet-and-violet-energy/darkness-energy");
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

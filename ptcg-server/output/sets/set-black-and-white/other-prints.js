"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zekrom2BLW = exports.Reshiram2BLW = exports.SuperScoopUpBLW = exports.PotionBLW = exports.PokemonCommunicationHSBLW = exports.PokeBallBLW = exports.FullHealBLW = exports.EnergySwitchPKBLW = exports.EnergySearchBLW = exports.SwitchBLW = exports.EnergyRetrievalBLW = void 0;
const energy_search_1 = require("../set-fossil/energy-search");
const other_prints_1 = require("../set-ex-power-keepers/other-prints");
const full_heal_1 = require("../set-base-set/full-heal");
const pokeball_1 = require("../set-jungle/pokeball");
const other_prints_2 = require("../set-heartgold-and-soulsilver/other-prints");
const potion_1 = require("../set-base-set/potion");
const super_scoop_up_1 = require("../set-diamond-and-pearl/super-scoop-up");
const reshiram_1 = require("../set-black-and-white/reshiram");
const zekrom_1 = require("../set-black-and-white/zekrom");
const energy_retrieval_1 = require("../set-scarlet-and-violet/energy-retrieval");
const switch_1 = require("../set-scarlet-and-violet/switch");
class EnergyRetrievalBLW extends energy_retrieval_1.EnergyRetrieval {
    constructor() {
        super(...arguments);
        this.set = 'BLW';
        this.setNumber = '92';
        this.regulationMark = '';
        this.name = 'Energy Retrieval';
        this.fullName = 'Energy Retrieval BLW';
    }
}
exports.EnergyRetrievalBLW = EnergyRetrievalBLW;
class SwitchBLW extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.set = 'BLW';
        this.setNumber = '104';
        this.regulationMark = '';
        this.name = 'Switch';
        this.fullName = 'Switch BLW';
    }
}
exports.SwitchBLW = SwitchBLW;
class EnergySearchBLW extends energy_search_1.EnergySearch {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.fullName = 'Energy Search BLW';
        this.set = 'BLW';
    }
}
exports.EnergySearchBLW = EnergySearchBLW;
class EnergySwitchPKBLW extends other_prints_1.EnergySwitchPK {
    constructor() {
        super(...arguments);
        this.setNumber = '94';
        this.fullName = 'Energy Switch BLW';
        this.set = 'BLW';
    }
}
exports.EnergySwitchPKBLW = EnergySwitchPKBLW;
class FullHealBLW extends full_heal_1.FullHeal {
    constructor() {
        super(...arguments);
        this.setNumber = '95';
        this.fullName = 'Full Heal BLW';
        this.set = 'BLW';
    }
}
exports.FullHealBLW = FullHealBLW;
class PokeBallBLW extends pokeball_1.PokeBall {
    constructor() {
        super(...arguments);
        this.setNumber = '97';
        this.fullName = 'Poké Ball BLW';
        this.set = 'BLW';
    }
}
exports.PokeBallBLW = PokeBallBLW;
class PokemonCommunicationHSBLW extends other_prints_2.PokemonCommunicationHS {
    constructor() {
        super(...arguments);
        this.setNumber = '99';
        this.fullName = 'Pokemon Communication BLW';
        this.set = 'BLW';
    }
}
exports.PokemonCommunicationHSBLW = PokemonCommunicationHSBLW;
class PotionBLW extends potion_1.Potion {
    constructor() {
        super(...arguments);
        this.setNumber = '100';
        this.fullName = 'Potion BLW';
        this.set = 'BLW';
    }
}
exports.PotionBLW = PotionBLW;
class SuperScoopUpBLW extends super_scoop_up_1.SuperScoopUp {
    constructor() {
        super(...arguments);
        this.setNumber = '103';
        this.fullName = 'Super Scoop Up BLW';
        this.set = 'BLW';
    }
}
exports.SuperScoopUpBLW = SuperScoopUpBLW;
class Reshiram2BLW extends reshiram_1.Reshiram {
    constructor() {
        super(...arguments);
        this.setNumber = '113';
        this.fullName = 'Reshiram2 BLW';
        this.set = 'BLW';
    }
}
exports.Reshiram2BLW = Reshiram2BLW;
class Zekrom2BLW extends zekrom_1.Zekrom {
    constructor() {
        super(...arguments);
        this.setNumber = '114';
        this.fullName = 'Zekrom2 BLW';
        this.set = 'BLW';
    }
}
exports.Zekrom2BLW = Zekrom2BLW;

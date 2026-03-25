"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MLucarioEx3 = exports.MHeracrossEx2 = exports.FossilResearcher2 = exports.BattleReporter2 = exports.DragoniteEx2 = exports.MaintenanceFFI96 = exports.MLucarioEx2 = exports.LucarioEx2FFI = exports.SeismitoadEx2FFI = exports.FullHealFFI = exports.EnergySwitchPKFFI = exports.SuperScoopUpFFI = exports.MaintenanceFFI = exports.KorrinaFFI = void 0;
const other_prints_1 = require("../set-ex-power-keepers/other-prints");
const full_heal_1 = require("../set-base-set/full-heal");
const seismitoad_ex_1 = require("../set-furious-fists/seismitoad-ex");
const lucario_ex_1 = require("../set-furious-fists/lucario-ex");
const korrina_1 = require("./korrina");
const maintenance_1 = require("../set-base-set/maintenance");
const super_scoop_up_1 = require("../set-diamond-and-pearl/super-scoop-up");
const m_lucario_ex_1 = require("./m-lucario-ex");
const dragonite_ex_1 = require("./dragonite-ex");
const battle_reporter_1 = require("./battle-reporter");
const fossil_researcher_1 = require("./fossil-researcher");
const m_heracross_ex_1 = require("./m-heracross-ex");
class KorrinaFFI extends korrina_1.Korrina {
    constructor() {
        super(...arguments);
        this.set = 'FFI';
        this.setNumber = '111';
        this.fullName = 'Korrina FFI 111';
    }
}
exports.KorrinaFFI = KorrinaFFI;
class MaintenanceFFI extends maintenance_1.Maintenance {
    constructor() {
        super(...arguments);
        this.set = 'FFI';
        this.setNumber = '96';
        this.fullName = 'Maintenance FFI 96';
        this.text = 'Shuffle 2 cards from your hand into your deck. (If you can\'t shuffle 2 cards into your deck, you can\'t play this card.) Then, draw a card.';
    }
}
exports.MaintenanceFFI = MaintenanceFFI;
class SuperScoopUpFFI extends super_scoop_up_1.SuperScoopUp {
    constructor() {
        super(...arguments);
        this.set = 'FFI';
        this.setNumber = '100';
        this.name = 'Super Scoop Up';
        this.fullName = 'Super Scoop Up FFI';
        this.text = 'Flip a coin. If heads, put 1 of your Pokémon and all cards attached to it into your hand.';
    }
}
exports.SuperScoopUpFFI = SuperScoopUpFFI;
class EnergySwitchPKFFI extends other_prints_1.EnergySwitchPK {
    constructor() {
        super(...arguments);
        this.setNumber = '89';
        this.fullName = 'Energy Switch FFI';
        this.set = 'FFI';
    }
}
exports.EnergySwitchPKFFI = EnergySwitchPKFFI;
class FullHealFFI extends full_heal_1.FullHeal {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.fullName = 'Full Heal FFI';
        this.set = 'FFI';
    }
}
exports.FullHealFFI = FullHealFFI;
class SeismitoadEx2FFI extends seismitoad_ex_1.SeismitoadEx {
    constructor() {
        super(...arguments);
        this.setNumber = '106';
        this.fullName = 'Seismitoad EX2 FFI';
        this.set = 'FFI';
    }
}
exports.SeismitoadEx2FFI = SeismitoadEx2FFI;
class LucarioEx2FFI extends lucario_ex_1.LucarioEx {
    constructor() {
        super(...arguments);
        this.setNumber = '107';
        this.fullName = 'Lucario EX2 FFI';
        this.set = 'FFI';
    }
}
exports.LucarioEx2FFI = LucarioEx2FFI;
class MLucarioEx2 extends m_lucario_ex_1.MLucarioEx {
    constructor() {
        super(...arguments);
        this.set = 'FFI';
        this.setNumber = '55a';
        this.fullName = 'M Lucario-EX FFI 55a';
    }
}
exports.MLucarioEx2 = MLucarioEx2;
class MaintenanceFFI96 extends maintenance_1.Maintenance {
    constructor() {
        super(...arguments);
        this.set = 'FFI';
        this.setNumber = '96';
        this.fullName = 'Maintenance FFI';
    }
}
exports.MaintenanceFFI96 = MaintenanceFFI96;
class DragoniteEx2 extends dragonite_ex_1.DragoniteEx {
    constructor() {
        super(...arguments);
        this.set = 'FFI';
        this.setNumber = '108';
        this.fullName = 'Dragonite-EX FFI 108';
    }
}
exports.DragoniteEx2 = DragoniteEx2;
class BattleReporter2 extends battle_reporter_1.BattleReporter {
    constructor() {
        super(...arguments);
        this.set = 'FFI';
        this.setNumber = '109';
        this.fullName = 'Battle Reporter FFI 109';
    }
}
exports.BattleReporter2 = BattleReporter2;
class FossilResearcher2 extends fossil_researcher_1.FossilResearcher {
    constructor() {
        super(...arguments);
        this.set = 'FFI';
        this.setNumber = '110';
        this.fullName = 'Fossil Researcher FFI 110';
    }
}
exports.FossilResearcher2 = FossilResearcher2;
class MHeracrossEx2 extends m_heracross_ex_1.MHeracrossEx {
    constructor() {
        super(...arguments);
        this.set = 'FFI';
        this.setNumber = '112';
        this.fullName = 'M Heracross-EX FFI 112';
    }
}
exports.MHeracrossEx2 = MHeracrossEx2;
class MLucarioEx3 extends m_lucario_ex_1.MLucarioEx {
    constructor() {
        super(...arguments);
        this.set = 'FFI';
        this.setNumber = '113';
        this.fullName = 'M Lucario-EX FFI 113';
    }
}
exports.MLucarioEx3 = MLucarioEx3;

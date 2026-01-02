"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LucarioEx2FFI = exports.SeismitoadEx2FFI = exports.FullHealFFI = exports.EnergySwitchPKFFI = exports.SuperScoopUpFFI = exports.MaintenanceFFI = exports.KorrinaFFI = void 0;
const other_prints_1 = require("../set-ex-power-keepers/other-prints");
const full_heal_1 = require("../set-base-set/full-heal");
const seismitoad_ex_1 = require("../set-furious-fists/seismitoad-ex");
const lucario_ex_1 = require("../set-furious-fists/lucario-ex");
const korrina_1 = require("./korrina");
const maintenance_1 = require("../set-base-set/maintenance");
const super_scoop_up_1 = require("../set-diamond-and-pearl/super-scoop-up");
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

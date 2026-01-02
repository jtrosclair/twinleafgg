"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltraBallPLF = exports.GarbodorPLF = exports.SigilyphPLF = exports.EmpoleonPLF = exports.Ghetsis2PLF = exports.LatiasEX2PLF = exports.DeoxysEX2PLF = exports.ThundurusEX2PLF = exports.PlasmaEnergyPLF = exports.ProfessorJuniperPLF = exports.MaxPotionPLF = void 0;
const plasma_energy_1 = require("../set-plasma-storm/plasma-energy");
const thundurus_ex_1 = require("../set-plasma-freeze/thundurus-ex");
const deoxys_ex_1 = require("../set-plasma-freeze/deoxys-ex");
const latias_ex_1 = require("../set-plasma-freeze/latias-ex");
const ghetsis_1 = require("../set-plasma-freeze/ghetsis");
const empoleon_1 = require("../set-dark-explorers/empoleon");
const sigilyph_1 = require("../set-dragons-exalted/sigilyph");
const garbodor_1 = require("../set-dragons-exalted/garbodor");
const ultra_ball_1 = require("../set-scarlet-and-violet/ultra-ball");
const max_potion_1 = require("../set-emerging-powers/max-potion");
const professor_juniper_1 = require("../set-black-and-white/professor-juniper");
class MaxPotionPLF extends max_potion_1.MaxPotion {
    constructor() {
        super(...arguments);
        this.fullName = 'Max Potion PLF';
        this.set = 'PLF';
        this.setNumber = '121';
    }
}
exports.MaxPotionPLF = MaxPotionPLF;
class ProfessorJuniperPLF extends professor_juniper_1.ProfessorJuniper {
    constructor() {
        super(...arguments);
        this.fullName = 'Professor Juniper PLF';
        this.set = 'PLF';
        this.setNumber = '116';
    }
}
exports.ProfessorJuniperPLF = ProfessorJuniperPLF;
class PlasmaEnergyPLF extends plasma_energy_1.PlasmaEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '106';
        this.fullName = 'Plasma Energy PLF';
        this.set = 'PLF';
    }
}
exports.PlasmaEnergyPLF = PlasmaEnergyPLF;
class ThundurusEX2PLF extends thundurus_ex_1.ThundurusEX {
    constructor() {
        super(...arguments);
        this.setNumber = '110';
        this.fullName = 'Thundurus EX2 PLF';
        this.set = 'PLF';
    }
}
exports.ThundurusEX2PLF = ThundurusEX2PLF;
class DeoxysEX2PLF extends deoxys_ex_1.DeoxysEX {
    constructor() {
        super(...arguments);
        this.setNumber = '111';
        this.fullName = 'Deoxys EX2 PLF';
        this.set = 'PLF';
    }
}
exports.DeoxysEX2PLF = DeoxysEX2PLF;
class LatiasEX2PLF extends latias_ex_1.LatiasEX {
    constructor() {
        super(...arguments);
        this.setNumber = '112';
        this.fullName = 'Latias EX2 PLF';
        this.set = 'PLF';
    }
}
exports.LatiasEX2PLF = LatiasEX2PLF;
class Ghetsis2PLF extends ghetsis_1.Ghetsis {
    constructor() {
        super(...arguments);
        this.setNumber = '115';
        this.fullName = 'Ghetsis2 PLF';
        this.set = 'PLF';
    }
}
exports.Ghetsis2PLF = Ghetsis2PLF;
class EmpoleonPLF extends empoleon_1.Empoleon {
    constructor() {
        super(...arguments);
        this.setNumber = '117';
        this.fullName = 'Empoleon PLF';
        this.set = 'PLF';
    }
}
exports.EmpoleonPLF = EmpoleonPLF;
class SigilyphPLF extends sigilyph_1.Sigilyph {
    constructor() {
        super(...arguments);
        this.setNumber = '118';
        this.fullName = 'Sigilyph PLF';
        this.set = 'PLF';
    }
}
exports.SigilyphPLF = SigilyphPLF;
class GarbodorPLF extends garbodor_1.Garbodor {
    constructor() {
        super(...arguments);
        this.setNumber = '119';
        this.fullName = 'Garbodor PLF';
        this.set = 'PLF';
    }
}
exports.GarbodorPLF = GarbodorPLF;
class UltraBallPLF extends ultra_ball_1.UltraBall {
    constructor() {
        super(...arguments);
        this.setNumber = '122';
        this.fullName = 'Ultra Ball PLF';
        this.set = 'PLF';
    }
}
exports.UltraBallPLF = UltraBallPLF;

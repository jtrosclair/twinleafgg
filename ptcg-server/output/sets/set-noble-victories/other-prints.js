"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victini4NVI = exports.Virizion2NVI = exports.N2NVI = exports.Cobalion2NVI = exports.Terrakion2NVI = exports.RockyHelmetNVI = exports.NNVI = exports.CobalionNVI = exports.SuperRodNVI = void 0;
const cobalion_1 = require("../set-legendary-treasures/cobalion");
const n_1 = require("../set-fates-collide/n");
const rocky_helmet_1 = require("../set-scarlet-and-violet/rocky-helmet");
const terrakion_1 = require("../set-noble-victories/terrakion");
const cobalion_2 = require("../set-legendary-treasures/cobalion");
const n_2 = require("../set-fates-collide/n");
const super_rod_1 = require("../set-paldea-evolved/super-rod");
const virizion_1 = require("./virizion");
const victini_2_1 = require("./victini-2");
class SuperRodNVI extends super_rod_1.SuperRod {
    constructor() {
        super(...arguments);
        this.setNumber = '95';
        this.fullName = 'Super Rod NVI';
        this.set = 'NVI';
    }
}
exports.SuperRodNVI = SuperRodNVI;
class CobalionNVI extends cobalion_1.Cobalion {
    constructor() {
        super(...arguments);
        this.setNumber = '84';
        this.fullName = 'Cobalion NVI';
        this.set = 'NVI';
    }
}
exports.CobalionNVI = CobalionNVI;
class NNVI extends n_1.N {
    constructor() {
        super(...arguments);
        this.setNumber = '92';
        this.fullName = 'N NVI';
        this.set = 'NVI';
    }
}
exports.NNVI = NNVI;
class RockyHelmetNVI extends rocky_helmet_1.RockyHelmet {
    constructor() {
        super(...arguments);
        this.setNumber = '94';
        this.fullName = 'Rocky Helmet NVI';
        this.set = 'NVI';
    }
}
exports.RockyHelmetNVI = RockyHelmetNVI;
class Terrakion2NVI extends terrakion_1.Terrakion {
    constructor() {
        super(...arguments);
        this.setNumber = '99';
        this.fullName = 'Terrakion2 NVI';
        this.set = 'NVI';
    }
}
exports.Terrakion2NVI = Terrakion2NVI;
class Cobalion2NVI extends cobalion_2.Cobalion {
    constructor() {
        super(...arguments);
        this.setNumber = '100';
        this.fullName = 'Cobalion2 NVI';
        this.set = 'NVI';
    }
}
exports.Cobalion2NVI = Cobalion2NVI;
class N2NVI extends n_2.N {
    constructor() {
        super(...arguments);
        this.setNumber = '101';
        this.fullName = 'N2 NVI';
        this.set = 'NVI';
    }
}
exports.N2NVI = N2NVI;
class Virizion2NVI extends virizion_1.Virizion {
    constructor() {
        super(...arguments);
        this.setNumber = '97';
        this.fullName = 'Virizion NVI 97';
        this.set = 'NVI';
    }
}
exports.Virizion2NVI = Virizion2NVI;
class Victini4NVI extends victini_2_1.Victini2 {
    constructor() {
        super(...arguments);
        this.setNumber = '98';
        this.fullName = 'Victini NVI 98';
        this.set = 'NVI';
    }
}
exports.Victini4NVI = Victini4NVI;

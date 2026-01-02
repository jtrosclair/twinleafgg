"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeraoraVSTARSWSH = exports.ZeraoraVMAXSWSH = exports.ZeraoraVSWSH = exports.MarnieSWSH2 = exports.MarnieSWSH = exports.CharizardSWSH = exports.BronzongSWSH = void 0;
const bronzong_1 = require("../set-battle-styles/bronzong");
const charizard_1 = require("../set-vivid-voltage/charizard");
const marnie_1 = require("../set-sword-and-shield/marnie");
const zeraora_v_1 = require("../set-crown-zenith/zeraora-v");
const zeraora_vmax_1 = require("../set-crown-zenith/zeraora-vmax");
const zeraora_vstar_1 = require("../set-crown-zenith/zeraora-vstar");
class BronzongSWSH extends bronzong_1.Bronzong {
    constructor() {
        super(...arguments);
        this.fullName = 'Bronzong SWSH 91';
        this.set = 'SWSH';
        this.setNumber = '91';
    }
}
exports.BronzongSWSH = BronzongSWSH;
class CharizardSWSH extends charizard_1.Charizard {
    constructor() {
        super(...arguments);
        this.fullName = 'Charizard SWSH';
        this.set = 'SWSH';
        this.setNumber = '66';
    }
}
exports.CharizardSWSH = CharizardSWSH;
class MarnieSWSH extends marnie_1.Marnie {
    constructor() {
        super(...arguments);
        this.fullName = 'Marnie SWSH 120';
        this.set = 'SWSH';
        this.setNumber = '120';
    }
}
exports.MarnieSWSH = MarnieSWSH;
class MarnieSWSH2 extends marnie_1.Marnie {
    constructor() {
        super(...arguments);
        this.fullName = 'Marnie SWSH 121';
        this.set = 'SWSH';
        this.setNumber = '121';
    }
}
exports.MarnieSWSH2 = MarnieSWSH2;
class ZeraoraVSWSH extends zeraora_v_1.ZeraoraV {
    constructor() {
        super(...arguments);
        this.fullName = 'Zeraora V SWSH';
        this.set = 'SWSH';
        this.setNumber = '263';
    }
}
exports.ZeraoraVSWSH = ZeraoraVSWSH;
class ZeraoraVMAXSWSH extends zeraora_vmax_1.ZeraoraVMAX {
    constructor() {
        super(...arguments);
        this.fullName = 'Zeraora VMAX SWSH';
        this.set = 'SWSH';
        this.setNumber = '264';
    }
}
exports.ZeraoraVMAXSWSH = ZeraoraVMAXSWSH;
class ZeraoraVSTARSWSH extends zeraora_vstar_1.ZeraoraVSTAR {
    constructor() {
        super(...arguments);
        this.fullName = 'Zeraora VSTAR SWSH';
        this.set = 'SWSH';
        this.setNumber = '265';
    }
}
exports.ZeraoraVSTARSWSH = ZeraoraVSTARSWSH;

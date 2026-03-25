"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LureModule2PGO = exports.ProfessorsResearch2PGO = exports.ProfessorsResearchPGO = exports.SlakingV2PGO = exports.ConkeldurrV3PGO = exports.ConkeldurrV2PGO = exports.RareCandyPGO = exports.RadiantCharizardPGO = void 0;
const conkeldurr_v_1 = require("../set-pokemon-go/conkeldurr-v");
const slaking_v_1 = require("../set-pokemon-go/slaking-v");
const professors_research_1 = require("../set-scarlet-and-violet/professors-research");
const professors_research_2 = require("../set-scarlet-and-violet/professors-research");
const lure_module_1 = require("../set-pokemon-go/lure-module");
const radiant_charizard_1 = require("../set-crown-zenith/radiant-charizard");
const rare_candy_1 = require("../set-scarlet-and-violet/rare-candy");
class RadiantCharizardPGO extends radiant_charizard_1.RadiantCharizard {
    constructor() {
        super(...arguments);
        this.fullName = 'Radiant Charizard PGO';
        this.set = 'PGO';
        this.setNumber = '11';
    }
}
exports.RadiantCharizardPGO = RadiantCharizardPGO;
class RareCandyPGO extends rare_candy_1.RareCandy {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.setNumber = '69';
        this.fullName = 'Rare Candy PGO';
        this.set = 'PGO';
    }
}
exports.RareCandyPGO = RareCandyPGO;
class ConkeldurrV2PGO extends conkeldurr_v_1.ConkeldurrV {
    constructor() {
        super(...arguments);
        this.setNumber = '73';
        this.fullName = 'Conkeldurr V2 PGO';
        this.set = 'PGO';
    }
}
exports.ConkeldurrV2PGO = ConkeldurrV2PGO;
class ConkeldurrV3PGO extends conkeldurr_v_1.ConkeldurrV {
    constructor() {
        super(...arguments);
        this.setNumber = '74';
        this.fullName = 'Conkeldurr V3 PGO';
        this.set = 'PGO';
    }
}
exports.ConkeldurrV3PGO = ConkeldurrV3PGO;
class SlakingV2PGO extends slaking_v_1.SlakingV {
    constructor() {
        super(...arguments);
        this.setNumber = '77';
        this.fullName = 'Slaking V2 PGO';
        this.set = 'PGO';
    }
}
exports.SlakingV2PGO = SlakingV2PGO;
class ProfessorsResearchPGO extends professors_research_1.ProfessorsResearch {
    constructor() {
        super(...arguments);
        this.setNumber = '78';
        this.fullName = 'Professor\'s Research PGO';
        this.set = 'PGO';
    }
}
exports.ProfessorsResearchPGO = ProfessorsResearchPGO;
class ProfessorsResearch2PGO extends professors_research_2.ProfessorsResearch {
    constructor() {
        super(...arguments);
        this.setNumber = '84';
        this.fullName = 'Professor\'s Research2 PGO';
        this.set = 'PGO';
    }
}
exports.ProfessorsResearch2PGO = ProfessorsResearch2PGO;
class LureModule2PGO extends lure_module_1.LureModule {
    constructor() {
        super(...arguments);
        this.setNumber = '88';
        this.fullName = 'Lure Module2 PGO';
        this.set = 'PGO';
    }
}
exports.LureModule2PGO = LureModule2PGO;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsAdminCEL = exports.Mew2 = exports.HereComesTeamRocketCEL = exports.PikachuCEL = exports.ProfessorsResearchCELFA = exports.ProfessorsResearchCEL = void 0;
const professors_research_1 = require("../set-scarlet-and-violet/professors-research");
const pikachu_1 = require("../set-evolutions/pikachu");
const here_comes_team_rocket_1 = require("../set-team-rocket/here-comes-team-rocket");
const mew_1 = require("./mew");
const rockets_admin_1 = require("../set-ex-team-rocket-returns/rockets-admin");
class ProfessorsResearchCEL extends professors_research_1.ProfessorsResearch {
    constructor() {
        super(...arguments);
        this.fullName = 'Professor\'s Research CEL';
        this.set = 'CEL';
        this.setNumber = '23';
    }
}
exports.ProfessorsResearchCEL = ProfessorsResearchCEL;
class ProfessorsResearchCELFA extends professors_research_1.ProfessorsResearch {
    constructor() {
        super(...arguments);
        this.fullName = 'Professor\'s Research CEL FA';
        this.set = 'CEL';
        this.setNumber = '24';
    }
}
exports.ProfessorsResearchCELFA = ProfessorsResearchCELFA;
class PikachuCEL extends pikachu_1.Pikachu {
    constructor() {
        super(...arguments);
        this.set = 'CEL';
        this.setNumber = '5';
        this.fullName = 'Pikachu CEL';
    }
}
exports.PikachuCEL = PikachuCEL;
class HereComesTeamRocketCEL extends here_comes_team_rocket_1.HereComesTeamRocket {
    constructor() {
        super(...arguments);
        this.set = 'CEL';
        this.setNumber = '15A2';
        this.fullName = 'Here Comes Team Rocket! CEL';
    }
}
exports.HereComesTeamRocketCEL = HereComesTeamRocketCEL;
class Mew2 extends mew_1.Mew {
    constructor() {
        super(...arguments);
        this.set = 'CEL';
        this.setNumber = '25';
        this.fullName = 'Mew CEL 25';
    }
}
exports.Mew2 = Mew2;
class RocketsAdminCEL extends rockets_admin_1.RocketsAdmin {
    constructor() {
        super(...arguments);
        this.set = 'CEL';
        this.setNumber = '86A';
        this.fullName = 'Rocket\'s Admin. CEL';
    }
}
exports.RocketsAdminCEL = RocketsAdminCEL;

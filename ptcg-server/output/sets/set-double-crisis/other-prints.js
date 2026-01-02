"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquasSecretBase = void 0;
const team_aqua_hideout_1 = require("../set-ex-team-magma-vs-team-aqua/team-aqua-hideout");
class TeamAquasSecretBase extends team_aqua_hideout_1.TeamAquaHideout {
    constructor() {
        super(...arguments);
        this.set = 'DCR';
        this.setNumber = '28';
        this.name = 'Team Aqua\'s Secret Base';
        this.fullName = 'Team Aqua\'s Secret Base DCR';
        this.text = 'The Retreat Cost of each Pokémon in play (except for Team Aqua Pokémon) is [C] more.';
    }
}
exports.TeamAquasSecretBase = TeamAquasSecretBase;

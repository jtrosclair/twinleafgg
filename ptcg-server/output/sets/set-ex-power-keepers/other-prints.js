"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergySwitchPK = exports.DelcattyPK = void 0;
const delcatty_1 = require("../set-ex-ruby-and-sapphire/delcatty");
const energy_switch_1 = require("../set-scarlet-and-violet/energy-switch");
class DelcattyPK extends delcatty_1.Delcatty {
    constructor() {
        super(...arguments);
        this.fullName = 'Delcatty PK';
        this.name = 'Delcatty';
        this.set = 'PK';
        this.setNumber = '8';
    }
}
exports.DelcattyPK = DelcattyPK;
class EnergySwitchPK extends energy_switch_1.EnergySwitch {
    constructor() {
        super(...arguments);
        this.fullName = 'Energy Switch PK';
        this.name = 'Energy Switch';
        this.set = 'PK';
        this.setNumber = '75';
        this.text = 'Move a basic Energy from 1 of your Pokémon to another of your Pokémon.';
    }
}
exports.EnergySwitchPK = EnergySwitchPK;

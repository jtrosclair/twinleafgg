"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharizardSF = exports.CharmeleonSF = exports.CharmanderSF = exports.SwitchSF = exports.PotionSF = exports.GreatBallSF = exports.EnergySwitchPKSF = exports.WarpEnergySF = exports.PremierBallSF = exports.CycloneEnergySF = void 0;
const other_prints_1 = require("../set-ex-power-keepers/other-prints");
const great_ball_1 = require("../set-ex-firered-leafgreen/great-ball");
const potion_1 = require("../set-base-set/potion");
const switch_1 = require("../set-base-set/switch");
const charmander_1 = require("../set-base-set/charmander");
const charmeleon_1 = require("../set-base-set/charmeleon");
const charizard_1 = require("../set-base-set/charizard");
const cyclone_energy_1 = require("../set-ex-power-keepers/cyclone-energy");
const premier_ball_1 = require("../set-great-encounters/premier-ball");
const warp_energy_1 = require("../set-shining-legends/warp-energy");
class CycloneEnergySF extends cyclone_energy_1.CycloneEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Cyclone Energy SF';
        this.name = 'Cyclone Energy';
        this.set = 'SF';
        this.setNumber = '94';
        this.text = 'Cyclone Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch 1 of the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. Your opponent chooses the Benched Pokémon to switch.';
    }
}
exports.CycloneEnergySF = CycloneEnergySF;
class PremierBallSF extends premier_ball_1.PremierBall {
    constructor() {
        super(...arguments);
        this.fullName = 'Premier Ball SF';
        this.name = 'Premier Ball';
        this.set = 'SF';
        this.setNumber = '91';
    }
}
exports.PremierBallSF = PremierBallSF;
class WarpEnergySF extends warp_energy_1.WarpEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Warp Energy SF';
        this.name = 'Warp Energy';
        this.set = 'SF';
        this.setNumber = '95';
        this.text = 'Warp Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.';
    }
}
exports.WarpEnergySF = WarpEnergySF;
class EnergySwitchPKSF extends other_prints_1.EnergySwitchPK {
    constructor() {
        super(...arguments);
        this.setNumber = '84';
        this.fullName = 'Energy Switch SF';
        this.set = 'SF';
    }
}
exports.EnergySwitchPKSF = EnergySwitchPKSF;
class GreatBallSF extends great_ball_1.GreatBall {
    constructor() {
        super(...arguments);
        this.setNumber = '85';
        this.fullName = 'Great Ball SF';
        this.set = 'SF';
    }
}
exports.GreatBallSF = GreatBallSF;
class PotionSF extends potion_1.Potion {
    constructor() {
        super(...arguments);
        this.setNumber = '92';
        this.fullName = 'Potion SF';
        this.set = 'SF';
    }
}
exports.PotionSF = PotionSF;
class SwitchSF extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.fullName = 'Switch SF';
        this.set = 'SF';
    }
}
exports.SwitchSF = SwitchSF;
class CharmanderSF extends charmander_1.Charmander {
    constructor() {
        super(...arguments);
        this.setNumber = '101';
        this.fullName = 'Charmander SF';
        this.set = 'SF';
    }
}
exports.CharmanderSF = CharmanderSF;
class CharmeleonSF extends charmeleon_1.Charmeleon {
    constructor() {
        super(...arguments);
        this.setNumber = '102';
        this.fullName = 'Charmeleon SF';
        this.set = 'SF';
    }
}
exports.CharmeleonSF = CharmeleonSF;
class CharizardSF extends charizard_1.Charizard {
    constructor() {
        super(...arguments);
        this.setNumber = '103';
        this.fullName = 'Charizard SF';
        this.set = 'SF';
    }
}
exports.CharizardSF = CharizardSF;

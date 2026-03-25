"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpPointCG = exports.PotionCG = exports.PokeNavCG = exports.PokeBallCG = exports.EnergySearchCG = exports.DualBallCG = exports.BillsMaintenanceCG = void 0;
const bills_maintenance_1 = require("../set-ex-firered-leafgreen/bills-maintenance");
const dual_ball_1 = require("../set-unleashed/dual-ball");
const energy_search_1 = require("../set-scarlet-and-violet/energy-search");
const pokeball_1 = require("../set-jungle/pokeball");
const pokenav_1 = require("../set-ex-ruby-and-sapphire/pokenav");
const potion_1 = require("../set-base-set/potion");
const other_prints_1 = require("../set-ex-team-magma-vs-team-aqua/other-prints");
class BillsMaintenanceCG extends bills_maintenance_1.BillsMaintenance {
    constructor() {
        super(...arguments);
        this.fullName = 'Bills Maintenance CG';
        this.set = 'CG';
        this.setNumber = '71';
    }
}
exports.BillsMaintenanceCG = BillsMaintenanceCG;
class DualBallCG extends dual_ball_1.DualBall {
    constructor() {
        super(...arguments);
        this.fullName = 'Dual Ball CG';
        this.set = 'CG';
        this.setNumber = '78';
        this.text = 'Flip 2 coins. For each heads, search your deck for a Basic Pokémon card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
}
exports.DualBallCG = DualBallCG;
class EnergySearchCG extends energy_search_1.EnergySearch {
    constructor() {
        super(...arguments);
        this.fullName = 'Energy Search CG';
        this.set = 'CG';
        this.setNumber = '86';
        this.text = 'Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
}
exports.EnergySearchCG = EnergySearchCG;
class PokeBallCG extends pokeball_1.PokeBall {
    constructor() {
        super(...arguments);
        this.fullName = 'Poké Ball CG';
        this.set = 'CG';
        this.setNumber = '82';
        this.text = 'Flip a coin. If heads, search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';
    }
}
exports.PokeBallCG = PokeBallCG;
class PokeNavCG extends pokenav_1.PokeNav {
    constructor() {
        super(...arguments);
        this.fullName = 'PokéNav CG';
        this.set = 'CG';
        this.setNumber = '83';
    }
}
exports.PokeNavCG = PokeNavCG;
class PotionCG extends potion_1.Potion {
    constructor() {
        super(...arguments);
        this.fullName = 'Potion CG';
        this.set = 'CG';
        this.setNumber = '87';
        this.text = 'Remove 2 damage counters from 1 of your Pokémon (remove 1 damage counter if that Pokémon has only 1).';
    }
}
exports.PotionCG = PotionCG;
class WarpPointCG extends other_prints_1.WarpPointMA {
    constructor() {
        super(...arguments);
        this.fullName = 'Warp Point CG';
        this.set = 'CG';
        this.setNumber = '84';
    }
}
exports.WarpPointCG = WarpPointCG;

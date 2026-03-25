"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchEX = exports.SuperScoopUpEX = exports.StrengthCharmEX = exports.ProfessorOaksResearchEX = exports.ProfessorElmsTrainingMethodEX = exports.PokemonReversalEX = exports.EnergySearchEX = exports.EnergyRemoval2EX = exports.DualBallEX = exports.CopycatEX = exports.BillsMaintenanceEX = void 0;
const bills_maintenance_1 = require("../set-ex-firered-leafgreen/bills-maintenance");
const copycat_1 = require("../set-ex-dragon-frontiers/copycat");
const dual_ball_1 = require("../set-unleashed/dual-ball");
const energy_removal_2_1 = require("../set-ex-power-keepers/energy-removal-2");
const energy_search_1 = require("../set-scarlet-and-violet/energy-search");
const pokemon_reversal_1 = require("../set-ex-unseen-forces/pokemon-reversal");
const professors_elm_training_method_1 = require("../set-ex-unseen-forces/professors-elm-training-method");
const professor_oaks_research_1 = require("../set-ex-dragon-frontiers/professor-oaks-research");
const strength_charm_1 = require("../set-ex-dragon-frontiers/strength-charm");
const super_scoop_up_1 = require("../set-diamond-and-pearl/super-scoop-up");
const switch_1 = require("../set-scarlet-and-violet/switch");
class BillsMaintenanceEX extends bills_maintenance_1.BillsMaintenance {
    constructor() {
        super(...arguments);
        this.fullName = 'Bill\'s Maintenance EX';
        this.set = 'EX';
        this.setNumber = '137';
        this.text = 'If you have any cards in your hand, shuffle 1 of them into your deck, then draw 3 cards.';
    }
}
exports.BillsMaintenanceEX = BillsMaintenanceEX;
class CopycatEX extends copycat_1.Copycat {
    constructor() {
        super(...arguments);
        this.fullName = 'Copycat EX';
        this.set = 'EX';
        this.setNumber = '138';
        this.text = 'Shuffle your hand into your deck. Then, count the number of cards in your opponent\'s hand and draw that many cards.';
    }
}
exports.CopycatEX = CopycatEX;
class DualBallEX extends dual_ball_1.DualBall {
    constructor() {
        super(...arguments);
        this.fullName = 'Dual Ball EX';
        this.set = 'EX';
        this.setNumber = '139';
        this.text = 'Flip 2 coins. For each heads, search your deck for a Basic Pokémon, show it to your opponent, and put it into your hand. If you do, shuffle your deck afterward.';
    }
}
exports.DualBallEX = DualBallEX;
class EnergyRemoval2EX extends energy_removal_2_1.EnergyRemoval2 {
    constructor() {
        super(...arguments);
        this.fullName = 'Energy Removal 2 EX';
        this.set = 'EX';
        this.setNumber = '140';
        this.text = 'Flip a coin. If heads, choose 1 Energy card attached to 1 of your opponent\'s Pokémon and discard it.';
    }
}
exports.EnergyRemoval2EX = EnergyRemoval2EX;
class EnergySearchEX extends energy_search_1.EnergySearch {
    constructor() {
        super(...arguments);
        this.fullName = 'Energy Search EX';
        this.set = 'EX';
        this.setNumber = '153';
        this.text = 'Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
}
exports.EnergySearchEX = EnergySearchEX;
class PokemonReversalEX extends pokemon_reversal_1.PokemonReversal {
    constructor() {
        super(...arguments);
        this.fullName = 'Pokémon Reversal EX';
        this.set = 'EX';
        this.setNumber = '146';
        this.text = 'Choose 1 of your opponent\'s Benched Pokémon. Flip a coin. If heads, switch that Pokémon with the Defending Pokémon.';
    }
}
exports.PokemonReversalEX = PokemonReversalEX;
class ProfessorElmsTrainingMethodEX extends professors_elm_training_method_1.ProfessorElmsTrainingMethod {
    constructor() {
        super(...arguments);
        this.fullName = 'Professor Elm\'s Training Method EX';
        this.set = 'EX';
        this.setNumber = '148';
        this.text = 'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
}
exports.ProfessorElmsTrainingMethodEX = ProfessorElmsTrainingMethodEX;
class ProfessorOaksResearchEX extends professor_oaks_research_1.ProfessorOaksResearch {
    constructor() {
        super(...arguments);
        this.fullName = 'Professor Oak\'s Research EX';
        this.set = 'EX';
        this.setNumber = '149';
        this.text = 'Shuffle your hand into your deck, then draw 5 cards.';
    }
}
exports.ProfessorOaksResearchEX = ProfessorOaksResearchEX;
class StrengthCharmEX extends strength_charm_1.StrengthCharm {
    constructor() {
        super(...arguments);
        this.fullName = 'Strength Charm EX';
        this.set = 'EX';
        this.setNumber = '150';
        this.text = 'Whenever an attack from the Pokémon that Strength Charm is attached to does damage (after applying Weakness and Resistance), the attack does 10 more damage. At the end of your turn in which this happens, discard Strength Charm.';
    }
}
exports.StrengthCharmEX = StrengthCharmEX;
class SuperScoopUpEX extends super_scoop_up_1.SuperScoopUp {
    constructor() {
        super(...arguments);
        this.fullName = 'Super Scoop Up EX';
        this.set = 'EX';
        this.setNumber = '151';
        this.text = 'Flip a coin. If heads, return 1 of your Pokémon and all cards attached to it to your hand.';
    }
}
exports.SuperScoopUpEX = SuperScoopUpEX;
class SwitchEX extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.fullName = 'Switch EX';
        this.set = 'EX';
        this.setNumber = '157';
        this.text = 'Switch your Active Pokémon with 1 of your Benched Pokémon.';
    }
}
exports.SwitchEX = SwitchEX;

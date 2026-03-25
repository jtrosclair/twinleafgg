"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchRG = exports.VsSeekerRG = exports.ProfOaksResearchRG = exports.PokemonReversalRG = exports.MultiEnergyRG = exports.LifeHerbRG = exports.EnergyRemoval2RG = void 0;
const energy_removal_2_1 = require("../set-ex-power-keepers/energy-removal-2");
const life_herb_1 = require("../set-ex-hidden-legends/life-herb");
const multi_energy_1 = require("../set-ex-sandstorm/multi-energy");
const pokemon_reversal_1 = require("../set-ex-unseen-forces/pokemon-reversal");
const professor_oaks_research_1 = require("../set-ex-dragon-frontiers/professor-oaks-research");
const vs_seeker_1 = require("../set-phantom-forces/vs-seeker");
const switch_1 = require("../set-scarlet-and-violet/switch");
class EnergyRemoval2RG extends energy_removal_2_1.EnergyRemoval2 {
    constructor() {
        super(...arguments);
        this.fullName = 'Energy Removal 2 RG';
        this.set = 'RG';
        this.setNumber = '89';
    }
}
exports.EnergyRemoval2RG = EnergyRemoval2RG;
class LifeHerbRG extends life_herb_1.LifeHerb {
    constructor() {
        super(...arguments);
        this.fullName = 'Life Herb RG';
        this.set = 'RG';
        this.setNumber = '93';
    }
}
exports.LifeHerbRG = LifeHerbRG;
class MultiEnergyRG extends multi_energy_1.MultiEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Multi Energy RG';
        this.set = 'RG';
        this.setNumber = '103';
    }
}
exports.MultiEnergyRG = MultiEnergyRG;
class PokemonReversalRG extends pokemon_reversal_1.PokemonReversal {
    constructor() {
        super(...arguments);
        this.fullName = 'Pokémon Reversal RG';
        this.set = 'RG';
        this.setNumber = '97';
        this.text = 'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.';
    }
}
exports.PokemonReversalRG = PokemonReversalRG;
class ProfOaksResearchRG extends professor_oaks_research_1.ProfessorOaksResearch {
    constructor() {
        super(...arguments);
        this.fullName = 'Prof. Oak\'s Research RG';
        this.name = 'Prof. Oak\'s Research';
        this.set = 'RG';
        this.setNumber = '98';
    }
}
exports.ProfOaksResearchRG = ProfOaksResearchRG;
class VsSeekerRG extends vs_seeker_1.VsSeeker {
    constructor() {
        super(...arguments);
        this.fullName = 'VS Seeker RG';
        this.set = 'RG';
        this.setNumber = '100';
        this.text = 'Search your discard pile for a Supporter card, show it to your opponent, and put it into your hand.';
    }
}
exports.VsSeekerRG = VsSeekerRG;
class SwitchRG extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.fullName = 'Switch RG';
        this.set = 'RG';
        this.setNumber = '102';
        this.text = 'Switch your Active Pokémon with 1 of your Benched Pokémon.';
    }
}
exports.SwitchRG = SwitchRG;

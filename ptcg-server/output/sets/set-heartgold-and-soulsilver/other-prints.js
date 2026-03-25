"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorElmsTrainingMethodHS = exports.PokeBallHS = exports.FullHealHS = exports.EnergySwitchPKHS = exports.CopycatHS = exports.BillHS = exports.SwitchHS = exports.RainbowEnergyHS = exports.PokemonReversalHS = exports.PokemonCommunicationHS = exports.Pokegear30HS = exports.FishermanHS = exports.DoubleColorlessEnergyHS = void 0;
const bill_1 = require("../set-base-set/bill");
const copycat_1 = require("../set-ex-dragon-frontiers/copycat");
const other_prints_1 = require("../set-ex-power-keepers/other-prints");
const full_heal_1 = require("../set-base-set/full-heal");
const pokeball_1 = require("../set-jungle/pokeball");
const professors_elm_training_method_1 = require("../set-ex-unseen-forces/professors-elm-training-method");
const double_colorless_energy_1 = require("../set-base-set/double-colorless-energy");
const fisherman_1 = require("../set-celestial-storm/fisherman");
const pokegear_30_1 = require("../set-scarlet-and-violet/pokegear-30");
const pokemon_communication_1 = require("../set-team-up/pokemon-communication");
const pokemon_reversal_1 = require("../set-ex-unseen-forces/pokemon-reversal");
const rainbow_energy_1 = require("../set-sun-and-moon/rainbow-energy");
const switch_1 = require("../set-scarlet-and-violet/switch");
class DoubleColorlessEnergyHS extends double_colorless_energy_1.DoubleColorlessEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Double Colorless Energy HS';
        this.set = 'HS';
        this.setNumber = '103';
        this.text = 'Double Colorless Energy provides [C][C] Energy.';
    }
}
exports.DoubleColorlessEnergyHS = DoubleColorlessEnergyHS;
class FishermanHS extends fisherman_1.Fisherman {
    constructor() {
        super(...arguments);
        this.fullName = 'Fisherman HS';
        this.name = 'Fisherman';
        this.set = 'HS';
        this.setNumber = '92';
        this.text = 'Search your discard pile for 4 basic Energy cards, show them to your opponent, and put them into your hand.';
    }
}
exports.FishermanHS = FishermanHS;
class Pokegear30HS extends pokegear_30_1.Pokegear30 {
    constructor() {
        super(...arguments);
        this.fullName = 'Pokégear 3.0 HS';
        this.name = 'Pokégear 3.0';
        this.set = 'HS';
        this.setNumber = '96';
        this.text = 'Look at the top 7 cards of your deck. Choose a Supporter card you find there, show it to your opponent, and put it into your hand. Shuffle the other cards back into your deck.';
    }
}
exports.Pokegear30HS = Pokegear30HS;
class PokemonCommunicationHS extends pokemon_communication_1.PokemonCommunication {
    constructor() {
        super(...arguments);
        this.fullName = 'Pokemon Communication HS';
        this.name = 'Pokémon Communication';
        this.set = 'HS';
        this.setNumber = '98';
        this.text = 'Choose 1 Pokémon in your hand, show it to your opponent, and put it on top of your deck. If you do, search your deck for a Pokémon, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
}
exports.PokemonCommunicationHS = PokemonCommunicationHS;
class PokemonReversalHS extends pokemon_reversal_1.PokemonReversal {
    constructor() {
        super(...arguments);
        this.fullName = 'Pokemon Reversal HS';
        this.name = 'Pokémon Reversal';
        this.set = 'HS';
        this.setNumber = '99';
        this.text = 'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with your opponent\'s Active Pokémon.';
    }
}
exports.PokemonReversalHS = PokemonReversalHS;
class RainbowEnergyHS extends rainbow_energy_1.RainbowEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Rainbow Energy HS';
        this.set = 'HS';
        this.setNumber = '104';
        this.text = 'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy provides every type of Energy but provides only 1 Energy at a time. (Has no effect other than providing Energy.) When you attach this card from your hand to 1 of your Pokémon, put 1 damage counter on that Pokémon. (While not in play, Rainbow Energy counts as [C] Energy.)';
    }
}
exports.RainbowEnergyHS = RainbowEnergyHS;
class SwitchHS extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.fullName = 'Switch HS';
        this.name = 'Switch';
        this.set = 'HS';
        this.setNumber = '102';
        this.text = 'Switch 1 of your Active Pokémon with 1 of your Benched Pokémon.';
    }
}
exports.SwitchHS = SwitchHS;
class BillHS extends bill_1.Bill {
    constructor() {
        super(...arguments);
        this.setNumber = '89';
        this.fullName = 'Bill HS';
        this.set = 'HS';
    }
}
exports.BillHS = BillHS;
class CopycatHS extends copycat_1.Copycat {
    constructor() {
        super(...arguments);
        this.setNumber = '90';
        this.fullName = 'Copycat HS';
        this.set = 'HS';
    }
}
exports.CopycatHS = CopycatHS;
class EnergySwitchPKHS extends other_prints_1.EnergySwitchPK {
    constructor() {
        super(...arguments);
        this.setNumber = '91';
        this.fullName = 'Energy Switch HS';
        this.set = 'HS';
    }
}
exports.EnergySwitchPKHS = EnergySwitchPKHS;
class FullHealHS extends full_heal_1.FullHeal {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.fullName = 'Full Heal HS';
        this.set = 'HS';
    }
}
exports.FullHealHS = FullHealHS;
class PokeBallHS extends pokeball_1.PokeBall {
    constructor() {
        super(...arguments);
        this.setNumber = '95';
        this.fullName = 'Poké Ball HS';
        this.set = 'HS';
    }
}
exports.PokeBallHS = PokeBallHS;
class ProfessorElmsTrainingMethodHS extends professors_elm_training_method_1.ProfessorElmsTrainingMethod {
    constructor() {
        super(...arguments);
        this.setNumber = '100';
        this.fullName = 'Professor Elm\'s Training Method HS';
        this.set = 'HS';
    }
}
exports.ProfessorElmsTrainingMethodHS = ProfessorElmsTrainingMethodHS;

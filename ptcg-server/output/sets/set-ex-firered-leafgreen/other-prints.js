"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchRG = exports.VsSeekerFL = exports.PokemonReversalRG = void 0;
const pokemon_reversal_1 = require("../set-ex-unseen-forces/pokemon-reversal");
const vs_seeker_1 = require("../set-phantom-forces/vs-seeker");
const switch_1 = require("../set-scarlet-and-violet/switch");
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
class VsSeekerFL extends vs_seeker_1.VsSeeker {
    constructor() {
        super(...arguments);
        this.fullName = 'VS Seeker RG';
        this.set = 'RG';
        this.setNumber = '100';
        this.text = 'Search your discard pile for a Supporter card, show it to your opponent, and put it into your hand.';
    }
}
exports.VsSeekerFL = VsSeekerFL;
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

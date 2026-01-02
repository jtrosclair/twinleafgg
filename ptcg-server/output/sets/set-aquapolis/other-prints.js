"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpEnergyAQ = exports.RainbowEnergyAQ = exports.PokemonFanClubAQ = void 0;
const pokemon_fan_club_1 = require("../set-pop-series-4/pokemon-fan-club");
const rainbow_energy_1 = require("../set-sun-and-moon/rainbow-energy");
const warp_energy_1 = require("../set-shining-legends/warp-energy");
class PokemonFanClubAQ extends pokemon_fan_club_1.PokemonFanClub {
    constructor() {
        super(...arguments);
        this.fullName = 'Pokemon Fan Club AQ';
        this.set = 'AQ';
        this.setNumber = '130';
        this.text = 'Search your deck for up to 2 Baby Pokémon and/or Basic Pokémon cards and put them onto your Bench. Shuffle your deck afterward.';
    }
}
exports.PokemonFanClubAQ = PokemonFanClubAQ;
class RainbowEnergyAQ extends rainbow_energy_1.RainbowEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Rainbow Energy AQ';
        this.set = 'AQ';
        this.setNumber = '144';
        this.text = 'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy provides every type of Energy but provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) When you attach this card from your hand to 1 of your Pokémon, put 1 damage counter on that Pokémon.';
    }
}
exports.RainbowEnergyAQ = RainbowEnergyAQ;
class WarpEnergyAQ extends warp_energy_1.WarpEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Warp Energy AQ';
        this.set = 'AQ';
        this.setNumber = '147';
        this.text = 'Warp Energy provides 1 [C] Energy.\n\nWhen you attach Warp Energy from your hand to your Active Pokémon, switch your Active Pokémon with 1 of your Benched Pokémon.';
    }
}
exports.WarpEnergyAQ = WarpEnergyAQ;

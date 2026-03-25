"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalEnergy = exports.DarknessEnergy = exports.FightingEnergy = exports.PsychicEnergy = exports.LightningEnergy = exports.WaterEnergy = exports.FireEnergy = exports.GrassEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class GrassEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.GRASS];
        this.set = 'CL';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Grass Energy';
        this.fullName = 'Grass Energy CL';
    }
}
exports.GrassEnergy = GrassEnergy;
class FireEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIRE];
        this.set = 'CL';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.name = 'Fire Energy';
        this.fullName = 'Fire Energy CL';
    }
}
exports.FireEnergy = FireEnergy;
class WaterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.WATER];
        this.set = 'CL';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Water Energy';
        this.fullName = 'Water Energy CL';
    }
}
exports.WaterEnergy = WaterEnergy;
class LightningEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.LIGHTNING];
        this.set = 'CL';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Lightning Energy';
        this.fullName = 'Lightning Energy CL';
    }
}
exports.LightningEnergy = LightningEnergy;
class PsychicEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.PSYCHIC];
        this.set = 'CL';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Psychic Energy';
        this.fullName = 'Psychic Energy CL';
    }
}
exports.PsychicEnergy = PsychicEnergy;
class FightingEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIGHTING];
        this.set = 'CL';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Fighting Energy';
        this.fullName = 'Fighting Energy CL';
    }
}
exports.FightingEnergy = FightingEnergy;
class DarknessEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.DARK];
        this.set = 'CL';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Darkness Energy';
        this.fullName = 'Darkness Energy CL';
    }
}
exports.DarknessEnergy = DarknessEnergy;
class MetalEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.METAL];
        this.set = 'CL';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Metal Energy';
        this.fullName = 'Metal Energy CL';
    }
}
exports.MetalEnergy = MetalEnergy;

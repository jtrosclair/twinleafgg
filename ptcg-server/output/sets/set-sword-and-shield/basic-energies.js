"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalEnergy = exports.DarknessEnergy = exports.FightingEnergy = exports.PsychicEnergy = exports.LightningEnergy = exports.WaterEnergy = exports.FireEnergy = exports.GrassEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class GrassEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.GRASS];
        this.set = 'SSH';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'G';
        this.name = 'Grass Energy';
        this.fullName = 'Grass Energy SSH';
    }
}
exports.GrassEnergy = GrassEnergy;
class FireEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIRE];
        this.set = 'SSH';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'R';
        this.name = 'Fire Energy';
        this.fullName = 'Fire Energy SSH';
    }
}
exports.FireEnergy = FireEnergy;
class WaterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.WATER];
        this.set = 'SSH';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'W';
        this.name = 'Water Energy';
        this.fullName = 'Water Energy SSH';
    }
}
exports.WaterEnergy = WaterEnergy;
class LightningEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.LIGHTNING];
        this.set = 'SSH';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'L';
        this.name = 'Lightning Energy';
        this.fullName = 'Lightning Energy SSH';
    }
}
exports.LightningEnergy = LightningEnergy;
class PsychicEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.PSYCHIC];
        this.set = 'SSH';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'P';
        this.name = 'Psychic Energy';
        this.fullName = 'Psychic Energy SSH';
    }
}
exports.PsychicEnergy = PsychicEnergy;
class FightingEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIGHTING];
        this.set = 'SSH';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'F';
        this.name = 'Fighting Energy';
        this.fullName = 'Fighting Energy SSH';
    }
}
exports.FightingEnergy = FightingEnergy;
class DarknessEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.DARK];
        this.set = 'SSH';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'D';
        this.name = 'Darkness Energy';
        this.fullName = 'Darkness Energy SSH';
    }
}
exports.DarknessEnergy = DarknessEnergy;
class MetalEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.METAL];
        this.set = 'SSH';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'M';
        this.name = 'Metal Energy';
        this.fullName = 'Metal Energy SSH';
    }
}
exports.MetalEnergy = MetalEnergy;

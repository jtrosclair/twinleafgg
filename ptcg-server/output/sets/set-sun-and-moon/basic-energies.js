"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FairyEnergy = exports.MetalEnergy = exports.DarknessEnergy = exports.FightingEnergy = exports.PsychicEnergy = exports.LightningEnergy = exports.WaterEnergy = exports.FireEnergy = exports.GrassEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class GrassEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.GRASS];
        this.set = 'SUM';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'G';
        this.name = 'Grass Energy';
        this.fullName = 'Grass Energy SUM';
    }
}
exports.GrassEnergy = GrassEnergy;
class FireEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIRE];
        this.set = 'SUM';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'R';
        this.name = 'Fire Energy';
        this.fullName = 'Fire Energy SUM';
    }
}
exports.FireEnergy = FireEnergy;
class WaterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.WATER];
        this.set = 'SUM';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'W';
        this.name = 'Water Energy';
        this.fullName = 'Water Energy SUM';
    }
}
exports.WaterEnergy = WaterEnergy;
class LightningEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.LIGHTNING];
        this.set = 'SUM';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'L';
        this.name = 'Lightning Energy';
        this.fullName = 'Lightning Energy SUM';
    }
}
exports.LightningEnergy = LightningEnergy;
class PsychicEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.PSYCHIC];
        this.set = 'SUM';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'P';
        this.name = 'Psychic Energy';
        this.fullName = 'Psychic Energy SUM';
    }
}
exports.PsychicEnergy = PsychicEnergy;
class FightingEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIGHTING];
        this.set = 'SUM';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'F';
        this.name = 'Fighting Energy';
        this.fullName = 'Fighting Energy SUM';
    }
}
exports.FightingEnergy = FightingEnergy;
class DarknessEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.DARK];
        this.set = 'SUM';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'D';
        this.name = 'Darkness Energy';
        this.fullName = 'Darkness Energy SUM';
    }
}
exports.DarknessEnergy = DarknessEnergy;
class MetalEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.METAL];
        this.set = 'SUM';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'M';
        this.name = 'Metal Energy';
        this.fullName = 'Metal Energy SUM';
    }
}
exports.MetalEnergy = MetalEnergy;
class FairyEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FAIRY];
        this.set = 'SUM';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'Y';
        this.name = 'Fairy Energy';
        this.fullName = 'Fairy Energy SUM';
    }
}
exports.FairyEnergy = FairyEnergy;

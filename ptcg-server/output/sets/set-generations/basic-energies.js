"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FairyEnergy = exports.MetalEnergy = exports.DarknessEnergy = exports.FightingEnergy = exports.PsychicEnergy = exports.LightningEnergy = exports.WaterEnergy = exports.FireEnergy = exports.GrassEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class GrassEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.GRASS];
        this.set = 'GEN';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Grass Energy';
        this.fullName = 'Grass Energy GEN';
    }
}
exports.GrassEnergy = GrassEnergy;
class FireEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIRE];
        this.set = 'GEN';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Fire Energy';
        this.fullName = 'Fire Energy GEN';
    }
}
exports.FireEnergy = FireEnergy;
class WaterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.WATER];
        this.set = 'GEN';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Water Energy';
        this.fullName = 'Water Energy GEN';
    }
}
exports.WaterEnergy = WaterEnergy;
class LightningEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.LIGHTNING];
        this.set = 'GEN';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Lightning Energy';
        this.fullName = 'Lightning Energy GEN';
    }
}
exports.LightningEnergy = LightningEnergy;
class PsychicEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.PSYCHIC];
        this.set = 'GEN';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Psychic Energy';
        this.fullName = 'Psychic Energy GEN';
    }
}
exports.PsychicEnergy = PsychicEnergy;
class FightingEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIGHTING];
        this.set = 'GEN';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Fighting Energy';
        this.fullName = 'Fighting Energy GEN';
    }
}
exports.FightingEnergy = FightingEnergy;
class DarknessEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.DARK];
        this.set = 'GEN';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Darkness Energy';
        this.fullName = 'Darkness Energy GEN';
    }
}
exports.DarknessEnergy = DarknessEnergy;
class MetalEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.METAL];
        this.set = 'GEN';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Metal Energy';
        this.fullName = 'Metal Energy GEN';
    }
}
exports.MetalEnergy = MetalEnergy;
class FairyEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FAIRY];
        this.set = 'GEN';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Fairy Energy';
        this.fullName = 'Fairy Energy GEN';
    }
}
exports.FairyEnergy = FairyEnergy;

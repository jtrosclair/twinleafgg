"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FightingEnergy = exports.PsychicEnergy = exports.LightningEnergy = exports.WaterEnergy = exports.FireEnergy = exports.GrassEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class GrassEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.GRASS];
        this.set = 'PK';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.name = 'Grass Energy';
        this.fullName = 'Grass Energy PK';
    }
}
exports.GrassEnergy = GrassEnergy;
class FireEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIRE];
        this.set = 'PK';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Fire Energy';
        this.fullName = 'Fire Energy PK';
    }
}
exports.FireEnergy = FireEnergy;
class WaterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.WATER];
        this.set = 'PK';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Water Energy';
        this.fullName = 'Water Energy PK';
    }
}
exports.WaterEnergy = WaterEnergy;
class LightningEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.LIGHTNING];
        this.set = 'PK';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Lightning Energy';
        this.fullName = 'Lightning Energy PK';
    }
}
exports.LightningEnergy = LightningEnergy;
class PsychicEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.PSYCHIC];
        this.set = 'PK';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Psychic Energy';
        this.fullName = 'Psychic Energy PK';
    }
}
exports.PsychicEnergy = PsychicEnergy;
class FightingEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIGHTING];
        this.set = 'PK';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '108';
        this.name = 'Fighting Energy';
        this.fullName = 'Fighting Energy PK';
    }
}
exports.FightingEnergy = FightingEnergy;

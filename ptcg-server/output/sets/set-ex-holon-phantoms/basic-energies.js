"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FightingEnergy = exports.PsychicEnergy = exports.LightningEnergy = exports.WaterEnergy = exports.FireEnergy = exports.GrassEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
class GrassEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.GRASS];
        this.set = 'HP';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Grass Energy';
        this.fullName = 'Grass Energy HP';
    }
}
exports.GrassEnergy = GrassEnergy;
class FireEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIRE];
        this.set = 'HP';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Fire Energy';
        this.fullName = 'Fire Energy HP';
    }
}
exports.FireEnergy = FireEnergy;
class WaterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.WATER];
        this.set = 'HP';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Water Energy';
        this.fullName = 'Water Energy HP';
    }
}
exports.WaterEnergy = WaterEnergy;
class LightningEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.LIGHTNING];
        this.set = 'HP';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '108';
        this.name = 'Lightning Energy';
        this.fullName = 'Lightning Energy HP';
    }
}
exports.LightningEnergy = LightningEnergy;
class PsychicEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.PSYCHIC];
        this.set = 'HP';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Psychic Energy';
        this.fullName = 'Psychic Energy HP';
    }
}
exports.PsychicEnergy = PsychicEnergy;
class FightingEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIGHTING];
        this.set = 'HP';
        this.regulationMark = 'ENERGY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Fighting Energy';
        this.fullName = 'Fighting Energy HP';
    }
}
exports.FightingEnergy = FightingEnergy;

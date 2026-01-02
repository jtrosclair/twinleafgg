"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperEnergyRetrieval = exports.RecycleEnergyN1 = exports.MetalEnergyN1 = void 0;
const metal_energy_special_1 = require("../set-aquapolis/metal-energy-special");
const recycle_energy_1 = require("../set-unified-minds/recycle-energy");
const superior_energy_retrieval_1 = require("../set-plasma-freeze/superior-energy-retrieval");
class MetalEnergyN1 extends metal_energy_special_1.MetalEnergySpecial {
    constructor() {
        super(...arguments);
        this.fullName = 'Metal Energy N1';
        this.name = 'Metal Energy';
        this.set = 'N1';
        this.setNumber = '19';
        this.text = 'Damage done by attacks to the Pokémon that Metal Energy is attached to is reduced by 10 (after applying Weakness and Resistance). Ignore this effect if the Pokémon that Metal Energy is attached to isn\'t [M]. Metal Energy provides [M] Energy. (Doesn\'t count as a basic Energy card.)';
    }
}
exports.MetalEnergyN1 = MetalEnergyN1;
class RecycleEnergyN1 extends recycle_energy_1.RecycleEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Recycle Energy N1';
        this.name = 'Recycle Energy';
        this.set = 'N1';
        this.setNumber = '105';
        this.text = 'Recycle Energy provides [C] Energy. (Doesn\'t count as a basic Energy card.)\n\nIf this card is put into your discard pile from play, return it to your hand.';
    }
}
exports.RecycleEnergyN1 = RecycleEnergyN1;
class SuperEnergyRetrieval extends superior_energy_retrieval_1.SuperiorEnergyRetrieval {
    constructor() {
        super(...arguments);
        this.fullName = 'Super Energy Retrieval N1';
        this.name = 'Super Energy Retrieval';
        this.set = 'N1';
        this.setNumber = '89';
        this.text = 'Trade 2 of the other cards in your hand for 4 basic Energy cards from your discard pile. If you have fewer than 4 basic Energy cards there, take all of them.';
    }
}
exports.SuperEnergyRetrieval = SuperEnergyRetrieval;

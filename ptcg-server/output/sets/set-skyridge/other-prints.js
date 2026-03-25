"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FishermanSK = exports.CrystalShardSK = exports.ApricornMakerSK = void 0;
const apricorn_maker_1 = require("../set-celestial-storm/apricorn-maker");
const crystal_shard_1 = require("../set-ex-deoxys/crystal-shard");
const fisherman_1 = require("../set-celestial-storm/fisherman");
class ApricornMakerSK extends apricorn_maker_1.ApricornMaker {
    constructor() {
        super(...arguments);
        this.fullName = 'Apricorn Maker SK';
        this.set = 'SK';
        this.setNumber = '121';
        this.text = 'Search your deck for up to 2 Trainer cards with Ball in their names, show them to your opponent, and put them into your hand. Shuffle your deck afterward.';
    }
}
exports.ApricornMakerSK = ApricornMakerSK;
class CrystalShardSK extends crystal_shard_1.CrystalShard {
    constructor() {
        super(...arguments);
        this.fullName = 'Crystal Shard SK';
        this.set = 'SK';
        this.setNumber = '122';
        this.text = 'As long as this card is attached to a Pokémon, that Pokémon\'s type (color) is [C]. If that Pokémon attacks, discard this card at the end of the turn.';
    }
}
exports.CrystalShardSK = CrystalShardSK;
class FishermanSK extends fisherman_1.Fisherman {
    constructor() {
        super(...arguments);
        this.fullName = 'Fisherman SK';
        this.set = 'SK';
        this.setNumber = '125';
        this.text = 'Choose 4 basic Energy cards from your discard pile (if there are fewer basic Energy cards than choose, take all of them), show them to your opponent, and put them into your hand.';
    }
}
exports.FishermanSK = FishermanSK;

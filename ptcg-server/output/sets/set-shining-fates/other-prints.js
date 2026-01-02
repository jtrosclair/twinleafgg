"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrosmothSHF = exports.BirdKeeperSHF = void 0;
const bird_keeper_1 = require("../set-darkness-ablaze/bird-keeper");
const frosmoth_1 = require("../set-sword-and-shield/frosmoth");
class BirdKeeperSHF extends bird_keeper_1.BirdKeeper {
    constructor() {
        super(...arguments);
        this.fullName = 'Bird Keeper SHF';
        this.set = 'SHF';
        this.setNumber = '66';
    }
}
exports.BirdKeeperSHF = BirdKeeperSHF;
class FrosmothSHF extends frosmoth_1.Frosmoth {
    constructor() {
        super(...arguments);
        this.fullName = 'Frosmoth SHF';
        this.set = 'SHF';
        this.setNumber = '30';
    }
}
exports.FrosmothSHF = FrosmothSHF;

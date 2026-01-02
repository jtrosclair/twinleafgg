"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNeoRevelation = void 0;
const rockets_hideout_1 = require("./rockets-hideout");
const zubat_1 = require("./zubat");
const parasect_1 = require("./parasect");
// Other prints
const other_prints_1 = require("./other-prints");
exports.setNeoRevelation = [
    new rockets_hideout_1.RocketsHideout(),
    new zubat_1.Zubat(),
    new parasect_1.Parasect(),
    // Other prints
    new other_prints_1.BalloonBerryN3(),
];

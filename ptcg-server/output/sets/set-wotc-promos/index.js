"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWOTCPromos = void 0;
const computer_error_1 = require("./computer-error");
const mew_1 = require("./mew");
const mewtwo_1 = require("./mewtwo");
const snorlax_1 = require("./snorlax");
// Other prints
const other_prints_1 = require("./other-prints");
exports.setWOTCPromos = [
    new computer_error_1.ComputerError(),
    new mew_1.Mew(),
    new mewtwo_1.Mewtwo(),
    new snorlax_1.Snorlax(),
    // Other prints
    new other_prints_1.MewtwoPR(),
    new other_prints_1.PsyduckPR(),
];

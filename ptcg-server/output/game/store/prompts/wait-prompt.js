"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitPrompt = void 0;
const prompt_1 = require("./prompt");
class WaitPrompt extends prompt_1.Prompt {
    constructor(playerId, duration, message) {
        super(playerId);
        this.type = 'WaitPrompt';
        this.duration = duration;
        this.message = message;
    }
}
exports.WaitPrompt = WaitPrompt;

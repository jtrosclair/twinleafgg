"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowMulliganPrompt = void 0;
const prompt_1 = require("./prompt");
class ShowMulliganPrompt extends prompt_1.Prompt {
    constructor(playerId, message, hands, options) {
        super(playerId);
        this.message = message;
        this.type = 'Show mulligan';
        this.hands = hands;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: false
        }, options);
    }
}
exports.ShowMulliganPrompt = ShowMulliganPrompt;

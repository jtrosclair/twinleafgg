"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxModifyCardAction = exports.CardZone = void 0;
var CardZone;
(function (CardZone) {
    CardZone["HAND"] = "hand";
    CardZone["DECK"] = "deck";
    CardZone["DISCARD"] = "discard";
    CardZone["LOSTZONE"] = "lostzone";
    CardZone["PRIZES"] = "prizes";
    CardZone["STADIUM"] = "stadium";
    CardZone["SUPPORTER"] = "supporter";
})(CardZone = exports.CardZone || (exports.CardZone = {}));
class SandboxModifyCardAction {
    constructor(clientId, targetPlayerId, action, cardName, fromZone, toZone, fromIndex, toIndex, prizeIndex) {
        this.clientId = clientId;
        this.targetPlayerId = targetPlayerId;
        this.action = action;
        this.cardName = cardName;
        this.fromZone = fromZone;
        this.toZone = toZone;
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
        this.prizeIndex = prizeIndex;
        this.type = 'SANDBOX_MODIFY_CARD';
    }
}
exports.SandboxModifyCardAction = SandboxModifyCardAction;

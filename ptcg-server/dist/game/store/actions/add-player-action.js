"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPlayerAction = void 0;
class AddPlayerAction {
    constructor(clientId, name, deck, artworksMap, deckId, sleeveImagePath) {
        this.clientId = clientId;
        this.name = name;
        this.deck = deck;
        this.artworksMap = artworksMap;
        this.deckId = deckId;
        this.sleeveImagePath = sleeveImagePath;
        this.type = 'ADD_PLAYER';
    }
}
exports.AddPlayerAction = AddPlayerAction;

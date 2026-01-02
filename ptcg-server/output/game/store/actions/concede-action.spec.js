"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const concede_action_1 = require("./concede-action");
describe('ConcedeAction', () => {
    it('should create an instance', () => {
        const action = new concede_action_1.ConcedeAction(123);
        expect(action).toBeTruthy();
        expect(action.type).toBe('CONCEDE_GAME');
        expect(action.playerId).toBe(123);
    });
});

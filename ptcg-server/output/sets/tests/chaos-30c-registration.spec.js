"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Exercise the compiled production registry; source contains legacy JS siblings.
const sets = require('../../../output/sets');
const { CardManager } = require('../../../output/game/cards/card-manager');
describe('Chaos Rising and 30C production registration', () => {
    it('registers both target sets in the actual production startup', () => {
        const fs = require('fs');
        const path = require('path');
        const startup = fs.readFileSync(path.resolve(process.cwd(), 'start.js'), 'utf8');
        expect(startup).toMatch(/cardManager\.defineSet\(sets\.setChaosRising\)/);
        expect(startup).toMatch(/cardManager\.defineSet\(sets\.set30thCelebration\)/);
    });
    it('exports 30C through the production set registry', () => {
        const registry = sets;
        expect(Array.isArray(registry.set30thCelebration)).toBe(true);
        expect((registry.set30thCelebration || []).length).toBeGreaterThan(0);
    });
    it('loads every set without duplicate identities and resolves target cards', () => {
        const manager = new CardManager();
        const registry = sets;
        Object.keys(registry).forEach(key => manager.defineSet(registry[key]));
        expect(manager.getAllCards().some((card) => card.set === '30C')).toBe(true);
        for (const key of ['setChaosRising', 'set30thCelebration']) {
            for (const card of registry[key] || []) {
                const loaded = manager.getCardByName(card.fullName);
                expect(loaded).toBeDefined();
                expect(loaded && loaded.set).toBe(card.set);
                expect(loaded && loaded.setNumber).toBe(card.setNumber);
            }
        }
    });
});

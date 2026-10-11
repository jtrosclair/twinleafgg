"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
describe('30C English image cache', () => {
    const images = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../data/limitlesstcg-images.json'), 'utf8'));
    it('contains every numbered English card and Classic Collection image', () => {
        const keys = [];
        for (let number = 1; number <= 158; number++)
            keys.push('30C ' + number);
        for (let number = 1; number <= 30; number++)
            keys.push('30C CC' + number);
        for (const key of keys) {
            expect(images[key]).toBeDefined();
            expect(images[key] || '').toContain('/tpci/30C/');
            expect(images[key] || '').toMatch(/_EN\.png$/);
        }
    });
    it('resolves complete set-qualified image keys for every registered target print', () => {
        const sets = require('../../../output/sets');
        for (const card of [...sets.setChaosRising, ...sets.set30thCelebration]) {
            const key = card.usSetNumber || `${card.set} ${card.setNumber}`;
            expect(images[key]).toBeDefined();
        }
    });
    it('maps canonical 30C-era Energy and JP ex identities to verified English art', () => {
        const sets = require('../../../output/sets');
        const expected = {
            'Grass Energy M6a': 'MEE 9', 'Fire Energy M6a': 'MEE 10',
            'Water Energy M6a': 'MEE 11', 'Lightning Energy M6a': 'MEE 12',
            'Psychic Energy M6a': 'MEE 13', 'Fighting Energy M6a': 'MEE 14',
            'Darkness Energy M6a': 'MEE 15', 'Metal Energy M6a': 'MEE 16',
            'Mewtwo 30C': '30C 63', 'Mewtwo ex 30C': '30C 64', 'Mew ex 30C': '30C 66'
        };
        for (const fullName of Object.keys(expected)) {
            const card = sets.set30thCelebration.find((c) => c.fullName === fullName);
            expect(card).toBeDefined();
            expect(card && card.usSetNumber).toBe(expected[fullName]);
            expect(images[expected[fullName]]).toBeDefined();
        }
    });
});

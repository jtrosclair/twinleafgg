"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const card_manager_1 = require("../../game/cards/card-manager");
const expected = require('./english-print-manifest.json');
const bases = require('./english-alt-bases.json');
function additions() {
    return fs.existsSync(path.join(__dirname, 'english-prints.ts'))
        ? require('./english-prints').english30CPrints : [];
}
function normalizeName(name) {
    return name.replace(/-/g, ' ').replace(/\s+/g, '').toLowerCase();
}
describe('30C English print registry', () => {
    it('matches frozen provider effects, not just names, for each additive English print', () => {
        const cards = require('./index').set30thCelebration;
        const aliases = { G: 'Grass', R: 'Fire', W: 'Water', L: 'Lightning', P: 'Psychic', F: 'Fighting', D: 'Darkness', M: 'Metal', N: 'Dragon', C: 'Colorless' };
        const canonicalText = (text) => text
            .replace(/\[\s*([GRWLPFDMNC])\s*\]/g, (_, symbol) => aliases[symbol])
            .replace(/basic energies/gi, 'basic Energy cards')
            .replace('shuffles their hand into their deck. Then, your opponent draws', 'shuffles their hand into their deck and draws')
            .normalize('NFKD').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        for (const source of require('./english-source-text.json')) {
            const card = cards.find(c => c.set === '30C' && c.setNumber === source.number
                && normalizeName(source.number === 'CC12' ? c.name + ' LV.X' : c.name) === normalizeName(source.name));
            expect(card).toBeDefined(source.source);
            if (!card) {
                continue;
            }
            const powers = (card.powers || []).filter(p => !['LV.X Rule', 'BREAK Evolution Rule', 'Legend Assembly'].includes(p.name));
            const actual = source.number === 'CC3' ? [card.text]
                : [...powers.map(p => p.text), ...(card.attacks || []).map(a => a.text)];
            expect(actual.map(canonicalText)).toEqual(source.effects.map(canonicalText), source.source);
        }
    });
    it('resolves all 30 Classic English identities including the implemented composite LEGEND halves', () => {
        const cards = require('./index').set30thCelebration;
        const missing = [];
        expect(expected.classic.length).toBe(30);
        for (const print of expected.classic) {
            const card = cards.find(c => c.set === '30C' && c.setNumber === print.number);
            if (!card) {
                missing.push(print.number);
                continue;
            }
            const displayName = print.number === 'CC12' ? card.name + ' LV.X' : card.name;
            expect(normalizeName(displayName)).toBe(normalizeName(print.name));
            expect(card.usSetNumber).toBe('30C ' + print.number);
            expect(card.fullName).toContain('30C ' + print.number);
        }
        // Do not represent the pair as two independently playable Basic Pokémon.
        expect(missing).toEqual([]);
    });
    it('adds correct English Mewtwo ex and Mew ex without overwriting their M6a originals', () => {
        const cards = fs.existsSync(path.join(__dirname, 'english-ex-prints.ts'))
            ? require('./english-ex-prints').english30CExPrints : [];
        for (const [number, file, ctor, legacyNumber] of [['64', 'mewtwo-ex', 'Mewtwoex', '55'], ['66', 'mew-ex', 'Mewex', '57']]) {
            const base = new (require('./' + file)[ctor])();
            const card = cards.find(c => c.setNumber === number);
            expect(card).toBeDefined(number);
            if (!card) {
                continue;
            }
            expect([base.set, base.setNumber]).toEqual(['M6a', legacyNumber]);
            expect([card.set, card.usSetNumber]).toEqual(['30C', '30C ' + number]);
            expect(card.fullName).not.toBe(base.fullName);
            expect(card.reduceEffect).toBe(base.reduceEffect);
            expect(card.attacks).toEqual(base.attacks);
            expect(card.powers).toEqual(base.powers);
        }
    });
    it('resolves every English numbered print by number and name without losing unique identities', () => {
        const cards = require('./index').set30thCelebration;
        expect(expected.numbered.length).toBe(158);
        for (const print of expected.numbered) {
            const matches = cards.filter(c => c.set === '30C' && c.setNumber === print.number && normalizeName(c.name) === normalizeName(print.name));
            expect(matches.length).toBe(1, print.number + ' ' + print.name);
        }
        const manager = card_manager_1.CardManager.getInstance();
        manager.defineSet(cards);
        for (const card of cards) {
            const resolved = manager.getCardByName(card.fullName);
            expect([resolved.set, resolved.setNumber]).toEqual([card.set, card.setNumber]);
        }
        expect(new Set(cards.map(c => c.fullName)).size).toBe(cards.length);
    });
    it('includes the three source-verified RGB Mew prints with distinct English image identities', () => {
        const cards = fs.existsSync(path.join(__dirname, 'english-rgb-prints.ts'))
            ? require('./english-rgb-prints').english30CRgbPrints : [];
        const base = new (require('./mew').Mew)();
        for (const print of expected.rgb) {
            const card = cards.find(c => c.set === '30C' && c.setNumber === print.number);
            expect(card).toBeDefined(print.number);
            if (!card) {
                continue;
            }
            expect(card.name).toBe('Mew');
            expect(card.usSetNumber).toBe('30C ' + print.number);
            expect(card.attacks).toEqual(base.attacks);
            expect(card.reduceEffect).toBe(base.reduceEffect);
        }
    });
    it('adds Classic reprints only through the exact verified historical implementations', () => {
        const prints = fs.existsSync(path.join(__dirname, 'english-classic-prints.ts'))
            ? require('./english-classic-prints').english30CClassicPrints : [];
        for (const entry of require('./english-classic-bases.json')) {
            const card = prints.find(c => c.setNumber === entry.number);
            expect(card).toBeDefined(entry.number);
            if (!card) {
                continue;
            }
            const Base = require('../' + entry.file)[entry.constructor];
            const base = new Base();
            expect(card instanceof Base).toBe(true);
            expect(card.set).toBe('30C');
            expect(card.usSetNumber).toBe('30C ' + entry.number);
            expect(card.reduceEffect).toBe(base.reduceEffect);
            expect(card.attacks).toEqual(base.attacks);
            expect(card.powers).toEqual(base.powers);
            expect(normalizeName(card.name)).toBe(normalizeName(expected.classic.find((p) => p.number === entry.number).name));
        }
    });
    it('adds all 30 numbered alternate arts inheriting their text-matched executable base', () => {
        const prints = additions();
        for (const entry of bases) {
            const card = prints.find(c => c.setNumber === entry.number);
            expect(card).toBeDefined('English alternate ' + entry.number);
            if (!card) {
                continue;
            }
            const Base = require('./' + entry.file)[entry.constructor];
            const base = new Base();
            expect(card instanceof Base).toBe(true);
            expect(card.set).toBe('30C');
            expect(card.usSetNumber).toBe('30C ' + entry.number);
            expect(card.reduceEffect).toBe(base.reduceEffect);
            expect(card.attacks).toEqual(base.attacks);
            expect(card.powers).toEqual(base.powers);
            expect(card.hp).toBe(base.hp);
            expect(normalizeName(card.name)).toBe(normalizeName(expected.numbered.find((p) => p.number === entry.number).name));
        }
    });
});

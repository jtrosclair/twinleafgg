"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_types_1 = require("./card/card-types");
const state_utils_1 = require("./state-utils");
describe('StateUtils', () => {
    let fire;
    let fighting;
    let rainbow;
    function createEnergy(name, provides) {
        const card = { name, superType: card_types_1.SuperType.ENERGY, provides, blendedEnergies: [] };
        return { card, provides };
    }
    function createBlendEnergy(name, provides, blendedEnergies, blendedEnergyCount = 1) {
        const card = { name, superType: card_types_1.SuperType.ENERGY, provides, blendedEnergies, blendedEnergyCount };
        return { card, provides };
    }
    beforeEach(() => {
        fire = [card_types_1.CardType.FIRE];
        fighting = [card_types_1.CardType.FIGHTING];
        rainbow = [card_types_1.CardType.ANY];
    });
    it('Should return true, when provided the correct energy', () => {
        // given
        const cost = [card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('fire', fire)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return false when provided too few energy', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('fire', fire)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
    });
    it('Should return true when provided rainbow energy', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('fire', fire),
            createEnergy('rainbow', rainbow)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return true when provided Unit Energy FDY for Fighting and Fairy cost', () => {
        // given
        const cost = [card_types_1.CardType.FIGHTING, card_types_1.CardType.FAIRY];
        const energy = [
            createEnergy('fighting', fighting),
            createBlendEnergy('Unit Energy FDY', [card_types_1.CardType.COLORLESS], [card_types_1.CardType.FIGHTING, card_types_1.CardType.DARK, card_types_1.CardType.FAIRY])
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return true when provided with multiple blends that match out of order energy cost', () => {
        // given
        const cost = [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING];
        const energy = [
            createBlendEnergy('Unit Energy LPM', [card_types_1.CardType.COLORLESS], [card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL]),
            createBlendEnergy('Blend Energy WLFM', [card_types_1.CardType.COLORLESS], [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL]),
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return true when provided with multiple blends and a rainbow that match out of order energy cost', () => {
        // given
        const cost = [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.GRASS];
        const energy = [
            createBlendEnergy('Unit Energy LPM', [card_types_1.CardType.COLORLESS], [card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL]),
            createEnergy('rainbow', rainbow),
            createBlendEnergy('Blend Energy WLFM', [card_types_1.CardType.COLORLESS], [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL]),
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return true when provided with too much energy', () => {
        // given
        const cost = [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING];
        const energy = [
            createEnergy('fighting', fighting),
            createEnergy('fighting', fighting),
            createBlendEnergy('Unit Energy FDY', [card_types_1.CardType.COLORLESS], [card_types_1.CardType.FIGHTING, card_types_1.CardType.DARK, card_types_1.CardType.FAIRY])
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return true when provided with all rainbows', () => {
        // given
        const cost = [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING];
        const energy = [
            createEnergy('rainbow', rainbow),
            createEnergy('rainbow', rainbow),
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    // Multi-energy blend tests (Team Rocket's Energy style)
    describe('Multi-energy blend cards', () => {
        it('Should return true when Team Rockets Energy provides PP for Psychic Psychic cost', () => {
            const cost = [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC];
            const energy = [
                createBlendEnergy('Team Rockets Energy', [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK], 2)
            ];
            expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
        });
        it('Should return true when Team Rockets Energy provides DD for Dark Dark cost', () => {
            const cost = [card_types_1.CardType.DARK, card_types_1.CardType.DARK];
            const energy = [
                createBlendEnergy('Team Rockets Energy', [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK], 2)
            ];
            expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
        });
        it('Should return true when Team Rockets Energy provides PD for Psychic Dark cost', () => {
            const cost = [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK];
            const energy = [
                createBlendEnergy('Team Rockets Energy', [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK], 2)
            ];
            expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
        });
        it('Should return true when Team Rockets Energy provides for PDC cost with another energy', () => {
            const cost = [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS];
            const energy = [
                createBlendEnergy('Team Rockets Energy', [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK], 2),
                createEnergy('fire', fire)
            ];
            expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
        });
        it('Should return false when Team Rockets Energy cannot satisfy Water cost', () => {
            const cost = [card_types_1.CardType.WATER, card_types_1.CardType.DARK];
            const energy = [
                createBlendEnergy('Team Rockets Energy', [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK], 2)
            ];
            expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
        });
        it('Should return true when Team Rockets Energy provides colorless for CC cost', () => {
            const cost = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
            const energy = [
                createBlendEnergy('Team Rockets Energy', [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK], 2)
            ];
            expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
        });
    });
    describe('allEnergyProvidesIdentical', () => {
        const dark = [card_types_1.CardType.DARK];
        const fire = [card_types_1.CardType.FIRE];
        it('Should return true when all energy has same provides', () => {
            const energy = [
                createEnergy('dark1', dark),
                createEnergy('dark2', dark),
                createEnergy('dark3', dark)
            ];
            expect(state_utils_1.StateUtils.allEnergyProvidesIdentical(energy)).toBeTruthy();
        });
        it('Should return false when energy has different provides', () => {
            const energy = [
                createEnergy('dark', dark),
                createEnergy('fire', fire)
            ];
            expect(state_utils_1.StateUtils.allEnergyProvidesIdentical(energy)).toBeFalsy();
        });
        it('Should return true for single entry', () => {
            const energy = [createEnergy('dark', dark)];
            expect(state_utils_1.StateUtils.allEnergyProvidesIdentical(energy)).toBeTruthy();
        });
        it('Should return false for empty array', () => {
            expect(state_utils_1.StateUtils.allEnergyProvidesIdentical([])).toBeFalsy();
        });
    });
    describe('selectMinimalEnergyForCost', () => {
        const dark = [card_types_1.CardType.DARK];
        const colorless2 = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        it('Should return 1 entry when 3x dark for 1 colorless cost', () => {
            const energy = [
                createEnergy('dark1', dark),
                createEnergy('dark2', dark),
                createEnergy('dark3', dark)
            ];
            const cost = [card_types_1.CardType.COLORLESS];
            const result = state_utils_1.StateUtils.selectMinimalEnergyForCost(energy, cost);
            expect(result).not.toBeNull();
            expect(result.length).toBe(1);
            expect(state_utils_1.StateUtils.checkEnoughEnergy(result, cost)).toBeTruthy();
        });
        it('Should return 1 entry when 2x DCE for 2 colorless cost', () => {
            const energy = [
                createEnergy('dce1', colorless2),
                createEnergy('dce2', colorless2)
            ];
            const cost = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
            const result = state_utils_1.StateUtils.selectMinimalEnergyForCost(energy, cost);
            expect(result).not.toBeNull();
            expect(result.length).toBe(1);
            expect(state_utils_1.StateUtils.checkEnoughEnergy(result, cost)).toBeTruthy();
        });
        it('Should return null for insufficient energy', () => {
            const energy = [createEnergy('dark', dark)];
            const cost = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
            const result = state_utils_1.StateUtils.selectMinimalEnergyForCost(energy, cost);
            expect(result).toBeNull();
        });
    });
});

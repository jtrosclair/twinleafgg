"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseCardsPrompt = exports.ChooseCardsPromptType = void 0;
const card_types_1 = require("../card/card-types");
const prompt_1 = require("./prompt");
exports.ChooseCardsPromptType = 'Choose cards';
class ChooseCardsPrompt extends prompt_1.Prompt {
    constructor(player, message, cards, filter, options) {
        super(player.id);
        this.message = message;
        this.cards = cards;
        this.filter = filter;
        this.type = exports.ChooseCardsPromptType;
        this.blockedCardIds = [];
        this.player = player;
        // Default options
        this.options = Object.assign({}, {
            min: 0,
            max: cards.cards.length,
            allowCancel: true,
            blocked: [],
            isSecret: false,
            differentTypes: false,
            allowDifferentSuperTypes: true,
            maxPokemons: undefined,
            maxBasicEnergies: undefined,
            maxEnergies: undefined,
            maxTrainers: undefined,
            maxTools: undefined,
            maxStadiums: undefined,
            maxSupporters: undefined,
            maxSpecialEnergies: undefined,
            maxItems: undefined,
            maxBasics: undefined,
            maxEvolutions: undefined,
            maxStage1: undefined,
            maxStage2: undefined,
        }, options);
        if (this.options.blocked.length > 0) {
            for (let i = 0; i < this.cards.cards.length; i++) {
                if (this.options.blocked.indexOf(i) !== -1) {
                    if (this.blockedCardIds.indexOf(this.cards.cards[i].id) === -1) {
                        this.blockedCardIds.push(this.cards.cards[i].id);
                    }
                }
            }
        }
        if (!this.options.isSecret) {
            if (this.cards === this.player.deck || this.cards === this.player.discard) {
                this.cards.sort();
            }
        }
        if (this.options.blocked.length > 0) {
            this.options.blocked = [];
            this.cards.cards.forEach((card, index) => {
                if (this.blockedCardIds.indexOf(card.id) !== -1) {
                    this.options.blocked.push(index);
                }
            });
        }
    }
    decode(result) {
        if (result === null) {
            return null;
        }
        const cards = this.cards.cards;
        return result.map(index => cards[index]);
    }
    validate(result) {
        if (result === null) {
            return this.options.allowCancel;
        }
        if (result.length < this.options.min || result.length > this.options.max) {
            return false;
        }
        if (!this.options.allowDifferentSuperTypes) {
            const set = new Set(result.map(r => r.superType));
            if (set.size > 1) {
                return false;
            }
        }
        // Check if 'different types' restriction is valid
        if (this.options.differentTypes) {
            const typeMap = {};
            for (const card of result) {
                const cardType = ChooseCardsPrompt.getCardType(card);
                if (typeMap[cardType] === true) {
                    return false;
                }
                else {
                    typeMap[cardType] = true;
                }
            }
        }
        // Check if 'max' restrictions are valid
        const countMap = {};
        for (const card of result) {
            const count = countMap[card.superType.toString()] || 0;
            countMap[card.superType.toString()] = count + 1;
            if (card.superType === card_types_1.SuperType.TRAINER) {
                const trainerTypeCount = countMap[`${card.superType}-${card.trainerType}`] || 0;
                countMap[`${card.superType}-${card.trainerType}`] = trainerTypeCount + 1;
            }
            if (card.superType === card_types_1.SuperType.ENERGY) {
                const energyTypeCount = countMap[`${card.superType}-${card.energyType}`] || 0;
                countMap[`${card.superType}-${card.energyType}`] = energyTypeCount + 1;
            }
            if (card.superType === card_types_1.SuperType.POKEMON) {
                const pokemonCard = card;
                const stageCount = countMap[`${card.superType}-${pokemonCard.stage}`] || 0;
                countMap[`${card.superType}-${pokemonCard.stage}`] = stageCount + 1;
            }
        }
        const { maxPokemons, maxBasicEnergies, maxTrainers, maxItems, maxTools, maxStadiums, maxSupporters, maxSpecialEnergies, maxEnergies, maxBasics, maxEvolutions, maxStage1, maxStage2 } = this.options;
        // Check if we have both basics and evolutions selected - only if maxBasics or maxEvolutions is defined
        // AND maxStage1/maxStage2 are NOT defined (old pattern where we select EITHER basics OR evolutions)
        if ((maxBasics !== undefined || maxEvolutions !== undefined) && maxStage1 === undefined && maxStage2 === undefined) {
            const hasBasics = countMap[`${card_types_1.SuperType.POKEMON}-${card_types_1.Stage.BASIC}`] > 0;
            const hasEvolutions = countMap[`${card_types_1.SuperType.POKEMON}`] - (countMap[`${card_types_1.SuperType.POKEMON}-${card_types_1.Stage.BASIC}`] || 0) > 0;
            if (hasBasics && hasEvolutions) {
                return false;
            }
        }
        if ((maxPokemons !== undefined && maxPokemons < countMap[`${card_types_1.SuperType.POKEMON}`])
            || (maxBasicEnergies !== undefined && maxBasicEnergies < countMap[`${card_types_1.SuperType.ENERGY}-${card_types_1.EnergyType.BASIC}`])
            || (maxEnergies !== undefined && maxEnergies < countMap[`${card_types_1.SuperType.ENERGY}`])
            || (maxTrainers !== undefined && maxTrainers < countMap[`${card_types_1.SuperType.TRAINER}`])
            || (maxItems !== undefined && maxItems < countMap[`${card_types_1.SuperType.TRAINER}-${card_types_1.TrainerType.ITEM}`])
            || (maxStadiums !== undefined && maxStadiums < countMap[`${card_types_1.SuperType.TRAINER}-${card_types_1.TrainerType.STADIUM}`])
            || (maxSupporters !== undefined && maxSupporters < countMap[`${card_types_1.SuperType.TRAINER}-${card_types_1.TrainerType.SUPPORTER}`])
            || (maxSpecialEnergies !== undefined && maxSpecialEnergies < countMap[`${card_types_1.SuperType.ENERGY}-${card_types_1.EnergyType.SPECIAL}`])
            || (maxTools !== undefined && maxTools < countMap[`${card_types_1.SuperType.TRAINER}-${card_types_1.TrainerType.TOOL}`])
            || (maxBasics !== undefined && maxBasics < countMap[`${card_types_1.SuperType.POKEMON}-${card_types_1.Stage.BASIC}`])
            || (maxEvolutions !== undefined && maxEvolutions < (countMap[`${card_types_1.SuperType.POKEMON}`] - (countMap[`${card_types_1.SuperType.POKEMON}-${card_types_1.Stage.BASIC}`] || 0)))
            || (maxStage1 !== undefined && maxStage1 < (countMap[`${card_types_1.SuperType.POKEMON}-${card_types_1.Stage.STAGE_1}`] || 0))
            || (maxStage2 !== undefined && maxStage2 < (countMap[`${card_types_1.SuperType.POKEMON}-${card_types_1.Stage.STAGE_2}`] || 0))) {
            return false;
        }
        const blocked = this.options.blocked;
        return result.every(r => {
            const index = this.cards.cards.indexOf(r);
            return index !== -1 && !blocked.includes(index) && this.matchesFilter(r);
        });
    }
    static getCardType(card) {
        if (card.superType === card_types_1.SuperType.ENERGY) {
            const energyCard = card;
            return energyCard.provides.length > 0 ? energyCard.provides[0] : card_types_1.CardType.NONE;
        }
        if (card.superType === card_types_1.SuperType.POKEMON) {
            const pokemonCard = card;
            return pokemonCard.cardType;
        }
        return card_types_1.CardType.NONE;
    }
    matchesFilter(card) {
        for (const key in this.filter) {
            if (Object.prototype.hasOwnProperty.call(this.filter, key)) {
                if (this.filter[key] !== card[key]) {
                    return false;
                }
            }
        }
        return true;
    }
}
exports.ChooseCardsPrompt = ChooseCardsPrompt;

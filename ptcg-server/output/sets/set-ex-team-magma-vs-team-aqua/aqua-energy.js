"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AquaEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class AquaEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Aqua Energy';
        this.fullName = 'Aqua Energy MA';
        this.text = 'Aqua Energy can be attached only to a Pokémon with Team Aqua in its name. Aqua Energy provides [W] and [D] Energy but provides 2 Energy at a time. (Doesn\'t count as a basic Energy card when not in play and has no other effect than providing Energy.) At the end of your turn, discard Aqua Energy.';
    }
    getExistingEnergy(source) {
        return source.cards
            .filter((card) => card.superType === card_types_1.SuperType.ENERGY && card !== this)
            .map((card) => ({
            card: card,
            provides: card.provides
        }));
    }
    countEnergyType(energy, type) {
        return energy.reduce((count, e) => {
            return count + e.provides.filter(p => p === type).length;
        }, 0);
    }
    getEnergyToProvide(attackCost, existingEnergy) {
        const needsWater = attackCost.includes(card_types_1.CardType.WATER);
        const needsDark = attackCost.includes(card_types_1.CardType.DARK);
        if (!needsWater && !needsDark) {
            return [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        }
        const waterCount = this.countEnergyType(existingEnergy, card_types_1.CardType.WATER);
        const darkCount = this.countEnergyType(existingEnergy, card_types_1.CardType.DARK);
        const requiredWater = attackCost.filter(c => c === card_types_1.CardType.WATER).length;
        const requiredDark = attackCost.filter(c => c === card_types_1.CardType.DARK).length;
        const hasEnoughWater = !needsWater || waterCount >= requiredWater;
        const hasEnoughDark = !needsDark || darkCount >= requiredDark;
        if (hasEnoughWater && hasEnoughDark) {
            return [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        }
        if (needsWater && needsDark) {
            if (!hasEnoughWater && !hasEnoughDark) {
                return [card_types_1.CardType.WATER, card_types_1.CardType.DARK];
            }
            if (!hasEnoughWater) {
                return [card_types_1.CardType.WATER, card_types_1.CardType.WATER];
            }
            return [card_types_1.CardType.DARK, card_types_1.CardType.DARK];
        }
        if (needsWater && !hasEnoughWater) {
            return [card_types_1.CardType.WATER, card_types_1.CardType.WATER];
        }
        if (needsDark && !hasEnoughDark) {
            return [card_types_1.CardType.DARK, card_types_1.CardType.DARK];
        }
        return [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        // Prevent attaching to non Team Rocket's Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            if (effect.energyCard === this && !((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.TEAM_AQUA))) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Discard card when not attached to Team Rocket's Pokemon
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this) || (0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, cardList)) {
                        return;
                    }
                    const pokemonCard = cardList.getPokemonCard();
                    if (pokemonCard && !pokemonCard.tags.includes(card_types_1.CardTag.TEAM_AQUA)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        // Discard card at the end of the turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                }
            });
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(effect.player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_c) {
                return state;
            }
            const pokemonCard = effect.source.getPokemonCard();
            if (!pokemonCard || !(pokemonCard instanceof pokemon_card_1.PokemonCard)) {
                return state;
            }
            const attackCost = ((_b = pokemonCard.attacks[0]) === null || _b === void 0 ? void 0 : _b.cost) || [];
            const existingEnergy = this.getExistingEnergy(effect.source);
            const energyToProvide = this.getEnergyToProvide(attackCost, existingEnergy);
            effect.energyMap.push({
                card: this,
                provides: energyToProvide
            });
        }
        return state;
    }
}
exports.AquaEnergy = AquaEnergy;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '182';
        this.name = 'Team Rocket\'s Energy';
        this.fullName = 'Team Rocket\'s Energy DRI';
        this.text = `This card can only be attached to a Team Rocket's Pokémon. If this card is attached to anything other than a Team Rocket's Pokémon, discard this card.
  
  While this card is attached to a Pokémon, this card provides 2 in any combination of [P] and [D] Energy`;
    }
    getExistingEnergy(source) {
        return source.cards
            .filter((card) => card instanceof energy_card_1.EnergyCard && card !== this)
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
        const needsPsychic = attackCost.includes(card_types_1.CardType.PSYCHIC);
        const needsDark = attackCost.includes(card_types_1.CardType.DARK);
        if (!needsPsychic && !needsDark) {
            return [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        }
        const psychicCount = this.countEnergyType(existingEnergy, card_types_1.CardType.PSYCHIC);
        const darkCount = this.countEnergyType(existingEnergy, card_types_1.CardType.DARK);
        const requiredPsychic = attackCost.filter(c => c === card_types_1.CardType.PSYCHIC).length;
        const requiredDark = attackCost.filter(c => c === card_types_1.CardType.DARK).length;
        const hasEnoughPsychic = !needsPsychic || psychicCount >= requiredPsychic;
        const hasEnoughDark = !needsDark || darkCount >= requiredDark;
        if (hasEnoughPsychic && hasEnoughDark) {
            return [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        }
        if (needsPsychic && needsDark) {
            if (!hasEnoughPsychic && !hasEnoughDark) {
                return [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK];
            }
            if (!hasEnoughPsychic) {
                return [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC];
            }
            return [card_types_1.CardType.DARK, card_types_1.CardType.DARK];
        }
        if (needsPsychic && !hasEnoughPsychic) {
            return [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC];
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
            if (effect.energyCard === this && !((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.TEAM_ROCKET))) {
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
                    if (pokemonCard && !pokemonCard.tags.includes(card_types_1.CardTag.TEAM_ROCKET)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
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
exports.TeamRocketsEnergy = TeamRocketsEnergy;

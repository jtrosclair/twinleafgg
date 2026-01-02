"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpiralEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SpiralEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.regulationMark = 'E';
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '159';
        this.name = 'Spiral Energy';
        this.fullName = 'Spiral Energy CRE';
        this.text = 'This card can only be attached to a Rapid Strike Pokémon. If this card is attached to anything other than a Rapid Strike Pokémon, discard this card.' +
            '\n\n' +
            'As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time. The Pokémon this card is attached to can\'t be Paralyzed, and if it is already Paralyzed, it recovers from that Special Condition.';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        // Provide energy when attached to Single Strike Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const pokemon = effect.source;
            if ((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.RAPID_STRIKE)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
            }
            return state;
        }
        // Prevent attaching to non Rapid Strike Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            if (effect.energyCard === this && !((_b = effect.target.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.RAPID_STRIKE))) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Heal Paralysis, discard card when not attached to Rapid Strike Pokemon
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    var _a;
                    if (!cardList.cards.includes(this) || prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
                        return;
                    }
                    // Remove Paralysis before discarding as per ruling
                    cardList.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
                    if (!((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.RAPID_STRIKE))) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        // Prevent Paralysis
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect || effect instanceof check_effects_1.AddSpecialConditionsPowerEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (!effect.target.cards.includes(this) || prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, effect.target)) {
                return state;
            }
            effect.specialConditions = effect.specialConditions.filter(condition => condition !== card_types_1.SpecialCondition.PARALYZED);
        }
        return state;
    }
}
exports.SpiralEnergy = SpiralEnergy;

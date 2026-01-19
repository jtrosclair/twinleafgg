"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleStrikeEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class SingleStrikeEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'E';
        this.set = 'BST';
        this.setNumber = '141';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Single Strike Energy';
        this.fullName = 'Single Strike Energy BST';
        this.text = `This card can only be attached to a Single Strike Pokémon. If this card is attached to anything other than a Single Strike Pokémon, discard this card.

As long as this card is attached to a Pokémon, it provides [F] and [D] Energy but provides only 1 Energy at a time, and the attacks of the Pokémon this card is attached to do 20 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).`;
        this.blendedEnergies = [card_types_1.CardType.FIGHTING, card_types_1.CardType.DARK];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(effect.player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            // Find the first energy type that's not already provided by other energies
            const neededType = this.blendedEnergies.find(type => !effect.energyMap.some(energy => energy.provides.includes(type)));
            if (neededType) {
                // Only provide the specific energy type that's needed
                effect.energyMap.push({
                    card: this,
                    provides: [neededType]
                });
            }
        }
        // Discard card when not attached to Single Strike Pokemon
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    var _a;
                    if (!cardList.cards.includes(this) || (0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, cardList)) {
                        return;
                    }
                    if (!((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.SINGLE_STRIKE))) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        // Deal +20 damage
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (effect.target !== opponent.active || (0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, effect.source)) {
                return state;
            }
            effect.damage += 20;
        }
        return state;
    }
}
exports.SingleStrikeEnergy = SingleStrikeEnergy;

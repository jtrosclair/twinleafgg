"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WonderEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class WonderEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.name = 'Wonder Energy';
        this.fullName = 'Wonder Energy PRC';
        this.text = 'This card can only be attached to [Y] Pokémon. This card provides [Y] Energy only while this card is attached to a [Y] Pokémon.' +
            '\n\n' +
            'Prevent all effects of your opponent\'s attacks, except damage, done to the [Y] Pokémon that this card is attached to. (Existing effects are not removed.)' +
            '\n\n' +
            '(If this card is attached to anything other than a [Y] Pokémon, discard this card.)';
    }
    reduceEffect(store, state, effect) {
        // Provide energy when attached to Fairy Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.FAIRY)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.FAIRY] });
            }
        }
        // Prevent attaching to non Fairy Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.FAIRY)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Discard card when not attached to Fairy Pokemon
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this) || (0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, cardList)) {
                        return;
                    }
                    const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                    store.reduceEffect(state, checkPokemonType);
                    if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.FAIRY)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        // Prevent effects of attacks
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, effect.opponent, this, effect.target)) {
                return state;
            }
            if (sourceCard) {
                // Allow Weakness & Resistance
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.WonderEnergy = WonderEnergy;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HerbalEnergy = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HerbalEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'FFI';
        this.name = 'Herbal Energy';
        this.fullName = 'Herbal Energy FFI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.text = 'This card can only be attached to [G] Pokémon. This card provides [G] Energy only while this card is attached to a [G] Pokémon.' +
            '\n\n' +
            'When you attach this card from your hand to 1 of your[G] Pokémon, heal 30 damage from that Pokémon.' +
            '\n\n' +
            '(If this card is attached to anything other than a [G] Pokémon, discard this card.)';
    }
    reduceEffect(store, state, effect) {
        // Provide energy when attached to Grass Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.GRASS)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.GRASS] });
            }
        }
        // Prevent attaching to non Grass Pokemon, heal 30 damage from Grass Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.GRASS)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
                return state;
            }
            const healEffect = new game_effects_1.HealEffect(effect.player, effect.target, 30);
            store.reduceEffect(state, healEffect);
        }
        // Discard card when not attached to Grass Pokemon
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this) || prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
                        return;
                    }
                    const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                    store.reduceEffect(state, checkPokemonType);
                    if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.GRASS)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        return state;
    }
}
exports.HerbalEnergy = HerbalEnergy;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleDragonEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DoubleDragonEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'ROS';
        this.name = 'Double Dragon Energy';
        this.fullName = 'Double Dragon Energy ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.text = 'This card can only be attached to [N] Pokémon.' +
            '\n\n' +
            'This card provides every type of Energy, but provides only 2 Energy at a time, only while this card is attached to a [N] Pokémon.' +
            '\n\n' +
            '(If this card is attached to anything other than a [N] Pokémon, discard this card.)';
    }
    reduceEffect(store, state, effect) {
        // Provide energy when attached to Dragon Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.DRAGON)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY, card_types_1.CardType.ANY] });
            }
        }
        // Prevent attaching to non Dragon Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.DRAGON)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Discard card when not attached to Dragon Pokemon
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this) || (0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, cardList)) {
                        return;
                    }
                    const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                    store.reduceEffect(state, checkPokemonType);
                    if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.DRAGON)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        return state;
    }
}
exports.DoubleDragonEnergy = DoubleDragonEnergy;

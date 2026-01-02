"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrambleEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const check_effects_2 = require("../../game/store/effects/check-effects");
class ScrambleEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Scramble Energy';
        this.fullName = 'Scramble Energy DX';
        this.text = 'Scramble Energy can be attached only to an Evolved Pokémon (excluding Pokémon-ex). Scramble Energy provides [C] Energy. While in play, if you have more Prize cards left than your opponent, Scramble Energy provides every type of Energy but provides only 3 in any combination at a time. If the Pokémon Scramble Energy is attached to isn\'t an Evolved Pokémon (or evolves into Pokémon-ex), discard Scramble Energy.';
    }
    reduceEffect(store, state, effect) {
        // Provide energy 
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const provides = player.getPrizeLeft() > opponent.getPrizeLeft()
                ? [card_types_1.CardType.ANY, card_types_1.CardType.ANY, card_types_1.CardType.ANY]
                : [card_types_1.CardType.COLORLESS];
            effect.energyMap.push({ card: this, provides });
            return state;
        }
        // Discard card when not attached to Evolved Pokemon or pokemon-ex
        if (effect instanceof check_effects_2.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const attachedTo = cardList.getPokemonCard();
                    if (!!attachedTo && (attachedTo.tags.includes(card_types_1.CardTag.POKEMON_ex) || cardList.getPokemons().length < 2)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
            return state;
        }
        return state;
    }
}
exports.ScrambleEnergy = ScrambleEnergy;

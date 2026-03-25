"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.blendedEnergies = [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK];
        this.blendedEnergyCount = 2;
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
    reduceEffect(store, state, effect) {
        var _a;
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
            catch (_b) {
                return state;
            }
            effect.energyMap.push({
                card: this,
                provides: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS]
            });
        }
        return state;
    }
}
exports.TeamRocketsEnergy = TeamRocketsEnergy;

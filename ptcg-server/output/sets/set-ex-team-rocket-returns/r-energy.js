"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class REnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'R Energy';
        this.fullName = 'R Energy TRR';
        this.text = 'R Energy can be attached only to a Pokémon that has Dark or Rocket\'s in its name. While in play, R Energy provides 2 [D] Energy. (Doesn\'t count as a basic Energy card.) If the Pokémon R Energy is attached to attacks, the attack does 10 more damage to the Active Pokémon (before applying Weakness and Resistance). When your turn ends, discard R Energy.';
        this.R_MARKER = 'R_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            if (!((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.DARK)) &&
                !((_b = effect.target.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.ROCKETS))) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            prefabs_1.ADD_MARKER(this.R_MARKER, effect.player, this);
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const attachedTo = effect.source.getPokemonCard();
            if (!!attachedTo && attachedTo instanceof pokemon_card_1.PokemonCard) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.DARK, card_types_1.CardType.DARK] });
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.marker.hasMarker(this.R_MARKER, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                    prefabs_1.REMOVE_MARKER(this.R_MARKER, effect.player, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            if (effect.source.cards.includes(this)) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                if (effect.target !== opponent.active) {
                    return state;
                }
                effect.damage += 10;
            }
        }
        return state;
    }
}
exports.REnergy = REnergy;

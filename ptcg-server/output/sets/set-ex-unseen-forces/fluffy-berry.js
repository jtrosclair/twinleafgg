"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluffyBerry = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class FluffyBerry extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'UF';
        this.name = 'Fluffy Berry';
        this.fullName = 'Fluffy Berry UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.text = 'As long as Fluffy Berry is attached to a Pokémon, that Pokémon\'s Retreat Cost is 0.';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tools.includes(this)) {
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            if (index !== -1) {
                effect.cost.splice(index, 99);
            }
        }
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.trainerCard == this) {
            if (((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) || ((_b = effect.target.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.DARK))) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const attachedTo = cardList.getPokemonCard();
                    if (!!attachedTo && (attachedTo.tags.includes(card_types_1.CardTag.POKEMON_ex) || attachedTo.tags.includes(card_types_1.CardTag.DARK))) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        return state;
    }
}
exports.FluffyBerry = FluffyBerry;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcerolasMischief = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AcerolasMischief extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MEG';
        this.setNumber = '113';
        this.regulationMark = 'I';
        this.name = 'Acerola\'s Mischief';
        this.fullName = 'Acerola\'s Mischief M1S';
        this.text = 'You can use this card only if your opponent has 2 or fewer Prize cards remaining. ' +
            'Choose 1 of your Pokémon in play. During your opponent\'s next turn, prevent all damage ' +
            'from and effects of attacks done to that Pokémon by your opponent\'s Pokémon ex.';
    }
    canPlay(store, state, player) {
        if (player.supporterTurn > 0) {
            return false;
        }
        const opponent = game_1.StateUtils.getOpponent(state, player);
        return opponent.getPrizeLeft() <= 2;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.getPrizeLeft() > 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const target = targets[0];
                (0, prefabs_1.ADD_MARKER)(marker_constants_1.MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, target, this);
                (0, prefabs_1.ADD_MARKER)(marker_constants_1.MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, opponent, this);
            });
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect) {
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_ex)
                && effect.target.marker.hasMarker(marker_constants_1.MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        (0, prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN)(state, effect, marker_constants_1.MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, marker_constants_1.MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        return state;
    }
}
exports.AcerolasMischief = AcerolasMischief;

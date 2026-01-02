"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Galvantula = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Galvantula extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Joltik';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Unnerve',
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever your opponent plays an Item or Supporter card from their hand, prevent all effects of that card done to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Spider Thread',
                cost: [L],
                damage: 40,
                text: 'Put a card from your discard pile into your hand.'
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Galvantula';
        this.fullName = 'Galvantula TEU';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Unnerve
        if (effect instanceof play_card_effects_1.TrainerTargetEffect && ((_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards.includes(this))) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            // finding if the owner of the card is playing the trainer or if the opponent is
            let isGalvantulaOnOpponentsSide = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    isGalvantulaOnOpponentsSide = true;
                }
            });
            if (!isGalvantulaOnOpponentsSide) {
                return state;
            }
            effect.target = undefined;
        }
        // Spider Thread
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const hasCardInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.Card;
            });
            if (!hasCardInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                player.discard.moveCardsTo(cards, player.hand);
            });
        }
        return state;
    }
}
exports.Galvantula = Galvantula;

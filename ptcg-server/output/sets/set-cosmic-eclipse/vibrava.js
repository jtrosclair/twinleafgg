"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vibrava = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vibrava extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Trapinch';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Obnoxious Whirring',
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Flap',
                cost: [F, C],
                damage: 40,
                text: ''
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Vibrava';
        this.fullName = 'Vibrava CEC';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Snow Cover
        if (effect instanceof play_card_effects_1.TrainerTargetEffect && ((_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards.includes(this))) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            if (effect.trainerCard.trainerType !== game_1.TrainerType.SUPPORTER) {
                return state;
            }
            // finding if the owner of the card is playing the trainer or if the opponent is
            let isVibravaOnOpponentsSide = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    isVibravaOnOpponentsSide = true;
                }
            });
            if (!isVibravaOnOpponentsSide) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Vibrava = Vibrava;

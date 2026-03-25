"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Landorus = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Landorus extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rock Tumble',
                cost: [F, F],
                damage: 50,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            },
            {
                name: 'Screw Knuckle',
                cost: [F, F, C],
                damage: 120,
                text: 'Return an Energy card attached to this Pokemon to your hand.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Landorus';
        this.fullName = 'Landorus M3';
    }
    reduceEffect(store, state, effect) {
        // Rock Tumble - ignore resistance
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.ignoreResistance = true;
        }
        // Screw Knuckle - return energy to hand
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this) && effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            const energiesAttached = player.active.cards.filter(card => card.superType === game_1.SuperType.ENERGY);
            if (energiesAttached.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.active, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    const energyToReturn = cards[0];
                    store.log(state, game_1.GameLog.LOG_PLAYER_RETURNS_CARD_TO_HAND, {
                        name: player.name,
                        card: energyToReturn.name
                    });
                    player.active.moveCardTo(energyToReturn, player.hand);
                }
            });
        }
        return state;
    }
}
exports.Landorus = Landorus;

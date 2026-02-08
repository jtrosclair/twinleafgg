"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mawile = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mawile extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Double Eater',
                cost: [P, C],
                damage: 0,
                damageCalculation: 'x',
                text: 'Discard up to 2 Energy cards from your hand. This attack does 60 damage for each card discarded in this way.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Mawile';
        this.fullName = 'Mawile M3';
    }
    reduceEffect(store, state, effect) {
        // Double Eater - discard energy from hand for damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const energiesInHand = player.hand.cards.filter(card => card instanceof game_1.EnergyCard && card.superType === game_1.SuperType.ENERGY);
            if (energiesInHand.length === 0) {
                effect.damage = 0;
                return state;
            }
            const maxToDiscard = Math.min(2, energiesInHand.length);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: maxToDiscard }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    const discardEffect = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEffect.target = player.active;
                    store.reduceEffect(state, discardEffect);
                    player.hand.moveCardsTo(cards, player.discard);
                }
                effect.damage = cards.length * 60;
            });
        }
        return state;
    }
}
exports.Mawile = Mawile;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voltorb = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const energy_card_1 = require("../../game/store/card/energy-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Voltorb extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 40;
        this.cardType = L;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Recharge',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a [L] Energy card and attach it to Voltorb. Shuffle your deck afterward.'
            },
            {
                name: 'Rolling Attack',
                cost: [L, C],
                damage: 20,
                text: ''
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Voltorb';
        this.fullName = 'Voltorb HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.deck.cards.forEach((c, i) => {
                if (!(c instanceof energy_card_1.EnergyCard))
                    blocked.push(i);
                else if (c.energyType !== card_types_1.EnergyType.BASIC)
                    blocked.push(i);
                else if (!c.provides.includes(card_types_1.CardType.LIGHTNING))
                    blocked.push(i);
            });
            const hasBasicLightning = player.deck.cards.some(c => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.LIGHTNING));
            if (!hasBasicLightning) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    player.deck.moveCardTo(cards[0], player.active);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.Voltorb = Voltorb;

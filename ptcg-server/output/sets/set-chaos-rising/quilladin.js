"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quilladin = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const energy_card_1 = require("../../game/store/card/energy-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Quilladin extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chespin';
        this.hp = 100;
        this.cardType = G;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Leaf Charge',
                cost: [G],
                damage: 20,
                text: 'Search your deck for 1 Basic [G] Energy and attach it to this Pokemon. Then, shuffle your deck.'
            },
            {
                name: 'Vine Whip',
                cost: [G, G, C],
                damage: 80,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Quilladin';
        this.fullName = 'Quilladin M4';
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
                else if (!c.provides.includes(G))
                    blocked.push(i);
            });
            const hasBasicG = player.deck.cards.some(c => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(G));
            if (!hasBasicG) {
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
exports.Quilladin = Quilladin;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snorlax = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Snorlax extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 160;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Big Eater',
                cost: [C],
                damage: 0,
                text: 'Flip a coin until you get tails. For each heads, you may search your deck for a Basic Energy and attach it to this Pokemon. Then, shuffle your deck.'
            },
            {
                name: 'Collapse',
                cost: [C, C, C, C],
                damage: 160,
                text: 'This Pokemon is now Asleep.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Snorlax';
        this.fullName = 'Snorlax M3';
    }
    reduceEffect(store, state, effect) {
        // Big Eater - flip coins until tails, search for Basic Energy for each heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const stateForCallback = state;
            return (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, player, headsCount => {
                if (headsCount === 0 || player.deck.cards.length === 0) {
                    store.prompt(stateForCallback, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                    return;
                }
                const basicEnergyInDeck = player.deck.cards.filter(card => card.superType === game_1.SuperType.ENERGY && card.energyType === game_1.EnergyType.BASIC);
                if (basicEnergyInDeck.length === 0) {
                    store.prompt(stateForCallback, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                    return;
                }
                const maxToAttach = Math.min(headsCount, basicEnergyInDeck.length);
                store.prompt(stateForCallback, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { min: 0, max: maxToAttach, allowCancel: false }), selected => {
                    const cards = selected || [];
                    if (cards.length > 0) {
                        for (const card of cards) {
                            player.deck.moveCardTo(card, player.active);
                        }
                    }
                    store.prompt(stateForCallback, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            });
        }
        // Collapse - Pokemon becomes Asleep
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.addSpecialCondition(game_1.SpecialCondition.ASLEEP);
        }
        return state;
    }
}
exports.Snorlax = Snorlax;

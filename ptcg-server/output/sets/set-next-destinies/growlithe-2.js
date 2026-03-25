"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Growlithe2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Growlithe2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Stoke',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, search your deck for a [R] Energy card and attach it to this Pokémon. Shuffle your deck afterward.'
            },
            {
                name: 'Firebreathing',
                cost: [R, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '10';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Growlithe';
        this.fullName = 'Growlithe NXD 10';
    }
    reduceEffect(store, state, effect) {
        // Stoke
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    if (player.deck.cards.length === 0) {
                        return;
                    }
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, {
                        superType: card_types_1.SuperType.ENERGY,
                        energyType: card_types_1.EnergyType.BASIC,
                        provides: [card_types_1.CardType.FIRE]
                    }, { min: 0, max: 1, allowCancel: false }), selected => {
                        selected.forEach(card => {
                            player.deck.moveCardTo(card, player.active);
                        });
                        store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    });
                }
            });
        }
        // Firebreathing
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 20;
                }
            });
        }
        return state;
    }
}
exports.Growlithe2 = Growlithe2;

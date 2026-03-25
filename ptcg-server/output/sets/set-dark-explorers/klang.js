"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Klang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Klink';
        this.cardType = M;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Charge Beam',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, attach an Energy card from your discard pile to this Pokémon.'
            },
            {
                name: 'Vice Grip',
                cost: [M, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '76';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Klang';
        this.fullName = 'Klang DEX';
    }
    reduceEffect(store, state, effect) {
        // Charge Beam - flip a coin, if heads attach energy from discard
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergy = player.discard.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            if (hasEnergy) {
                (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                    if (result) {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false }), cards => {
                            cards = cards || [];
                            if (cards.length > 0) {
                                player.discard.moveCardsTo(cards, player.active);
                            }
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.Klang = Klang;

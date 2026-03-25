"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pachirisu = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Pachirisu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Minor Errand-Running',
                cost: [C],
                damage: 0,
                text: 'Search your deck for 2 basic Energy cards, reveal them, and put them into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Electric Tail',
                cost: [L],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pachirisu';
        this.fullName = 'Pachirisu PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.BASIC)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 2, allowCancel: true, blocked }, this.attacks[0]);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Pachirisu = Pachirisu;

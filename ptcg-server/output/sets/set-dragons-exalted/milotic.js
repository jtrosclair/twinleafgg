"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Milotic = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Milotic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Feebas';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Clear Search',
                cost: [W],
                damage: 0,
                text: 'Search your deck for any 3 cards and put them into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Water Pulse',
                cost: [W, C, C],
                damage: 60,
                text: 'The Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '28';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Milotic';
        this.fullName = 'Milotic DRX';
    }
    reduceEffect(store, state, effect) {
        // Clear Search - search deck for any 3 cards
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, {}, { min: 0, max: 3, allowCancel: true }, this.attacks[0]);
        }
        // Water Pulse - Asleep
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Milotic = Milotic;

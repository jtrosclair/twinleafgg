"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Treecko = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Treecko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.evolvesInto = 'Grovyle';
        this.attacks = [{
                name: 'Find a Friend',
                cost: [G],
                damage: 0,
                text: 'Search your deck for a [G] Pokémon, reveal it, and put it into your hand. Then, shuffle the deck.'
            }];
        this.setNumber = '20';
        this.set = 'LOT';
        this.fullName = 'Treecko LOT';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Treecko';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.GRASS }, { min: 0, max: 1, allowCancel: true }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Treecko = Treecko;

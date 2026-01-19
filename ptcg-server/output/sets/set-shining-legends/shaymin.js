"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shaymin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Shaymin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Flippity Flap',
                cost: [G],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
            },
            {
                name: 'Rally Back',
                cost: [G, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s ' +
                    'attack during their last turn, this attack does 90 more damage.'
            }];
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Shaymin';
        this.fullName = 'Shaymin SLG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            //MOVE_CARDS(store, state, player.hand, player.deck, { cards: player.hand.cards });
            player.hand.moveTo(player.deck);
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            (0, prefabs_1.DRAW_CARDS)(player, 6);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
                effect.damage += 90;
            }
            return state;
        }
        return state;
    }
}
exports.Shaymin = Shaymin;

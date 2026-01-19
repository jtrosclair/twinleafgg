"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMagmasZangoose = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamMagmasZangoose extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_MAGMA];
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a [C] Basic Pokémon or Basic Pokémon with Team Magma in its name and put it onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Team Play',
                cost: [C, C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the number of Pokémon in play with Team Magma in its name.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Team Magma\'s Zangoose';
        this.fullName = 'Team Magma\'s Zangoose MA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && (card.cardType === card_types_1.CardType.COLORLESS || card.tags.includes(card_types_1.CardTag.TEAM_MAGMA))) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, blocked });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            let magmaCount = 0;
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.tags.includes(card_types_1.CardTag.TEAM_MAGMA)) {
                    magmaCount++;
                }
            });
            effect.opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.tags.includes(card_types_1.CardTag.TEAM_MAGMA)) {
                    magmaCount++;
                }
            });
            effect.damage = 10 * magmaCount;
        }
        return state;
    }
}
exports.TeamMagmasZangoose = TeamMagmasZangoose;

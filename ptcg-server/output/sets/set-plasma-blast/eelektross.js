"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eelektross = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Eelektross extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Eelektrik';
        this.cardType = L;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Crush and Burn',
                cost: [L, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Discard as many Energy attached to your Pok\u00e9mon as you like. This attack does 30 damage times the number of Energy cards you discarded.'
            },
            {
                name: 'Thunder Tempest',
                cost: [L, C, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 50 damage times the number of heads.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '33';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eelektross';
        this.fullName = 'Eelektross PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Collect all energy cards from all of player's Pokemon
            const energyCards = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.cards.forEach(c => {
                    if (c.superType === card_types_1.SuperType.ENERGY) {
                        energyCards.push({ card: c, source: cardList });
                    }
                });
            });
            if (energyCards.length === 0) {
                effect.damage = 0;
                return state;
            }
            // Create a temporary CardList to pick from
            const tempList = new game_1.CardList();
            energyCards.forEach(e => tempList.cards.push(e.card));
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, tempList, {}, { min: 0, max: energyCards.length, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    selected.forEach(card => {
                        const entry = energyCards.find(e => e.card === card);
                        if (entry) {
                            entry.source.moveCardTo(card, player.discard);
                        }
                    });
                    effect.damage = 30 * selected.length;
                }
                else {
                    effect.damage = 0;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 4, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.Eelektross = Eelektross;

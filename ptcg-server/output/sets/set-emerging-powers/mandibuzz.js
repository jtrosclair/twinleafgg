"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mandibuzz = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mandibuzz extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Vullaby';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bone Rush',
                cost: [D],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'Dark Pulse',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 10 more damage for each [D] Energy attached to all of your Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Mandibuzz';
        this.fullName = 'Mandibuzz EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, effect.player, headsCount => {
                effect.damage = 30 * headsCount;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let darkEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.cards.forEach(card => {
                    if (card.superType === card_types_1.SuperType.ENERGY && card.provides.includes(card_types_1.CardType.DARK)) {
                        darkEnergy++;
                    }
                });
            });
            effect.damage += 10 * darkEnergy;
        }
        return state;
    }
}
exports.Mandibuzz = Mandibuzz;

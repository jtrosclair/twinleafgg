"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasVictreebel = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ErikasVictreebel extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Erika\'s Weepinbell';
        this.tags = [game_1.CardTag.ERIKAS];
        this.cardType = G;
        this.hp = 150;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Flower Garden Rondo',
                cost: [G, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each of your Erika\'s Pokémon in play.'
            },
            {
                name: 'Solar Beam',
                cost: [G, G, C],
                damage: 130,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Erika\'s Victreebel';
        this.fullName = 'Erika\'s Victreebel MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let erikasPokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard) => {
                if (pokemonCard && pokemonCard.tags.includes(game_1.CardTag.ERIKAS)) {
                    erikasPokemonCount++;
                }
            });
            effect.damage = 40 * erikasPokemonCount;
        }
        return state;
    }
}
exports.ErikasVictreebel = ErikasVictreebel;

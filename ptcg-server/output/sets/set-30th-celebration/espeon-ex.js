"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espeonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Espeonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Eevee';
        this.hp = 260;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Sunshine Beatdown',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each of your Pokémon in play.',
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Espeon ex';
        this.fullName = 'Espeon ex 30C';
    }
    reduceEffect(store, state, effect) {
        // Sunshine Beatdown
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let pokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, () => {
                pokemonCount++;
            });
            effect.damage = pokemonCount * 30;
        }
        return state;
    }
}
exports.Espeonex = Espeonex;

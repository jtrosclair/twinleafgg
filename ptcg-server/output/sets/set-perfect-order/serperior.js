"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serperior = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Serperior extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Servine';
        this.cardType = G;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Royal Command',
                cost: [G],
                damage: 0,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each Pokemon you have in play.'
            },
            {
                name: 'Solar Winder',
                cost: [G, G, G],
                damage: 100,
                damageCalculation: '+',
                text: 'If you have Rosa\'s Encouragement in your discard pile, this attack does 150 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Serperior';
        this.fullName = 'Serperior M3';
    }
    reduceEffect(store, state, effect) {
        // Royal Command - 20x damage per Pokemon in play
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let pokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, () => {
                pokemonCount++;
            });
            effect.damage = pokemonCount * 20;
        }
        // Solar Winder - +150 damage if Rosa's Encouragement in discard
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const hasRosasEncouragement = player.discard.cards.some(card => card.name === 'Rosa\'s Encouragement');
            if (hasRosasEncouragement) {
                effect.damage += 150;
            }
        }
        return state;
    }
}
exports.Serperior = Serperior;

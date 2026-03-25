"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weavile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weavile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sneasel';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Dark Penalty',
                cost: [D],
                damage: 90,
                text: 'If the Defending Pokémon has no Pokémon Tool card attached to it, this attack does nothing.'
            },
            {
                name: 'Fury Swipes',
                cost: [C, C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Weavile';
        this.fullName = 'Weavile NXD';
    }
    reduceEffect(store, state, effect) {
        // Dark Penalty
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent's active has a tool attached
            const hasTool = opponent.active.tools.length > 0;
            if (!hasTool) {
                effect.damage = 0;
            }
        }
        // Fury Swipes
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = heads * 30;
            });
        }
        return state;
    }
}
exports.Weavile = Weavile;

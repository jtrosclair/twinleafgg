"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaSharpedoex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaSharpedoex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Carvanha';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 330;
        this.weakness = [{ type: G }];
        this.retreat = [];
        this.attacks = [{
                name: 'Greedy Fangs',
                cost: [D],
                damage: 70,
                text: 'Draw 2 cards.',
            },
            {
                name: 'Hungry Jaw',
                cost: [D, D],
                damage: 120,
                damageCalculation: '+',
                text: 'If this Pokémon has any damage counters on it, this attack does 150 more damage.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Sharpedo ex';
        this.fullName = 'Mega Sharpedo ex M2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { count: 1 });
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if ((0, prefabs_1.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT)(effect, this)) {
                (0, prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE)(effect, store, state, 150);
            }
        }
        return state;
    }
}
exports.MegaSharpedoex = MegaSharpedoex;

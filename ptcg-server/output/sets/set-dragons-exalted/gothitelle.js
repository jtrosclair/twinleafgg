"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothitelle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gothitelle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gothorita';
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Doom Decree',
                cost: [P, C],
                damage: 0,
                text: 'Flip 2 coins. If both of them are heads, the Defending Pokemon is Knocked Out.'
            },
            {
                name: 'Black Magic',
                cost: [P, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Does 20 more damage for each of your opponent\'s Benched Pokemon.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '57';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gothitelle';
        this.fullName = 'Gothitelle DRX';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Doom Decree - Flip 2 coins, if both heads KO defending
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                if (results.every(r => r)) {
                    // Both heads - KO the defending Pokemon
                    const knockOutEffect = new game_effects_1.KnockOutEffect(player, opponent.active);
                    store.reduceEffect(state, knockOutEffect);
                }
            });
        }
        // Attack 2: Black Magic - +20 per opponent's benched
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benchedCount = opponent.bench.filter(b => b.cards.length > 0).length;
            effect.damage += benchedCount * 20;
        }
        return state;
    }
}
exports.Gothitelle = Gothitelle;

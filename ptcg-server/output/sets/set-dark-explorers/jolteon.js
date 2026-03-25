"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jolteon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jolteon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Electrigun',
                cost: [C],
                damage: 20,
                damageCalculation: '+',
                text: 'You may discard a [L] Energy attached to this Pokémon. If you do, this attack does 40 more damage.'
            },
            {
                name: 'Pin Missile',
                cost: [L, C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 40 damage times the number of heads.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jolteon';
        this.fullName = 'Jolteon DEX';
    }
    reduceEffect(store, state, effect) {
        // Electrigun - may discard Lightning energy for +40
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if has Lightning energy attached
            const hasLightningEnergy = player.active.cards.some(c => {
                var _a;
                return c.superType === card_types_1.SuperType.ENERGY &&
                    ((_a = c.provides) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardType.LIGHTNING));
            });
            if (hasLightningEnergy) {
                return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_DEAL_MORE_DAMAGE), result => {
                    if (result) {
                        // Find and discard a Lightning energy
                        const lightningEnergy = player.active.cards.find(c => {
                            var _a;
                            return c.superType === card_types_1.SuperType.ENERGY &&
                                ((_a = c.provides) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardType.LIGHTNING));
                        });
                        if (lightningEnergy) {
                            player.active.moveCardTo(lightningEnergy, player.discard);
                            effect.damage += 40;
                        }
                    }
                });
            }
        }
        // Pin Missile - flip 4 coins, 40x heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 4, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage = 40 * heads;
            });
        }
        return state;
    }
}
exports.Jolteon = Jolteon;

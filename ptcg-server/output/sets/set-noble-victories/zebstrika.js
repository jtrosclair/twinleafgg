"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zebstrika = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Zebstrika extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Blitzle';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Quick Attack',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            },
            {
                name: 'Shock Bolt',
                cost: [L, L, C],
                damage: 90,
                text: 'Flip a coin. If tails, discard all [L] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Zebstrika';
        this.fullName = 'Zebstrika NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    // Discard all Lightning Energy attached to this Pokémon
                    const lightningEnergies = player.active.cards.filter(card => {
                        var _a;
                        return card.superType === card_types_1.SuperType.ENERGY &&
                            card instanceof pokemon_card_1.PokemonCard === false &&
                            ((_a = card.provides) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardType.LIGHTNING));
                    });
                    lightningEnergies.forEach(card => {
                        player.active.moveCardTo(card, player.discard);
                    });
                }
            });
        }
        return state;
    }
}
exports.Zebstrika = Zebstrika;

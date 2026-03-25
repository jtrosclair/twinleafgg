"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Umbreon2 = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Umbreon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Confuse Ray',
                cost: [C],
                damage: 20,
                text: 'The Defending Pokémon is now Confused.'
            },
            {
                name: 'Shadow Shutdown',
                cost: [D, C, C],
                damage: 60,
                text: 'Flip 2 coins. If both of them are heads, discard all Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Umbreon';
        this.fullName = 'Umbreon DEX 61';
    }
    reduceEffect(store, state, effect) {
        // Confuse Ray
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Shadow Shutdown - flip 2 coins, both heads = discard all energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const allHeads = results.every(r => r);
                if (allHeads) {
                    // Discard all energy from defending Pokémon
                    const energyCards = opponent.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                    energyCards.forEach(card => {
                        opponent.active.moveCardTo(card, opponent.discard);
                    });
                }
            });
        }
        return state;
    }
}
exports.Umbreon2 = Umbreon2;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noivern = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Noivern extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Noibat';
        this.cardType = N;
        this.hp = 120;
        this.weakness = [{ type: Y }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Boomburst',
                cost: [C],
                damage: 0,
                text: 'This attack does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Dragon Pulse',
                cost: [P, D, C],
                damage: 120,
                text: 'Discard the top card of your deck.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '159';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Noivern';
        this.fullName = 'Noivern UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Boomburst
        // Ref: set-unbroken-bonds/weezing.ts (Splattering Sludge)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Damage to active (uses DealDamageEffect for W/R)
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 20);
            dealDamage.target = opponent.active;
            store.reduceEffect(state, dealDamage);
            // Damage to bench (uses PutDamageEffect, no W/R)
            opponent.bench.forEach(benched => {
                if (benched.cards.length > 0) {
                    const damage = new attack_effects_1.PutDamageEffect(effect, 20);
                    damage.target = benched;
                    store.reduceEffect(state, damage);
                }
            });
        }
        // Attack 2: Dragon Pulse
        // Ref: set-unbroken-bonds/rhydon.ts (Dirty Work)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, player, 1, this, effect);
        }
        return state;
    }
}
exports.Noivern = Noivern;

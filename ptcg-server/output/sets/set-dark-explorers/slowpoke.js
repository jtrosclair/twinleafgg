"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowpoke = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Slowpoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Big Yawn',
                cost: [C],
                damage: 0,
                text: 'Both this Pokémon and the Defending Pokémon are now Asleep.'
            },
            {
                name: 'Shot in the Dark',
                cost: [W, C],
                damage: 20,
                text: 'Flip 2 coins. If either of them is tails, this attack does nothing.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '23';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slowpoke';
        this.fullName = 'Slowpoke DEX';
    }
    reduceEffect(store, state, effect) {
        // Big Yawn - both Pokémon fall asleep
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Put both this Pokémon and the Defending Pokémon to sleep
            const selfAsleep = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            selfAsleep.target = player.active;
            store.reduceEffect(state, selfAsleep);
            const opponentAsleep = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            opponentAsleep.target = opponent.active;
            store.reduceEffect(state, opponentAsleep);
        }
        // Shot in the Dark - flip 2 coins, need both heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                // If either coin is tails, the attack does nothing
                if (results.includes(false)) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Slowpoke = Slowpoke;

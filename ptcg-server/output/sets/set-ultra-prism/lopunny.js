"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lopunny = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Lopunny extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Buneary';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.wantsToShuffle = false;
        this.attacks = [
            {
                name: 'Stompy Stomp',
                cost: [C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 40 damage for each heads.'
            },
            {
                name: 'Happy Turn',
                cost: [C, C],
                damage: 60,
                text: 'You may shuffle this Pokémon and all cards attached to it into your deck.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '107';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lopunny';
        this.fullName = 'Lopunny UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Stompy Stomp
        // Ref: set-x-and-y/scolipede.ts (Random Peck - multiple coin flips damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                effect.damage = 40 * results.filter(r => r).length;
            });
        }
        // Attack 2: Happy Turn
        // Ref: set-guardians-rising/politoed.ts (Hyper Jump - optional shuffle self into deck)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToShuffle => {
                this.wantsToShuffle = wantToShuffle;
            });
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.wantsToShuffle) {
            this.wantsToShuffle = false;
            return (0, attack_effects_1.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK)(store, state, effect);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.wantsToShuffle = false;
        }
        return state;
    }
}
exports.Lopunny = Lopunny;

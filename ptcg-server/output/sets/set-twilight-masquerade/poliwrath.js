"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poliwrath = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Poliwrath extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Poliwhirl';
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Hypnosis',
                cost: [W],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            },
            {
                name: 'Jumping Uppercut',
                cost: [C, C],
                damage: 120,
                damageCalculation: '+',
                text: 'You may do 120 more damage. If you do, shuffle this Pokémon and all attached cards into your deck.'
            },
        ];
        this.set = 'TWM';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Poliwrath';
        this.fullName = 'Poliwrath TWM';
        this.shuffleIntoDeck = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, (result) => {
                if (!result) {
                    return state;
                }
                effect.damage += 120;
                this.shuffleIntoDeck = true;
            }, game_message_1.GameMessage.WANT_TO_DEAL_MORE_DAMAGE);
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.shuffleIntoDeck) {
            const player = effect.player;
            player.active.clearEffects();
            this.shuffleIntoDeck = false;
            player.active.moveTo(player.deck);
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
        }
        return state;
    }
}
exports.Poliwrath = Poliwrath;

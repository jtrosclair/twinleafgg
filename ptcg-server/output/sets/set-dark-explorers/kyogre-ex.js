"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KyogreEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class KyogreEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Smash Turn',
                cost: [W, C],
                damage: 30,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Dual Splash',
                cost: [W, W, C],
                damage: 0,
                text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kyogre-EX';
        this.fullName = 'Kyogre EX DEX';
        this.usedSmashTurn = false;
    }
    reduceEffect(store, state, effect) {
        // Smash Turn - set flag to switch after attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedSmashTurn = true;
        }
        // Dual Splash - does 50 damage to 2 of opponent's Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 2, max: 2, allowCancel: false }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 50, targets);
            });
        }
        // After Smash Turn, optionally switch self
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSmashTurn) {
            this.usedSmashTurn = false;
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToSwitch => {
                    if (wantToSwitch) {
                        (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
                    }
                });
            }
        }
        // Cleanup
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedSmashTurn = false;
        }
        return state;
    }
}
exports.KyogreEx = KyogreEx;

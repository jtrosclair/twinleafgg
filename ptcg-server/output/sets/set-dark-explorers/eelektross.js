"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eelektross = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
class Eelektross extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Eelektrik';
        this.cardType = L;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Suction Heal',
                cost: [L, C, C],
                damage: 40,
                text: 'Heal from this Pokémon the same amount of damage you did to the Defending Pokémon.'
            },
            {
                name: 'Slurp Shakedown',
                cost: [L, L, C, C],
                damage: 0,
                text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. This attack does 60 damage to the new Defending Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '47';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eelektross';
        this.fullName = 'Eelektross DEX';
        this.usedSlurpShakedown = false;
    }
    reduceEffect(store, state, effect) {
        // Suction Heal - heal same amount as damage dealt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const healEffect = new attack_effects_2.HealTargetEffect(effect, effect.damage);
            healEffect.target = effect.player.active;
            store.reduceEffect(state, healEffect);
        }
        // Slurp Shakedown - switch opponent's active with bench, then deal 60 to new active
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedSlurpShakedown = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSlurpShakedown) {
            this.usedSlurpShakedown = false;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                opponent.switchPokemon(cardList);
                const damageEffect = new attack_effects_1.DealDamageEffect(effect, 60);
                damageEffect.target = opponent.active;
                store.reduceEffect(state, damageEffect);
            });
        }
        // Clean up flag at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedSlurpShakedown = false;
        }
        return state;
    }
}
exports.Eelektross = Eelektross;

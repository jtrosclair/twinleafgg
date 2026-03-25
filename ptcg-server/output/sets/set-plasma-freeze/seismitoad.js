"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seismitoad = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Seismitoad extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Palpitoad';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Seismic Punch',
                cost: [C, C],
                damage: 30,
                text: 'Does 30 damage to each Benched Pokémon (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Splashing Turn',
                cost: [W, W, C, C],
                damage: 80,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Seismitoad';
        this.fullName = 'Seismitoad PLF';
        this.usedSplashingTurn = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === player.active) {
                    return;
                }
                if (cardList.cards.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList === opponent.active) {
                    return;
                }
                if (cardList.cards.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedSplashingTurn = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSplashingTurn) {
            this.usedSplashingTurn = false;
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedSplashingTurn) {
            this.usedSplashingTurn = false;
        }
        return state;
    }
}
exports.Seismitoad = Seismitoad;

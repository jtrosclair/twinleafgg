"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzong = void 0;
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Bronzong extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bronzor';
        this.cardType = M;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Psy Bolt',
                cost: [M],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Psychic Resonance',
                cost: [M, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If your opponent has any Psychic Pokémon in play, this attack does 60 more damage.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '87';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bronzong';
        this.fullName = 'Bronzong UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Psy Bolt
        // Ref: AGENTS-patterns.md (coin flip + paralyzed)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        // Attack 2: Psychic Resonance
        // Ref: set-guardians-rising/honchkrow.ts (Raven's Claw - checking opponent's Pokemon)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let hasPsychic = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const checkType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkType);
                if (checkType.cardTypes.includes(card_types_1.CardType.PSYCHIC)) {
                    hasPsychic = true;
                }
            });
            if (hasPsychic) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.Bronzong = Bronzong;

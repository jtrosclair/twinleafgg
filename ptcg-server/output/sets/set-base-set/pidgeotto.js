"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgeotto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pidgeotto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.fullName = 'Pidgeotto BS';
        this.name = 'Pidgeotto';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pidgey';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.hp = 60;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.mirrorMoveEffects = [];
        this.attacks = [
            {
                name: 'Whirlwind',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon. (Do the damage before switching the Pokémon.)'
            },
            {
                name: 'Mirror Move',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'If Pidgeotto was attacked last turn, do the final result of that attack on Pidgeotto to the Defending Pokémon.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const opponent = __1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            this.mirrorMoveEffects.push(effect);
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.active.cards.includes(this) || effect.player.bench.some(b => b.cards.includes(this))) {
                this.mirrorMoveEffects = [];
            }
            return state;
        }
        return state;
    }
}
exports.Pidgeotto = Pidgeotto;

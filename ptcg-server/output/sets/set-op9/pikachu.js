"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pikachu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING, value: 10 }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Growl',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'During your opponent\'s next turn, any damage done by attacks ' +
                    'from the Defending Pokemon is reduced by 20 (before applying ' +
                    'Weakness and Resistance).'
            },
            {
                name: 'Numb',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'If Pikachu evolved from Pichu during this turn, the Defending ' +
                    'Pokemon is now Paralyzed.'
            }
        ];
        this.set = 'OP9';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu OP9';
        this.GROWL_MARKER = 'GROWL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.GROWL_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!(cardList instanceof game_1.PokemonCardList)) {
                return state;
            }
            if (cardList.pokemonPlayedTurn === state.turn && !cardList.isStage(card_types_1.Stage.BASIC)) {
                const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                store.reduceEffect(state, specialCondition);
            }
            return state;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.marker.hasMarker(this.GROWL_MARKER, this)) {
            const reducedDamage = Math.max(0, effect.damage - 20);
            effect.damage = reducedDamage;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.GROWL_MARKER);
        }
        return state;
    }
}
exports.Pikachu = Pikachu;

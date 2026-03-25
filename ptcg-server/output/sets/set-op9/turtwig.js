"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Turtwig = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Turtwig extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{
                type: card_types_1.CardType.FIRE,
                value: 10
            }];
        this.resistance = [{
                type: card_types_1.CardType.WATER,
                value: -20
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Absorb',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                text: 'Remove 1 damage counter from Turtwig.'
            }, {
                name: 'Parboil',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'If you have Chimchar in play, this attack does 40 damage plus 20 ' +
                    'more damage and the Defending Pokemon is now Burned.'
            }];
        this.set = 'OP9';
        this.name = 'Turtwig';
        this.fullName = 'Turtwig OP9';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healEffect = new attack_effects_1.HealTargetEffect(effect, 10);
            healEffect.target = player.active;
            return store.reduceEffect(state, healEffect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let isChimcharInPlay = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Chimchar') {
                    isChimcharInPlay = true;
                }
            });
            if (isChimcharInPlay) {
                effect.damage += 20;
                const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
                store.reduceEffect(state, specialCondition);
            }
        }
        return state;
    }
}
exports.Turtwig = Turtwig;

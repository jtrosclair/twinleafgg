"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Copperajah = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Copperajah extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cufant';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Dig Drain',
                damage: 60,
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL],
                text: 'Heal 30 damage from this Pokémon.'
            },
            {
                name: 'Muscular Nose',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.METAL],
                damage: 220,
                text: 'If this Pokémon has 8 or more damage counters on it, this attack does nothing.'
            }
        ];
        this.regulationMark = 'D';
        this.set = 'SSH';
        this.name = 'Copperajah';
        this.fullName = 'Copperajah SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, effect.player.active, 30);
            store.reduceEffect(state, healEffect);
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.active.damage >= 80) {
                effect.damage = 0;
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Copperajah = Copperajah;

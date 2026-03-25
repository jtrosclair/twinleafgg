"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sunkern = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sunkern extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Leech Seed',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                text: 'Heal 10 damage from this Pokémon.'
            }
        ];
        this.set = 'CEC';
        this.fullName = 'Sunkern CEC';
        this.name = 'Sunkern';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const target = player.active;
            const healEffect = new game_effects_1.HealEffect(player, target, 10);
            state = store.reduceEffect(state, healEffect);
            return state;
        }
        return state;
    }
}
exports.Sunkern = Sunkern;

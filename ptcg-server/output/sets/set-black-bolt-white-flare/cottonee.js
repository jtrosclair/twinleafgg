"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cottonee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cottonee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Absorb',
                cost: [G],
                damage: 10,
                text: 'Heal 10 damage from this Pokémon.'
            }
        ];
        this.set = 'WHT';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Cottonee';
        this.fullName = 'Cottonee SV11W';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, player.active, 10);
            store.reduceEffect(state, healEffect);
            return state;
        }
        return state;
    }
}
exports.Cottonee = Cottonee;

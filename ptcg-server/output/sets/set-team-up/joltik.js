"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joltik = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Joltik extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Leech Life',
                cost: [L],
                damage: 10,
                text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'TEU';
        this.name = 'Joltik';
        this.fullName = 'Joltik TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
    }
    reduceEffect(store, state, effect) {
        // Leech Life
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const healTime = new attack_effects_1.HealTargetEffect(effect, effect.damage);
            healTime.target = effect.player.active;
            store.reduceEffect(state, healTime);
        }
        return state;
    }
}
exports.Joltik = Joltik;

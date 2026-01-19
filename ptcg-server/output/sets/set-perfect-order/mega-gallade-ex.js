"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaGalladeex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaGalladeex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 350;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Gale Cut',
                cost: [F],
                damage: 50,
                damageCalculation: '+',
                text: 'If this Pokémon has any damage counters on it, this attack does 150 more damage.',
            },
            {
                name: 'Marvelous Edge',
                cost: [F, F, C],
                damage: 240,
                text: '',
            }];
        this.regulationMark = 'J';
        this.set = 'MEP';
        this.setNumber = '68';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Gallade ex';
        this.fullName = 'Mega Gallade ex MEP';
    }
    reduceEffect(store, state, effect) {
        // Gale Cut
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if ((0, prefabs_1.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT)(effect, this)) {
                effect.damage += 150;
            }
        }
        return state;
    }
}
exports.MegaGalladeex = MegaGalladeex;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lombre = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lombre extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lotad';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mega Drain',
                cost: [G, C],
                damage: 30,
                text: 'Heal 30 damage from this Pokémon.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Lombre';
        this.fullName = 'Lombre M2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, effect.player.active, 30);
            store.reduceEffect(state, healEffect);
            return state;
        }
        return state;
    }
}
exports.Lombre = Lombre;

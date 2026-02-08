"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diggersby = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Diggersby extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bunnelby';
        this.cardType = C;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Earthquake',
                cost: [C],
                damage: 140,
                text: 'This attack does 30 damage to each of your Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            },
            {
                name: 'Whap Down',
                cost: [C, C, C],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Diggersby';
        this.fullName = 'Diggersby M3';
    }
    reduceEffect(store, state, effect) {
        // Earthquake - damage to benched Pokemon (no weakness/resistance)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList !== player.active) {
                    const putDamageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    putDamageEffect.target = cardList;
                    putDamageEffect.source = player.active;
                    store.reduceEffect(state, putDamageEffect);
                }
            });
        }
        return state;
    }
}
exports.Diggersby = Diggersby;

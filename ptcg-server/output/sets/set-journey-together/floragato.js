"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Floragato = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Floragato extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sprigatito';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Magical Leaf',
                cost: [C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage, and heal 30 damage from this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Floragato';
        this.fullName = 'Floragato JTG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    effect.damage += 30;
                    store.reduceEffect(state, new game_effects_1.HealEffect(effect.player, effect.source, 30));
                }
            });
        }
        return state;
    }
}
exports.Floragato = Floragato;

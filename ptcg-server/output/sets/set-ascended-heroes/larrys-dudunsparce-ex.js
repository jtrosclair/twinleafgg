"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarrysDudunsparceex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LarrysDudunsparceex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Larry\'s Dunsparce';
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.LARRYS];
        this.cardType = C;
        this.hp = 270;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Work Rush',
                cost: [C, C, C],
                damage: 80,
                damageCalculation: 'x',
                text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 80 damage for each heads.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '164';
        this.name = 'Larry\'s Dudunsparce ex';
        this.fullName = 'Larry\'s Dudunsparce ex MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const energyCount = player.active.energies.cards.filter(card => card.superType === game_1.SuperType.ENERGY).length;
            const coinFlips = [];
            for (let i = 0; i < energyCount; i++) {
                coinFlips.push(new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN));
            }
            if (coinFlips.length > 0) {
                return store.prompt(state, coinFlips, results => {
                    const headsCount = Array.isArray(results) ? results.filter(r => r === true).length : (results === true ? 1 : 0);
                    effect.damage = 80 * headsCount;
                });
            }
            else {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.LarrysDudunsparceex = LarrysDudunsparceex;

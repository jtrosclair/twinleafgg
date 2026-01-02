"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyuremex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Kyuremex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 230;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Slash',
                cost: [C, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Freezing Flames',
                cost: [W, W, C],
                damage: 130,
                text: 'This attack does 10 damage to each of your opponent\'s Benched Pokémon for each Prize card your opponent has taken.'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '28';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kyurem ex';
        this.fullName = 'Kyurem ex SV11B';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 10;
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, (damagePerPrize * prizesTaken));
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Kyuremex = Kyuremex;

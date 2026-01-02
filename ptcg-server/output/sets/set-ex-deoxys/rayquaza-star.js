"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaStar = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RayquazaStar extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.STAR];
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: W, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Spiral Rush',
                cost: [R, L],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'Holy Star',
                cost: [R, R, L, L],
                damage: 0,
                text: 'Discard all Energy cards attached to Rayquaza Star. This attack does 100 damage to each of your opponent\'s Pokémon-ex. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'DX';
        this.setNumber = '107';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rayquaza Star';
        this.fullName = 'Rayquaza Star DX';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    effect.damage = 30 * heads;
                    return state;
                });
            };
            return flipCoin();
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
            const opponent = effect.opponent;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, target) => {
                if (target.tags.includes(game_1.CardTag.POKEMON_ex)) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 100);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.RayquazaStar = RayquazaStar;

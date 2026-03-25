"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palafin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Palafin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Finizen';
        this.attacks = [{
                name: 'Vanguard Punch',
                cost: [card_types_1.CardType.WATER],
                damage: 130,
                text: 'This Pokémon also does 10 damage to itself for each damage counter on it.'
            },
            {
                name: 'Double Hit',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 90 damage for each heads.'
            }];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Palafin';
        this.fullName = 'Palafin TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const selfDamage = player.active.damage;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, selfDamage);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 90 * heads;
            });
        }
        return state;
    }
}
exports.Palafin = Palafin;

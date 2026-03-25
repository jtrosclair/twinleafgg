"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annihilape = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Annihilape extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Primeape';
        this.attacks = [
            {
                name: 'Rage Fist',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 70,
                damageCalculation: 'x',
                text: 'This attack does 70 damage for each Prize card your opponent has taken.'
            },
            {
                name: 'Dynamite Punch',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 170,
                text: 'This Pokemon also does 10 damage to itself.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Annihilape';
        this.fullName = 'Annihilape SVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const damagePerPrize = 70;
            effect.damage = opponent.prizesTaken * damagePerPrize;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 50);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Annihilape = Annihilape;

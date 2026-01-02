"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Infernape = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class Infernape extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Monferno';
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W, value: +30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Meteor Punch',
                cost: [C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'Flare Blitz',
                cost: [R, R],
                damage: 90,
                text: 'Discard all [R] Energy attached to Infernape.'
            }];
        this.set = 'DP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Infernape';
        this.fullName = 'Infernape DP';
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
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergy);
            checkProvidedEnergy.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.FIRE) || em.provides.includes(card_types_1.CardType.ANY)) {
                    prefabs_1.MOVE_CARDS(store, state, player.active, player.discard, { cards: [em.card] });
                }
            });
        }
        return state;
    }
}
exports.Infernape = Infernape;

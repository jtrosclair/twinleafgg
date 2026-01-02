"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exeggutor = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Exeggutor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Exeggcute';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Barrage O\'Clock',
                cost: [card_types_1.CardType.GRASS],
                damage: 60,
                damageCalculation: 'x',
                text: 'Flip a coin for each Energy attached to both Active Pokémon. This attack does 60 damage for each heads.'
            }];
        this.set = 'SSP';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Exeggutor';
        this.fullName = 'Exeggutor SSP';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const opponentsEnergyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
            const checkMyProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkMyProvidedEnergyEffect);
            const myEnergyCount = checkMyProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
            const coins = [];
            for (let i = 0; i < opponentsEnergyCount + myEnergyCount; i++) {
                coins.push(new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP));
            }
            return store.prompt(state, coins, result => {
                let heads = 0;
                result.forEach(r => {
                    heads += r ? 1 : 0;
                });
                effect.damage = 60 * heads;
            });
        }
        return state;
    }
}
exports.Exeggutor = Exeggutor;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasManaphy4 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SeasManaphy4 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Water Absorb',
                useWhenInPlay: false,
                powerType: game_1.PowerType.POKEBODY,
                text: 'When you attach a [W] Energy card from your hand to Sea\'s Manaphy, remove all Special Conditions and 1 damage counter from Sea\'s Manaphy.'
            }];
        this.attacks = [{
                name: 'Water Punch',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin for each [W] Energy attached to Sea\'s Manaphy. This attack does 20 damage plus 10 more damage for each heads.'
            }];
        this.set = 'PCGP';
        this.name = 'Sea\'s Manaphy';
        this.fullName = 'Sea\'s Manaphy PCGP 150';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '150';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            if (effect.target.specialConditions.length === 0) {
                return state;
            }
            if (!effect.energyCard.provides.includes(card_types_1.CardType.WATER)) {
                return state;
            }
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const healEffect = new game_effects_1.HealEffect(player, effect.target, 10);
            state = store.reduceEffect(state, healEffect);
            const conditions = effect.target.specialConditions.slice();
            conditions.forEach(condition => {
                effect.target.removeSpecialCondition(condition);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.WATER) || em.provides.includes(card_types_1.CardType.ANY)) {
                    energyCount += em.provides.length;
                }
            });
            for (let i = 0; i < energyCount; i++) {
                store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result) {
                        effect.damage += 10;
                    }
                });
            }
        }
        return state;
    }
}
exports.SeasManaphy4 = SeasManaphy4;

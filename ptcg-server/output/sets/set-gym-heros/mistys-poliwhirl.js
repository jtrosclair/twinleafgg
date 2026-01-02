"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysPoliwhirl = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class MistysPoliwhirl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Misty\'s Poliwag';
        this.tags = [card_types_1.CardTag.MISTYS];
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rapids',
                cost: [W, C],
                damage: 20,
                text: 'If the Defending Pokémon has any Energy cards attached to it, flip a coin. If heads, choose 1 of those Energy cards and discard it.'
            },
            {
                name: 'Water Punch',
                cost: [C, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a number of coins equal to the number of [W] Energy attached to Misty\'s Poliwhirl. This attack does 30 damage plus 10 damage for each heads.'
            }];
        this.set = 'G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Misty\'s Poliwhirl';
        this.fullName = 'Misty\'s Poliwhirl G1';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false }), selected => {
                        const card = selected[0];
                        if (!card) {
                            return;
                        }
                        opponent.active.moveCardTo(card, opponent.discard);
                    });
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            // Count only energies that provide [W]
            let waterEnergyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.WATER) || em.provides.includes(card_types_1.CardType.ANY)) {
                    waterEnergyCount++;
                }
            });
            for (let i = 0; i < waterEnergyCount; i++) {
                prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                    if (result) {
                        effect.damage += 10;
                    }
                });
            }
        }
        return state;
    }
}
exports.MistysPoliwhirl = MistysPoliwhirl;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnglishShiningCelebiCC6 = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// Printed text: https://limitlesstcg.com/cards/30C/CC6 (Neo Destiny 106).
class EnglishShiningCelebiCC6 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 50;
        this.cardType = game_1.CardType.GRASS;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.set = '30C';
        this.setNumber = 'CC6';
        this.usSetNumber = '30C CC6';
        this.name = 'Shining Celebi';
        this.fullName = 'Shining Celebi 30C CC6';
        this.cardImage = 'assets/cardback.png';
        this.attacks = [{
                name: 'Healing Water', cost: [game_1.CardType.WATER], damage: 0,
                text: 'Remove a number of damage counters from 1 of your Benched Pokémon equal to the number of Water Energy cards attached to Shining Celebi. If the Pokémon has fewer damage counters than that, remove all of them.'
            }, {
                name: 'Miracle Leaf', cost: [game_1.CardType.GRASS, game_1.CardType.PSYCHIC], damage: 10,
                text: 'Flip a number of coins equal to the number of Energy attached to the Defending Pokémon. If you get 1 or more heads, the Defending Pokémon is now Asleep, Confused, or Poisoned (your choice).'
            }];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const energy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, energy);
            const waterCards = new Set(energy.energyMap.filter(e => e.provides.includes(game_1.CardType.WATER) || e.provides.includes(game_1.CardType.ANY)).map(e => e.card)).size;
            if (waterCards === 0 || !player.bench.some(b => b.cards.length > 0)) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    store.reduceEffect(state, new game_effects_1.HealEffect(player, selected[0], waterCards * 10));
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const energy = new check_effects_1.CheckProvidedEnergyEffect(effect.opponent, effect.opponent.active);
            store.reduceEffect(state, energy);
            const count = energy.energyMap.reduce((n, e) => n + e.provides.length, 0);
            if (count === 0) {
                return state;
            }
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, count, results => {
                if (!results.some(Boolean)) {
                    return;
                }
                store.prompt(state, new game_1.SelectPrompt(effect.player.id, game_1.GameMessage.CHOOSE_OPTION, ['Asleep', 'Confused', 'Poisoned'], { allowCancel: false }), choice => {
                    const condition = [game_1.SpecialCondition.ASLEEP, game_1.SpecialCondition.CONFUSED, game_1.SpecialCondition.POISONED][choice];
                    store.reduceEffect(state, new attack_effects_1.AddSpecialConditionsEffect(effect, [condition]));
                });
            });
        }
        return state;
    }
}
exports.EnglishShiningCelebiCC6 = EnglishShiningCelebiCC6;

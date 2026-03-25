"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skiploom = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Skiploom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hoppip';
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Buffer',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If Skiploom would be Knocked Out by an opponent\'s attack, flip a coin. If heads, Skiploom is not Knocked Out and its remaining HP becomes 10 instead.'
            }];
        this.attacks = [{
                name: 'Miracle Powder',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, choose 1 Special Condition. The Defending Pokémon is now affected by that Special Condition.'
            }];
        this.set = 'TRR';
        this.setNumber = '49';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Skiploom';
        this.fullName = 'Skiploom TRR';
    }
    reduceEffect(store, state, effect) {
        // Resilient Body ability
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Check if ability is blocked
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Check if damage would cause knockout
            const checkHpEffect = new check_effects_1.CheckHpEffect(player, effect.target);
            store.reduceEffect(state, checkHpEffect);
            if (effect.damage >= checkHpEffect.hp) {
                // Flip a coin to see if we survive
                return store.prompt(state, new game_2.CoinFlipPrompt(player.id, game_2.GameMessage.COIN_FLIP), result => {
                    if (result === true) {
                        // If heads, prevent knockout and set HP to 10
                        effect.surviveOnTenHPReason = this.powers[0].name;
                    }
                    return state;
                });
            }
        }
        // Somersault Dive attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const options = [
                        { message: game_2.GameMessage.SPECIAL_CONDITION_PARALYZED, value: game_1.SpecialCondition.PARALYZED },
                        { message: game_2.GameMessage.SPECIAL_CONDITION_CONFUSED, value: game_1.SpecialCondition.CONFUSED },
                        { message: game_2.GameMessage.SPECIAL_CONDITION_ASLEEP, value: game_1.SpecialCondition.ASLEEP },
                        { message: game_2.GameMessage.SPECIAL_CONDITION_POISONED, value: game_1.SpecialCondition.POISONED },
                        { message: game_2.GameMessage.SPECIAL_CONDITION_BURNED, value: game_1.SpecialCondition.BURNED }
                    ];
                    store.prompt(state, new game_1.SelectPrompt(player.id, game_2.GameMessage.CHOOSE_SPECIAL_CONDITION, options.map(c => c.message), { allowCancel: false }), choice => {
                        const option = options[choice];
                        if (option !== undefined) {
                            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [option.value]);
                            store.reduceEffect(state, specialConditionEffect);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Skiploom = Skiploom;

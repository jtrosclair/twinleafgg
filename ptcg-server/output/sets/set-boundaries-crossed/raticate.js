"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raticate = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_2 = require("../../game/store/card/card-types");
const card_list_1 = require("../../game/store/state/card-list");
class Raticate extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rattata';
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [{
                name: 'Gnaw Through',
                cost: [C],
                damage: 0,
                text: 'Discard a Pokémon Tool card attached to the Defending Pokémon.'
            },
            {
                name: 'Super Fang',
                cost: [C, C, C],
                damage: 0,
                text: 'Put damage counters on the Defending Pokémon until its remaining HP is 10.'
            }];
        this.set = 'BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Raticate';
        this.fullName = 'Raticate BCR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.tools.length === 1) {
                opponent.active.moveCardTo(opponent.active.tools[0], opponent.discard);
            }
            else if (opponent.active.tools.length > 1) {
                const toolList = new card_list_1.CardList();
                toolList.cards = [...opponent.active.tools];
                return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, toolList, { trainerType: card_types_2.TrainerType.TOOL }, { min: 1, max: 1, allowCancel: false }), selectedTools => {
                    if (selectedTools && selectedTools.length === 1) {
                        const tool = selectedTools[0];
                        opponent.active.moveCardTo(tool, opponent.discard);
                    }
                    return state;
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const selectedTarget = opponent.active;
            const checkHpEffect = new check_effects_1.CheckHpEffect(effect.player, selectedTarget);
            store.reduceEffect(state, checkHpEffect);
            const totalHp = checkHpEffect.hp;
            let damageAmount = totalHp - 10;
            // Adjust damage if the target already has damage
            const targetDamage = selectedTarget.damage;
            if (targetDamage > 0) {
                damageAmount = Math.max(0, damageAmount - targetDamage);
            }
            if (damageAmount > 0) {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, damageAmount);
                damageEffect.target = selectedTarget;
                store.reduceEffect(state, damageEffect);
            }
            else if (damageAmount <= 0) {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 0);
                damageEffect.target = selectedTarget;
                store.reduceEffect(state, damageEffect);
            }
        }
        return state;
    }
}
exports.Raticate = Raticate;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianZoroark = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HisuianZoroark extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hisuian Zorua';
        this.hp = 120;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Scratch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Swirling Resentment',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Place damage counters on your opponent\'s Active Pokémon until its remaining HP is 50.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.name = 'Hisuian Zoroark';
        this.fullName = 'Hisuian Zoroark 30C';
    }
    reduceEffect(store, state, effect) {
        // Scratch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const selectedTarget = opponent.active;
            const checkHpEffect = new check_effects_1.CheckHpEffect(effect.player, selectedTarget);
            store.reduceEffect(state, checkHpEffect);
            let damageAmount = checkHpEffect.hp - 50;
            const targetDamage = selectedTarget.damage;
            if (targetDamage > 0) {
                damageAmount = Math.max(0, damageAmount - targetDamage);
            }
            if (damageAmount > 0) {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, damageAmount);
                damageEffect.target = selectedTarget;
                store.reduceEffect(state, damageEffect);
            }
        }
        return state;
    }
}
exports.HisuianZoroark = HisuianZoroark;

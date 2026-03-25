"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirlia2 = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Kirlia2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ralts';
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Dazzle Dance',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, each Defending Pokémon is now Confused.'
            },
            {
                name: 'Life Drain',
                cost: [P],
                damage: 0,
                text: 'Flip a coin. If heads, put damage counters on the Defending Pokémon until it is 10 HP away from being Knocked Out.'
            }];
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Kirlia';
        this.fullName = 'Kirlia RS 35';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
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
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, damageAmount);
                        damageEffect.target = selectedTarget;
                        store.reduceEffect(state, damageEffect);
                    }
                    else if (damageAmount <= 0) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 0);
                        damageEffect.target = selectedTarget;
                        store.reduceEffect(state, damageEffect);
                    }
                }
            });
        }
        return state;
    }
}
exports.Kirlia2 = Kirlia2;

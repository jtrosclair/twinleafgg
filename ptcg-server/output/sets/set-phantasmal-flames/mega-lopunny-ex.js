"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaLopunnyex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
class MegaLopunnyex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Buneary';
        this.cardType = C;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_SV_MEGA];
        this.hp = 330;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Gale Thrust',
                cost: [C],
                damage: 60,
                text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 170 more damage.'
            }, {
                name: 'Spiky Hopper',
                cost: [C, C],
                damage: 160,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokemon.'
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Mega Lopunny ex';
        this.fullName = 'Mega Lopunny ex M2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if ((0, prefabs_1.MOVED_TO_ACTIVE_THIS_TURN)(effect.player, this)) {
                effect.damage += 170;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 160);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.MegaLopunnyex = MegaLopunnyex;

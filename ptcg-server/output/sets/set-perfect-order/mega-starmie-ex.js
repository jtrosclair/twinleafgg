"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaStarmieex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaStarmieex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Staryu';
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 330;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Jet Blow',
                cost: [W],
                damage: 120,
                text: 'This attack also does 50 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            },
            {
                name: 'Nebula Beam',
                cost: [C, C, C],
                damage: 210,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any effects on your opponent\'s Active Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.usSetNumber = 'POR 21';
        this.name = 'Mega Starmie ex';
        this.fullName = 'Mega Starmie ex M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do 50 damage to 1 benched Pokemon
            const benchedTargets = opponent.bench.filter(b => b.cards.length > 0);
            if (benchedTargets.length > 0) {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                    const targets = selected || [];
                    if (targets.length > 0) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 50);
                        damageEffect.target = targets[0];
                        store.reduceEffect(state, damageEffect);
                    }
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            effect.ignoreResistance = true;
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 210);
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
exports.MegaStarmieex = MegaStarmieex;

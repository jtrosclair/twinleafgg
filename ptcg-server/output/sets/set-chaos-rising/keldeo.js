"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keldeo = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
class Keldeo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 110;
        this.cardType = W;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Penetrate',
                cost: [W],
                damage: 20,
                text: 'This attack also does 20 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            },
            {
                name: 'Reflect Energy',
                cost: [W, W],
                damage: 70,
                text: 'Move an Energy from this Pokemon to 1 of your Benched Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.usSetNumber = 'POR 19';
        this.name = 'Keldeo';
        this.fullName = 'Keldeo M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (hasBench) {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                    const targets = selected || [];
                    if (targets.length > 0) {
                        const benchTarget = targets[0];
                        const putDamage = new attack_effects_1.PutDamageEffect(effect, 20);
                        putDamage.target = benchTarget;
                        store.reduceEffect(state, putDamage);
                    }
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            const hasEnergy = player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            if (hasBench && hasEnergy) {
                return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                    const list = transfers || [];
                    for (const t of list) {
                        const target = game_1.StateUtils.getTarget(state, player, t.to);
                        player.active.moveCardTo(t.card, target);
                    }
                });
            }
        }
        return state;
    }
}
exports.Keldeo = Keldeo;

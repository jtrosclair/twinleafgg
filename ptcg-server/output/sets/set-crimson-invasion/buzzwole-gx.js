"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuzzwoleGX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BuzzwoleGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.ULTRA_BEAST];
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 190;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Jet Punch',
                cost: [F],
                damage: 30,
                text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Knuckle Impact',
                cost: [F, F, F],
                damage: 160,
                text: 'This Pokémon can\'t attack during your next turn.'
            },
            {
                name: 'Absorption-GX',
                cost: [F, F, F],
                damage: 0,
                gxAttack: true,
                text: 'This attack does 40 damage for each of your remaining Prize cards. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.set = 'CIN';
        this.name = 'Buzzwole-GX';
        this.fullName = 'Buzzwole-GX CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
    }
    reduceEffect(store, state, effect) {
        // Jet Punch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        // Knuckle Impact
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        // Absorption GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            const player = effect.player;
            // Check if player has used GX attack
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            // set GX attack as used for game
            player.usedGX = true;
            effect.damage = 40 * player.getPrizeLeft();
            return state;
        }
        return state;
    }
}
exports.BuzzwoleGX = BuzzwoleGX;

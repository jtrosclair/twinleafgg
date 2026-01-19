"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prinplup = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class Prinplup extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Piplup';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L, value: +20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Aqua Shower',
                cost: [W],
                damage: 0,
                text: 'Does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Brine',
                cost: [W, W],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon that has any damage counters on it. This attack does 40 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'DP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Prinplup';
        this.fullName = 'Prinplup DP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            effect.damage = 10;
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Gather all opponent's Pokemon (active + benched) that have any damage counters
            const damagedTargets = [];
            // Check opponent's active
            if (opponent.active.cards.length > 0 && opponent.active.damage > 0) {
                damagedTargets.push({ player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 });
            }
            // Check opponent's bench
            opponent.bench.forEach((b, index) => {
                if (b.cards.length > 0 && b.damage > 0) {
                    damagedTargets.push({ player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index });
                }
            });
            if (damagedTargets.length === 0) {
                return state;
            }
            // Block all Pokemon (active and benched) that have no damage
            const blocked = [];
            if (opponent.active.damage === 0) {
                blocked.push({ player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 });
            }
            opponent.bench.forEach((b, index) => {
                if (b.cards.length > 0 && b.damage === 0) {
                    blocked.push({ player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index });
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 40, targets);
            });
        }
        return state;
    }
}
exports.Prinplup = Prinplup;

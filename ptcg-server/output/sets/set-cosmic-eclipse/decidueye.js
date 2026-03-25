"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decidueye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Decidueye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dartrix';
        this.cardType = G;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Skill Dive',
                cost: [G],
                damage: 0,
                text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
            },
            {
                name: 'Tracking Shot',
                cost: [C, C],
                damage: 80,
                text: 'This attack does 80 damage to 1 of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Decidueye';
        this.fullName = 'Decidueye CEC';
    }
    reduceEffect(store, state, effect) {
        // Skill Dive
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 40);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        // Tracking Shot
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const damagedBenchedPokemon = opponent.bench.filter(b => b.cards.length > 0 && b.damage > 0);
            if (damagedBenchedPokemon.length === 0) {
                return state;
            }
            const blocked = [];
            opponent.bench.forEach((b, index) => {
                if (b.damage === 0) {
                    blocked.push({ player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index });
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), target => {
                if (!target || target.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 80);
                damageEffect.target = target[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Decidueye = Decidueye;

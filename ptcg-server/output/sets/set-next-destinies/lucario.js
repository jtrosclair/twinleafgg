"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lucario = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Lucario extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Riolu';
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Reflexive Retaliation',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), put 2 damage counters on the Attacking Pokémon.'
            }];
        this.attacks = [{
                name: 'Aura Sphere',
                cost: [F, F],
                damage: 50,
                text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'NXD';
        this.setNumber = '64';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lucario';
        this.fullName = 'Lucario NXD';
    }
    reduceEffect(store, state, effect) {
        // Reflexive Retaliation - damage attacker when hit
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            // Only works if this is the active Pokémon and was damaged by opponent
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetPlayer, this)) {
                return state;
            }
            // Only during attack phase
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            // Put 2 damage counters on attacker
            effect.source.damage += 20;
        }
        // Aura Sphere - damage a benched Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                    damageEffect.target = targets[0];
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Lucario = Lucario;

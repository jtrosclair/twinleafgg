"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ferrothorn2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Ferrothorn2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ferroseed';
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Iron Defense',
                cost: [M],
                damage: 0,
                text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
            },
            {
                name: 'Power Whip',
                cost: [C, C],
                damage: 0,
                text: 'Does 10 damage for each Energy attached to this Pokémon to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.name = 'Ferrothorn';
        this.fullName = 'Ferrothorn EPO 73';
        this.IRON_DEFENSE_MARKER = 'IRON_DEFENSE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    player.active.marker.addMarker(this.IRON_DEFENSE_MARKER, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const energyCount = player.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY).length;
            const damage = 10 * energyCount;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                const target = targets[0];
                const putDamage = new attack_effects_1.PutDamageEffect(effect, damage);
                putDamage.target = target;
                store.reduceEffect(state, putDamage);
            });
        }
        // Prevent damage and effects
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.marker.hasMarker(this.IRON_DEFENSE_MARKER, this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const attacker = effect.player;
            if (player !== attacker) {
                effect.preventDefault = true;
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.IRON_DEFENSE_MARKER, this);
        }
        return state;
    }
}
exports.Ferrothorn2 = Ferrothorn2;

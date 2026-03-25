"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sigilyph = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Sigilyph extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Reflect',
                cost: [P],
                damage: 0,
                text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 40 (after applying Weakness and Resistance).'
            },
            {
                name: 'Telekinesis',
                cost: [P, C, C],
                damage: 0,
                text: 'Does 50 damage to 1 of your opponent\'s Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Sigilyph';
        this.fullName = 'Sigilyph EPO';
        this.REFLECT_MARKER = 'REFLECT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.REFLECT_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                const target = targets[0];
                const putDamage = new attack_effects_1.PutDamageEffect(effect, 50);
                putDamage.target = target;
                store.reduceEffect(state, putDamage);
            });
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.marker.hasMarker(this.REFLECT_MARKER, this)) {
            effect.damage = Math.max(0, effect.damage - 40);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.REFLECT_MARKER, this);
        }
        return state;
    }
}
exports.Sigilyph = Sigilyph;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyurem = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kyurem extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.tags = [game_1.CardTag.TEAM_PLASMA];
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Frost Spear',
                cost: [W, C],
                damage: 30,
                text: 'Does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Blizzard Burn',
                cost: [W, W, C],
                damage: 120,
                text: 'This Pokémon can\'t attack during your next turn.'
            },
        ];
        this.set = 'PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Kyurem';
        this.fullName = 'Kyurem PLF';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect) {
            if ((0, prefabs_1.HAS_MARKER)(this.ATTACK_USED_MARKER, effect.player, this) || (0, prefabs_1.HAS_MARKER)(this.ATTACK_USED_2_MARKER, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
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
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        return state;
    }
}
exports.Kyurem = Kyurem;

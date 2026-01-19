"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoseradeGL = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RoseradeGL extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Poison Bind',
                cost: [C],
                damage: 10,
                text: 'The Defending Pokémon is now Poisoned and can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Long Whip',
                cost: [G, C],
                damage: 30,
                text: 'If the Defending Pokémon is affected by any Special Conditions, you may do 30 damage to any 1 Benched Pokémon instead. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'RR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Roserade GL';
        this.fullName = 'Roserade GL RR';
    }
    reduceEffect(store, state, effect) {
        // Poison Bind
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_2.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        // Long Whip
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.specialConditions.length > 0) {
                state = store.prompt(state, new game_1.SelectOptionPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, [
                    'Do 30 damage to opponent\'s active',
                    'Do 30 damage to 1 of the opponent\'s benched Pokémon',
                    'Do 30 damage to your own benched Pokémon'
                ], {
                    allowCancel: false,
                    defaultValue: 0
                }), choice => {
                    if (choice === 0) {
                        return state;
                    }
                    else if (choice === 1) {
                        (0, attack_effects_2.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(30, effect, store, state);
                    }
                    else if (choice === 2) {
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH]), selected => {
                            const target = selected[0];
                            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                            damageEffect.target = target;
                            store.reduceEffect(state, damageEffect);
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.RoseradeGL = RoseradeGL;

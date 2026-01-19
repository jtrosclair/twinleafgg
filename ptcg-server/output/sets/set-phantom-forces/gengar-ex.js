"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GengarEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GengarEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 170;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Night Attack',
                cost: [C],
                damage: 0,
                text: 'Put 3 damage counters on 1 of your opponent\'s Pokémon.'
            }, {
                name: 'Dark Corridor',
                cost: [P, C, C],
                damage: 60,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. Switch this Pokémon with 1 of your Benched Pokémon.'
            },
        ];
        this.set = 'PHF';
        this.name = 'Gengar-EX';
        this.fullName = 'Gengar-EX PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
    }
    reduceEffect(store, state, effect) {
        // Night Attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        // Dark Corridor
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
        }
        return state;
    }
}
exports.GengarEx = GengarEx;

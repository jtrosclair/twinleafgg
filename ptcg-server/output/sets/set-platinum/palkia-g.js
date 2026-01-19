"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PalkiaG = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PalkiaG extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Splashing Turn',
                cost: [W, C],
                damage: 20,
                text: 'You may switch Palkia G with 1 of your Benched Pokémon.'
            },
            {
                name: 'Pearl Breath',
                cost: [W, C, C],
                damage: 50,
                text: 'Does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Palkia G';
        this.fullName = 'Palkia G PL';
    }
    reduceEffect(store, state, effect) {
        // Splashing Turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
                }
            });
        }
        // Pearl Breath
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList !== opponent.active) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.PalkiaG = PalkiaG;

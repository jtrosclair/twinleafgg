"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiningVolcanion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ShiningVolcanion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Dual Pump',
                cost: [W, W, W],
                damage: 0,
                text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Quad Smash',
                cost: [C, C, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 50 damage for each heads.'
            }];
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Shining Volcanion';
        this.fullName = 'Shining Volcanion SLG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 50, targets);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 4, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.ShiningVolcanion = ShiningVolcanion;

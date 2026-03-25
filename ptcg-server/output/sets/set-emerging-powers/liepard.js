"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Liepard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Liepard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Purrloin';
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Feint Attack',
                cost: [D],
                damage: 0,
                text: 'Does 30 damage to 1 of your opponent\'s Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on that Pokémon.'
            },
            {
                name: 'Claw Rend',
                cost: [D, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon already has any damage counters on it, this attack does 30 more damage.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Liepard';
        this.fullName = 'Liepard EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                const target = targets[0];
                target.damage += 30;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Liepard = Liepard;

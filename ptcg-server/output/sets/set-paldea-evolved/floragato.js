"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Floragato = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Floragato extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sprigatito';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 90;
        this.retreat = [game_1.CardType.COLORLESS];
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.attacks = [
            {
                name: 'Seed Bomb',
                cost: [game_1.CardType.GRASS],
                damage: 30,
                text: ''
            },
            {
                name: 'Magic Whip',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 50,
                text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
            }
        ];
        this.set = 'PAL';
        this.name = 'Floragato';
        this.fullName = 'Floragato PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.regulationMark = 'G';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Legacy implementation:
            // - Set a `magicWhip` flag on attack use and switched on EndTurnEffect.
            // - Used a custom ChoosePokemonPrompt where the opponent chose their replacement Active.
            //
            // Converted to prefab version (SWITCH_OUT_OPPONENT_ACTIVE_POKEMON).
            return (0, prefabs_1.SWITCH_OUT_OPPONENT_ACTIVE_POKEMON)(store, state, effect.player, { allowCancel: false });
        }
        return state;
    }
}
exports.Floragato = Floragato;

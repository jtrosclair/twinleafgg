"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChienPao = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ChienPao extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Strafe',
                cost: [D],
                damage: 20,
                text: 'You may switch this Pokemon with 1 of your Benched Pokemon.'
            },
            {
                name: 'Rising Blade',
                cost: [D, D, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokemon is a Pokemon ex, this attack does 80 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.usSetNumber = 'POR 54';
        this.name = 'Chien-Pao';
        this.fullName = 'Chien-Pao M3';
    }
    reduceEffect(store, state, effect) {
        // Strafe - optional switch
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToUse => {
                if (wantToUse) {
                    (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
                }
            });
        }
        // Rising Blade - extra damage vs ex Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && (opponentActive.tags.includes(game_1.CardTag.POKEMON_ex))) {
                effect.damage = 80 + 80;
            }
        }
        return state;
    }
}
exports.ChienPao = ChienPao;

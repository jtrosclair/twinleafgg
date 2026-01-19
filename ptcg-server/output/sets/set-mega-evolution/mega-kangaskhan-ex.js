"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaKangaskhanex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class MegaKangaskhanex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.hp = 300;
        this.cardType = C;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Run Errand',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may use this Ability. Draw 2 cards. You can\'t use more than 1 Run Errand Ability each turn.'
            }];
        this.attacks = [{
                name: 'Rapid-Fire Combo',
                cost: [C, C, C],
                damage: 200,
                damageCalculation: '+',
                text: 'Flip a coin until you get tails. This attack does 50 more damage for each heads.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Mega Kangaskhan ex';
        this.fullName = 'Mega Kangaskhan ex M1S';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.usedRunErrand = false;
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.usedRunErrand === true) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.DRAW_CARDS)(player, 2);
            player.usedRunErrand = true;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    effect.damage += 50 * heads;
                    return state;
                });
            };
            return flipCoin();
        }
        return state;
    }
}
exports.MegaKangaskhanex = MegaKangaskhanex;

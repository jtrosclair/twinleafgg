"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegigigasVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RegigigasVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Regigigas V';
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.cardType = C;
        this.hp = 300;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Star Guardian',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'During your turn, if your opponent has exactly 1 Prize card remaining, you may choose 1 of your opponent\'s Benched Pokémon. They discard that Pokémon and all attached cards. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.attacks = [{
                name: 'Giga Impact',
                cost: [C, C, C],
                damage: 230,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'F';
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '114';
        this.name = 'Regigigas VSTAR';
        this.fullName = 'Regigigas VSTAR CRZ';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (opponent.getPrizeLeft() !== 1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.usedVSTAR == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            //Add bench check
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.moveTo(opponent.discard);
                    player.usedVSTAR = true;
                });
                return state;
            });
        }
        // Giga Impact
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.RegigigasVSTAR = RegigigasVSTAR;

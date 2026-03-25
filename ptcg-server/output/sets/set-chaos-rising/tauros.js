"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tauros = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tauros extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 130;
        this.cardType = C;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Crowd Targeting',
                cost: [C, C],
                damage: 0,
                damageCalculation: 'x',
                text: 'Choose 1 of your opponent\'s Pokemon. Flip a coin for each of your Pokemon that has "Tauros" in its name. This attack does 50 damage for each heads to that Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Tauros';
        this.fullName = 'Tauros M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let taurosCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card && card.name.includes('Tauros'))
                    taurosCount++;
            });
            const hasOpponentPokemon = opponent.active.cards.length > 0 || opponent.bench.some(b => b.cards.length > 0);
            if (!hasOpponentPokemon)
                return state;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length === 0)
                    return state;
                return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, taurosCount, results => {
                    const damage = 50 * results.filter(r => r).length;
                    if (damage > 0) {
                        (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, damage, targets);
                    }
                });
            });
        }
        return state;
    }
}
exports.Tauros = Tauros;

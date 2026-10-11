"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnglishPalkia20 = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// Printed text: https://api.tcgdex.net/v2/en/cards/30th-020
class EnglishPalkia20 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 130;
        this.cardType = game_1.CardType.WATER;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.regulationMark = 'J';
        this.set = '30C';
        this.setNumber = '20';
        this.usSetNumber = '30C 20';
        this.name = 'Palkia';
        this.fullName = 'Palkia 30C';
        this.cardImage = 'assets/cardback.png';
        this.attacks = [{
                name: 'Wormhole', cost: [game_1.CardType.WATER, game_1.CardType.WATER, game_1.CardType.COLORLESS], damage: 100,
                text: "Switch this Pokémon with 1 of your Benched Pokémon. If you do, switch out your opponent's Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)"
            }];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (!player.bench.some(b => b.cards.length > 0)) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    return;
                }
                player.switchPokemon(selected[0], store, state);
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, game_1.StateUtils.getOpponent(state, player));
            });
        }
        return state;
    }
}
exports.EnglishPalkia20 = EnglishPalkia20;

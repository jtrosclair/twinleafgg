"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dewgong = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dewgong extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Seel';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Tail Whap',
                cost: [C, C],
                damage: 60,
                text: ''
            },
            {
                name: 'Dual Blizzard',
                cost: [C, C, C],
                damage: 0,
                text: 'Discard 2 Energy from this Pokémon. This attack does 60 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Dewgong';
        this.fullName = 'Dewgong UNB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count all Pokémon in play (active + bench with cards)
            const opponentTargets = [opponent.active, ...opponent.bench].filter(p => p.cards.length > 0);
            const numTargets = opponentTargets.length;
            const minMax = numTargets >= 2 ? 2 : 1;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: minMax, max: minMax, allowCancel: false }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 60, targets);
            });
        }
        return state;
    }
}
exports.Dewgong = Dewgong;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dartrix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dartrix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rowlet';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Leafage',
                cost: [G],
                damage: 10,
                text: ''
            },
            {
                name: 'Phaser Shot',
                cost: [C, C, C],
                damage: 0,
                text: 'Discard all Energy attached to this Pokemon. Choose 1 of your opponent\'s Pokemon. This attack does 90 damage to that Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.usSetNumber = 'POR 11';
        this.name = 'Dartrix';
        this.fullName = 'Dartrix M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard all energy from this Pokemon
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
            // Check if opponent has any Pokemon
            const hasPokemon = opponent.active.cards.length > 0 ||
                opponent.bench.some(b => b.cards.length > 0);
            if (!hasPokemon) {
                return state;
            }
            // Prompt to choose 1 opponent Pokemon (active or bench)
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 90, targets);
            });
        }
        return state;
    }
}
exports.Dartrix = Dartrix;

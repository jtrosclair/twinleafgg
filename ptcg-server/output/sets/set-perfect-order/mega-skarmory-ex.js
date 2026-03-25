"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaSkarmoryex = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaSkarmoryex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 260;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Sonic Ripper',
                cost: [M, M, C],
                damage: 0,
                text: 'Shuffle all Energy from this Pokemon into your deck. This attack does 220 damage to 1 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)',
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Skarmory ex';
        this.fullName = 'Mega Skarmory ex M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Get all energy cards from this Pokemon
            const energyCards = [...player.active.energies.cards];
            // Move all energy cards to deck
            if (energyCards.length > 0) {
                player.active.energies.moveCardsTo(energyCards, player.deck);
            }
            // Shuffle the deck
            state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
            // Deal 220 damage to 1 of opponent's Pokemon
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 220, targets);
            });
        }
        return state;
    }
}
exports.MegaSkarmoryex = MegaSkarmoryex;

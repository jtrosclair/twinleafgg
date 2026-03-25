"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Excadrill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Excadrill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drilbur';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Tunnel Strike',
                cost: [F],
                damage: 0,
                text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Dig Uppercut',
                cost: [F, F],
                damage: 50,
                text: 'Put a card from your discard pile into your hand.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '56';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Excadrill';
        this.fullName = 'Excadrill DEX';
    }
    reduceEffect(store, state, effect) {
        // Tunnel Strike - 30 damage to benched
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(30, effect, store, state);
            }
        }
        // Dig Uppercut - put a card from discard to hand
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.discard.cards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false }), (selected) => {
                const cards = selected || [];
                if (cards.length > 0) {
                    player.discard.moveCardsTo(cards, player.hand);
                }
            });
        }
        return state;
    }
}
exports.Excadrill = Excadrill;

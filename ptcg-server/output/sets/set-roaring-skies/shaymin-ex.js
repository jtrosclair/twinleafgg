"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShayminEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ShayminEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Set Up',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you put this Pokemon from your hand onto your Bench, ' +
                    'you may draw cards until you have 6 cards in your hand.',
            },
        ];
        this.attacks = [
            {
                name: 'Sky Return',
                cost: [C, C],
                damage: 30,
                text: 'Return this Pokemon and all cards attached to it to your hand.',
            },
        ];
        this.set = 'ROS';
        this.name = 'Shaymin-EX';
        this.fullName = 'Shaymin EX ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const cards = player.hand.cards.filter((c) => c !== this);
            const cardsToDraw = Math.max(0, 6 - cards.length);
            if (cardsToDraw === 0) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), (wantToUse) => {
                if (wantToUse) {
                    (0, prefabs_1.ABILITY_USED)(player, this);
                    player.deck.moveTo(player.hand, cardsToDraw);
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, attack_effects_1.PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND)(store, state, effect);
            return state;
        }
        return state;
    }
}
exports.ShayminEx = ShayminEx;

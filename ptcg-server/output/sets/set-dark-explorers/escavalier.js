"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Escavalier = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Escavalier extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Karrablast';
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Joust',
                cost: [M],
                damage: 30,
                text: 'Before doing damage, discard a Pokémon Tool card attached to the Defending Pokémon.'
            },
            {
                name: 'Cavalry Lance',
                cost: [M, M, C],
                damage: 70,
                text: 'During your opponent\'s next turn, this Pokémon has no Weakness.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '74';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Escavalier';
        this.fullName = 'Escavalier DEX';
        this.NO_WEAKNESS_MARKER = 'ESCAVALIER_NO_WEAKNESS_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Joust - discard Tool before damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent's active has a tool attached
            if (opponent.active.tools.length > 0) {
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { min: 1, max: 1, allowCancel: false }), selected => {
                    const cards = selected || [];
                    if (cards.length > 0) {
                        opponent.active.moveCardsTo(cards, opponent.discard);
                    }
                });
            }
        }
        // Cavalry Lance - add no weakness marker
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.ADD_MARKER)(this.NO_WEAKNESS_MARKER, player.active, this);
        }
        // Check weakness - remove if marker present
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            const cardList = effect.target;
            if ((0, prefabs_1.HAS_MARKER)(this.NO_WEAKNESS_MARKER, cardList, this)) {
                effect.weakness = [];
            }
        }
        // Cleanup marker at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            // When opponent's turn ends, remove marker from our Pokémon
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                (0, prefabs_1.REMOVE_MARKER)(this.NO_WEAKNESS_MARKER, cardList, this);
            });
        }
        return state;
    }
}
exports.Escavalier = Escavalier;

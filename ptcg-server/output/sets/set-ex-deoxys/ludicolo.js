"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ludicolo = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ludicolo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lombre';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Swing Dance',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may draw a card. This power can\'t be used if Ludicolo is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Water Healing Steps',
                cost: [W],
                damage: 30,
                text: 'You may discard as many cards as you like from your hand. If you do, remove that many damage counters from Ludicolo.'
            },
            {
                name: 'Circular Steps',
                cost: [W, C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage times the number of Pokémon in play (both yours and your opponent\'s), excluding Ludicolo.'
            }
        ];
        this.set = 'DX';
        this.setNumber = '10';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ludicolo';
        this.fullName = 'Ludicolo DX';
        this.SWING_DANCE_MARKER = 'SWING_DANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Handle Swing Dance Poké-Power
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.SWING_DANCE_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (!prefabs_1.IS_POKEPOWER_BLOCKED) {
                // Check if Ludicolo is affected by a Special Condition
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        if (cardList.specialConditions.length > 0) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                        }
                    }
                });
                prefabs_1.ABILITY_USED(player, this);
                prefabs_1.ADD_MARKER(this.SWING_DANCE_MARKER, player, this);
                // Draw a card
                prefabs_1.DRAW_CARDS(player, 1);
            }
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.SWING_DANCE_MARKER, this);
        // Handle Water Healing Steps attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const active = player.active;
            if (!active) {
                return state;
            }
            // Allow player to discard any number of cards
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 0, max: player.hand.cards.length, allowCancel: false }), transfers => {
                if (!transfers || transfers.length === 0) {
                    return state;
                }
                // Discard the cards
                for (const transfer of transfers) {
                    prefabs_1.MOVE_CARDS(store, state, player.hand, player.discard, { cards: [transfer] });
                }
                // Remove damage counters equal to number of cards discarded
                const damageToRemove = transfers.length * 10;
                const healEffect = new game_effects_1.HealEffect(player, player.active, damageToRemove);
                state = store.reduceEffect(state, healEffect);
                return state;
            });
        }
        // Handle Circular Steps attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count all Pokémon in play except Ludicolo
            let pokemonCount = 0;
            // Count opponent's Pokémon
            if (opponent.active)
                pokemonCount++;
            pokemonCount += opponent.bench.filter(b => b.cards.length > 0).length;
            // Count player's Pokémon
            if (player.active && player.active !== effect.source)
                pokemonCount++;
            pokemonCount += player.bench.filter(b => b.cards.length > 0).length;
            effect.damage = pokemonCount * 10;
        }
        return state;
    }
}
exports.Ludicolo = Ludicolo;

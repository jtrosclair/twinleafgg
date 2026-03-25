"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KartanaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class KartanaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ULTRA_BEAST, card_types_1.CardTag.POKEMON_GX];
        this.wantsToShuffle = false;
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Slice Off',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may discard a Special Energy from 1 of your opponent\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Gale Blade',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'You may shuffle this Pokemon and all cards attached to it into your deck.'
            },
            {
                name: 'Blade-GX',
                cost: [card_types_1.CardType.METAL],
                damage: 0,
                gxAttack: true,
                text: 'Take a prize card. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'CIN';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kartana-GX';
        this.fullName = 'Kartana-GX CIN';
    }
    reduceEffect(store, state, effect) {
        // Slice Off
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let hasPokemonWithEnergy = false;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY &&
                    c.energyType === card_types_1.EnergyType.SPECIAL)) {
                    hasPokemonWithEnergy = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasPokemonWithEnergy) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    let targets = [];
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
                        targets = results || [];
                        const target = targets[0];
                        let cards = [];
                        return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                            cards = selected;
                            (0, prefabs_1.MOVE_CARDS)(store, state, target, opponent.discard, { cards, sourceCard: this, sourceEffect: this.powers[0] });
                        });
                    });
                }
            });
        }
        // Gale Blade - ask during attack, shuffle after
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                this.wantsToShuffle = wantToUse;
            });
        }
        // Gale Blade - shuffle after attack if chosen
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.wantsToShuffle) {
            this.wantsToShuffle = false;
            return (0, attack_effects_1.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK)(store, state, effect);
        }
        // Clean up flag at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.wantsToShuffle = false;
        }
        // Blade-GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            // set GX attack as used for game
            player.usedGX = true;
            return (0, prefabs_1.TAKE_X_PRIZES)(store, state, player, 1);
        }
        return state;
    }
}
exports.KartanaGX = KartanaGX;

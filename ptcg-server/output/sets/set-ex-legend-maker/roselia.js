"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roselia = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Roselia extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Reactive Aroma',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Roselia has any React Energy cards attached to it, remove 1 damage counter from each of your Pokémon (excluding Pokémon-ex) that has any React Energy cards attached to it between turns. You can\'t use more than 1 Reactive Aroma Poké-Body each turn.'
            }];
        this.attacks = [{
                name: 'Flick Poison',
                cost: [C],
                damage: 0,
                text: 'Switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch. The new Defending Pokémon is now Poisoned.'
            }];
        this.set = 'LM';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Roselia';
        this.fullName = 'Roselia LM';
    }
    reduceEffect(store, state, effect) {
        // Handle Healing Stone Poké-Body
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            let hasReactRose = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this && cardList.cards.some(card => card.name === 'React Energy')) {
                    hasReactRose = true;
                }
            });
            if (hasReactRose) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (cardList.cards.some(card => card.name === 'React Energy') && !card.tags.includes(game_1.CardTag.POKEMON_ex)) {
                        const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                        state = store.reduceEffect(state, healEffect);
                    }
                });
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                opponent.switchPokemon(cardList);
                (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
            });
        }
        return state;
    }
}
exports.Roselia = Roselia;

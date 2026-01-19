"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Milotic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Milotic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Feebas';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Healing Shower',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Milotic from your hand to evolve 1 of your Pokémon, you may remove all damage counters from all of your Pokémon and your opponent\'s Pokémon (excluding Pokémon-ex).'
            }];
        this.attacks = [{
                name: 'Wave Splash',
                cost: [W, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Distorted Wave',
                cost: [W, W, C, C],
                damage: 80,
                text: 'Before doing damage, remove 3 damage counters from the Defending Pokémon (all if there are less than 3).'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Milotic';
        this.fullName = 'Milotic HL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !(0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, wantToUse => {
                if (wantToUse) {
                    const player = effect.player;
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    let hasDamagedPokemon = false;
                    const damagedPokemon = [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        if (cardList.damage > 0) {
                            hasDamagedPokemon = true;
                            damagedPokemon.push({ target, damage: cardList.damage });
                        }
                    });
                    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                        if (cardList.damage > 0) {
                            hasDamagedPokemon = true;
                            damagedPokemon.push({ target, damage: cardList.damage });
                        }
                    });
                    if (!hasDamagedPokemon) {
                        return state;
                    }
                    // Heal all damage
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                        var _a;
                        if (!((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                            const healEffect = new game_effects_1.HealEffect(player, cardList, cardList.damage);
                            state = store.reduceEffect(state, healEffect);
                        }
                    });
                    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                        var _a;
                        if (!((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                            const healEffect = new game_effects_1.HealEffect(opponent, cardList, cardList.damage);
                            state = store.reduceEffect(state, healEffect);
                        }
                    });
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const healEffect = new game_effects_1.HealEffect(effect.opponent, effect.opponent.active, 30);
            state = store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Milotic = Milotic;

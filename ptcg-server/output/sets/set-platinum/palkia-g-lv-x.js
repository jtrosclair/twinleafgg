"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PalkiaGLVX = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class PalkiaGLVX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LV_X;
        this.evolvesFrom = 'Palkia G';
        this.cardType = W;
        this.tags = [card_types_1.CardTag.POKEMON_LV_X, card_types_1.CardTag.POKEMON_SP];
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'LV.X Rule',
                powerType: game_1.PowerType.LV_X_RULE,
                text: 'Put this card onto your Active Palkia G. Palkia G LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
            },
            {
                name: 'Lost Cyclone',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may use this power. Any player who has 4 or more Benched Pokémon chooses 3 of his or her Benched Pokémon. Put the other Benched Pokémon and all cards attached to them in the Lost Zone. (You choose your Pokémon first.) This power can\'t be used it Palkia G is affected by a Special Condition.'
            }
        ];
        this.attacks = [{
                name: 'Hydro Shot',
                cost: [W, W, C, C],
                damage: 80,
                text: 'Discard 2 Energy attached to Palkia G. Choose 1 of your opponent\'s Pokémon. This attack does 80 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.name = 'Palkia G';
        this.fullName = 'Palkia G LV.X PL';
        this.LOST_CYCLONE_MARKER = 'LOST_CYCLONE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Lost Cyclone
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.LOST_CYCLONE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const playerBench = player.bench.filter(c => c.cards.length > 0);
            const opponentBench = opponent.bench.filter(c => c.cards.length > 0);
            if (playerBench.length <= 3 && opponentBench.length <= 3) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.marker.addMarker(this.LOST_CYCLONE_MARKER, this);
            if (playerBench.length > 3) {
                store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: 3, max: 3 }), targets => {
                    if (!targets || targets.length === 0) {
                        return;
                    }
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                        if (card !== player.active && !targets.includes(card)) {
                            card.clearEffects();
                            (0, prefabs_1.MOVE_CARDS)(store, state, card, player.lostzone);
                        }
                    });
                });
            }
            if (opponentBench.length > 3) {
                store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: 3, max: 3 }), targets => {
                    if (!targets || targets.length === 0) {
                        return;
                    }
                    opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                        if (card !== opponent.active && !targets.includes(card)) {
                            card.clearEffects();
                            (0, prefabs_1.MOVE_CARDS)(store, state, card, opponent.lostzone);
                        }
                    });
                });
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.LOST_CYCLONE_MARKER, this)) {
            effect.player.marker.removeMarker(this.LOST_CYCLONE_MARKER, this);
        }
        // Hydro Shot
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(80, effect, store, state);
        }
        // making sure it gets put on the active pokemon
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target !== effect.player.active) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Trying to get all of the previous stage's attacks and powers
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                    player.showAllStageAbilities = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // Add attacks from the previous stage to this one
            for (const evolutionCard of cardList.cards) {
                if (evolutionCard.superType === card_types_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
                    effect.attacks.push(...(evolutionCard.attacks || []));
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // Adds the powers from the previous stage
            for (const evolutionCard of cardList.cards) {
                if (evolutionCard.superType === card_types_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
                    effect.powers.push(...(evolutionCard.powers || []));
                }
            }
        }
        return state;
    }
}
exports.PalkiaGLVX = PalkiaGLVX;

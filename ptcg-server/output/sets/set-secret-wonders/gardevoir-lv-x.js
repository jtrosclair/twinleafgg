"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardevoirLVX = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GardevoirLVX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LV_X;
        this.evolvesFrom = 'Gardevoir';
        this.cardType = P;
        this.tags = [card_types_1.CardTag.POKEMON_LV_X];
        this.hp = 130;
        this.weakness = [{ type: D }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'LV.X Rule',
                powerType: game_1.PowerType.LV_X_RULE,
                text: 'Put this card onto your Active Gardevoir. Gardevoir LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
            },
            {
                name: 'Teleportation',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), choose 1 of your Active Pokémon or 1 or your Benched Pokémon and switch Gardevoir with that Pokémon. This power can\'t be used if Gardevoir is affected by a Special Condition.'
            }
        ];
        this.attacks = [{
                name: 'Bring Down',
                cost: [P, P],
                damage: 0,
                text: 'Choose 1 Pokémon (yours or your opponent\'s) with the fewest remaining HP (excluding Gardevoir) and that Pokémon is now Knocked Out.'
            }];
        this.set = 'SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '131';
        this.name = 'Gardevoir';
        this.fullName = 'Gardevoir LV.X SW';
        this.TELEPORTATION_MARKER = 'TELEPORTATION_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Teleportation
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.TELEPORTATION_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.getPokemonCard() === this) {
                player.marker.addMarker(this.TELEPORTATION_MARKER, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            }
            else {
                let bench = new game_1.PokemonCardList;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (card === this && target.slot === game_1.SlotType.BENCH) {
                        bench = cardList;
                    }
                });
                player.marker.addMarker(this.TELEPORTATION_MARKER, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                player.switchPokemon(bench);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.TELEPORTATION_MARKER, this)) {
            effect.player.marker.removeMarker(this.TELEPORTATION_MARKER, this);
        }
        // Bring Down
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            let leastHP = 9999999999999999;
            // figuring out which pokemon actually has the least hp
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card !== player.active) {
                    const hpCheck = new check_effects_1.CheckHpEffect(player, card);
                    if (hpCheck.hp < leastHP) {
                        leastHP = hpCheck.hp;
                    }
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                const hpCheck = new check_effects_1.CheckHpEffect(opponent, card);
                if (hpCheck.hp < leastHP) {
                    leastHP = hpCheck.hp;
                }
            });
            // making sure it gets put on the active pokemon
            if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
                if (effect.target !== effect.player.active) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
            }
            // eliminating the pokemon that don't have the least hp from being chosen
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                const hpCheck = new check_effects_1.CheckHpEffect(player, list);
                if (list === player.active) {
                    blockedTo.push(target);
                }
                else if (hpCheck.hp !== leastHP) {
                    blockedTo.push(target);
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                const hpCheck = new check_effects_1.CheckHpEffect(opponent, list);
                if (hpCheck.hp !== leastHP) {
                    blockedTo.push(target);
                }
            });
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, blocked: blockedTo }), target => {
                const damageEffect = new game_effects_1.KnockOutEffect(player, target[0]);
                store.reduceEffect(state, damageEffect);
            });
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
exports.GardevoirLVX = GardevoirLVX;

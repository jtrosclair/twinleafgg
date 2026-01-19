"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiratinaLVX = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GiratinaLVX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LV_X;
        this.evolvesFrom = 'Giratina';
        this.cardType = P;
        this.tags = [card_types_1.CardTag.POKEMON_LV_X];
        this.hp = 130;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [
            {
                name: 'LV.X Rule',
                powerType: game_1.PowerType.LV_X_RULE,
                text: 'Put this card onto your Active Giratina. Giratina LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
            },
            {
                name: 'Invisible Tentacles',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Whenever your opponent\'s Pokémon tries to attack, your opponent discards 1 card from his or her hand. (If your opponent can\'t discard 1 card, your opponent\'s Pokémon can\'t attack.) You can\'t use more than 1 Invisible Tentacles Poké-Body each turn.'
            }
        ];
        this.attacks = [{
                name: 'Darkness Lost',
                cost: [P, P, C, C],
                damage: 0,
                text: 'This attack does 30 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) If any of your opponent\'s Pokémon would be Knocked Out by damage from this attack, put that Pokémon and all cards attached to it in the Lost Zone instead of discarding it.'
            }];
        this.set = 'PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.name = 'Giratina';
        this.fullName = 'Giratina LV.X PL';
        this.DARKNESS_LOST_MARKER = 'DARKNESS_LOST_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Invisible Tentacles
        if (effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (player === owner) {
                return state;
            }
            let isGiratinaInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card.getPokemonCard() === this) {
                    isGiratinaInPlay = true;
                }
            });
            if (!isGiratinaInPlay) {
                return state;
            }
            if (effect.invisibleTentacles) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, opponent, this)) {
                return state;
            }
            if (player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                if (selected) {
                    effect.invisibleTentacles = true;
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards: selected });
                }
            });
        }
        // Darkness Lost
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card !== opponent.active) {
                    const damage = new attack_effects_1.PutDamageEffect(effect, 30);
                    damage.target = card;
                    store.reduceEffect(state, damage);
                    card.marker.addMarker(this.DARKNESS_LOST_MARKER, this);
                }
            });
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.marker.hasMarker(this.DARKNESS_LOST_MARKER, this)) {
            // just using the already existing code for lost city because i can't be bothered to do an engine change
            effect.target.marker.addMarker('LOST_CITY_MARKER', this);
        }
        // removing the marker
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.forEachPokemon(game_1.PlayerType.ANY, card => {
                if (card.marker.hasMarker(this.DARKNESS_LOST_MARKER, this)) {
                    card.marker.removeMarker(this.DARKNESS_LOST_MARKER, this);
                }
            });
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
exports.GiratinaLVX = GiratinaLVX;

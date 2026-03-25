"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootFossil = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RootFossil extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.COLORLESS;
        this.cardTypez = game_1.CardType.COLORLESS;
        this.movedToActiveThisTurn = false;
        this.pokemonType = game_1.PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.cardTag = [];
        this.tools = [];
        this.evolvesTo = [];
        this.evolvesToStage = [];
        this.archetype = [];
        this.hp = 40;
        this.weakness = [];
        this.retreat = [];
        this.resistance = [];
        this.attacks = [];
        this.attacksThisTurn = 0;
        this.maxAttacksThisTurn = 1;
        this.allowSubsequentAttackChoice = false;
        this.evolvesFromBase = [];
        this.maxTools = 1;
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Root Fossil';
        this.fullName = 'Root Fossil SS';
        this.powers = [{
                name: 'Root Fossil',
                text: 'Play Root Fossil as if it were a Basic Pokémon. While in play, Root Fossil counts as a [C] Pokémon (instead of a Trainer card). Root Fossil has no attacks of its own, can\'t retreat, and can\'t be affected by any Special Conditions. If Root Fossil is Knocked Out, it doesn\'t count as a Knocked Out Pokémon. (Discard it anyway.) At any time during your turn before your attack, you may discard Root Fossil from play.',
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                isFossil: true,
                powerType: game_1.PowerType.TRAINER_ABILITY
            },
            {
                name: 'Spongy Stone',
                text: 'At any time between turns, remove 1 damage counter from Root Fossil.',
                powerType: game_1.PowerType.POKEBODY,
                isFossil: true,
            }];
    }
    // public text =
    //   'Play Root Fossil as if it were a Basic Pokémon. While in play, Root Fossil counts as a Pokémon (instead of a Trainer card). Root Fossil has no attacks, can\'t retreat, and can\'t be Asleep, Confused, Paralyzed, or Poisoned. If Root Fossil is Knocked Out, it doesn\'t count as a Knocked Out Pokémon. (Discard it anyway.)';
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const cardList = effect.player.active;
            const player = effect.player;
            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: effect.player.name, card: this.name });
            if (player.bench.every(b => b.cards.length === 0)) {
                // technical implementation does not matter exactly because this ends the game
                effect.player.active.moveCardsTo(effect.player.active.cards, player.deck);
            }
            else {
                player.switchPokemon(cardList);
                const mysteriousFossilCardList = game_1.StateUtils.findCardList(state, this);
                mysteriousFossilCardList.moveCardsTo(mysteriousFossilCardList.cards.filter(c => c === this), effect.player.discard);
                mysteriousFossilCardList.moveCardsTo(mysteriousFossilCardList.cards.filter(c => c !== this), effect.player.discard);
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.getPokemonCard() === this) {
            effect.prizeCount = 0;
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.trainerCard === this) {
            const player = effect.player;
            const emptySlots = player.bench.filter(b => b.cards.length === 0);
            if (emptySlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const playPokemonEffect = new play_card_effects_1.PlayPokemonEffect(player, this, emptySlots[0]);
            store.reduceEffect(state, playPokemonEffect);
        }
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
            effect.preventDefault = true;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.player.active.getPokemonCard() === this) {
            effect.prizeCount = 0;
            return state;
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.getPokemonCard() === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_RETREAT);
        }
        // Spongy Stone
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.ANY, cardList => {
                if (cardList.getPokemonCard() === this) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                    state = store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.RootFossil = RootFossil;

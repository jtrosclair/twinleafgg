"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiqueSailFossil = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AntiqueSailFossil extends game_1.TrainerCard {
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
        this.hp = 60;
        this.weakness = [];
        this.retreat = [];
        this.resistance = [];
        this.attacks = [];
        this.attacksThisTurn = 0;
        this.maxAttacksThisTurn = 1;
        this.allowSubsequentAttackChoice = false;
        this.evolvesFromBase = [];
        this.maxTools = 1;
        this.powers = [{
                name: 'Antique Sail Fossil',
                text: 'You may play this card as a 60 HP Basic [C] Pokemon. This Pokemon can\'t be affected by Special Conditions and can\'t retreat. At any time during your turn, you may discard this card from play.',
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                isFossil: true,
                powerType: game_1.PowerType.TRAINER_ABILITY
            },
            {
                name: 'Protective Sail',
                powerType: game_1.PowerType.ABILITY,
                isFossil: true,
                text: 'This Pokemon can\'t be affected by the effects of Supporter cards played from your opponent\'s hand.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Antique Sail Fossil';
        this.fullName = 'Antique Sail Fossil M3';
    }
    reduceEffect(store, state, effect) {
        // Discard from play
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: this.name, effect: 'Antique Sail Fossil' });
            const cardList = game_1.StateUtils.findCardList(state, this);
            cardList.moveCardTo(this, player.discard);
        }
        // Play as Pokemon
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.trainerCard === this) {
            const player = effect.player;
            const emptySlots = player.bench.filter(b => b.cards.length === 0);
            if (emptySlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const playPokemonEffect = new play_card_effects_1.PlayPokemonEffect(player, this, emptySlots[0]);
            store.reduceEffect(state, playPokemonEffect);
        }
        // Prevent retreat
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.getPokemonCard() === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_RETREAT);
        }
        // Prevent special conditions
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
            effect.preventDefault = true;
        }
        // Block Supporter effects from opponent
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard.trainerType === game_1.TrainerType.SUPPORTER) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const player = game_1.StateUtils.findOwner(state, cardList);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Only block if opponent is playing the supporter
            if (effect.player !== opponent) {
                return state;
            }
            // Check if this Pokemon is in play
            if (!cardList || cardList.cards.length === 0) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Prevent the supporter effect
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.AntiqueSailFossil = AntiqueSailFossil;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiqueCoverFossil = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AntiqueCoverFossil extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.superType = card_types_1.SuperType.TRAINER;
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.movedToActiveThisTurn = false;
        this.pokemonType = card_types_1.PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.cardTag = [];
        this.tools = [];
        this.archetype = [];
        this.weakness = [];
        this.retreat = [];
        this.resistance = [];
        this.attacks = [];
        this.attacksThisTurn = 0;
        this.maxAttacksThisTurn = 1;
        this.allowSubsequentAttackChoice = false;
        this.evolvesFromBase = [];
        this.maxTools = 1;
        this.evolvesTo = [];
        this.evolvesToStage = [];
        this.powers = [{
                name: 'Antique Cover Fossil',
                text: `Play this card as if it were a 60-HP [C] Basic Pokémon. This card can't be affected by any Special Conditions and can't retreat.

At any time during your turn, you may discard this card from play.`,
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                isFossil: true,
                powerType: game_1.PowerType.TRAINER_ABILITY
            },
            {
                name: 'Protective Cover',
                powerType: game_1.PowerType.ABILITY,
                isFossil: true,
                text: 'Prevent all effects of attacks used by your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)'
            }];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '129';
        this.name = 'Antique Cover Fossil';
        this.fullName = 'Antique Cover Fossil SCR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const pokeDollCardList = game_1.StateUtils.findCardList(state, this);
            if (player.active.cards[0] !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK, { name: player.name, card: this.name });
            // Move Lillie's Poke Doll to bottom of deck
            state = (0, prefabs_1.MOVE_CARDS)(store, state, pokeDollCardList, player.deck, {
                cards: [this],
                toBottom: true
            });
            // Move any attached cards to discard
            state = (0, prefabs_1.MOVE_CARDS)(store, state, pokeDollCardList, player.discard, {
                cards: pokeDollCardList.cards.filter(c => c !== this)
            });
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
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this)) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_RETREAT);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this)) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_RETREAT);
        }
        // Prevent effects of attacks
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (sourceCard) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const player = game_1.StateUtils.findOwner(state, effect.target);
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                // Allow Weakness & Resistance
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.AntiqueCoverFossil = AntiqueCoverFossil;

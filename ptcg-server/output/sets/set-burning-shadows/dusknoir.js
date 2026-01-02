"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dusknoir = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dusknoir extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dusclops';
        this.cardType = P;
        this.hp = 150;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Dark Invitation',
                powerType: game_2.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may have your opponent reveal their hand. Put a Basic Pokémon you find there onto your opponent\'s Bench, and put 3 damage counters on that Pokémon.'
            }];
        this.attacks = [{
                name: 'Mind Jack',
                cost: [P, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokémon.'
            }];
        this.set = 'BUS';
        this.setNumber = '53';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dusknoir';
        this.fullName = 'Dusknoir BUS';
        this.DARK_INVITATION_MARKER = 'DARK_INVITATION_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const slots = opponent.bench.filter(b => b.cards.length === 0);
            if (slots.length === 0) {
                // No open slots, throw error
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (opponent.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (prefabs_1.HAS_MARKER(this.DARK_INVITATION_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.ADD_MARKER(this.DARK_INVITATION_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
            const min = Math.min(opponent.hand.cards.filter(card => card instanceof game_1.PokemonCard && card.stage === game_1.Stage.BASIC).length, 1);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.hand, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC }, { min, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return;
                }
                cards.forEach((card, index) => {
                    prefabs_1.MOVE_CARDS(store, state, opponent.hand, slots[index], { cards: [card], sourceCard: this });
                    slots[index].pokemonPlayedTurn = state.turn;
                    const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, slots[index]);
                    store.reduceEffect(state, damageEffect);
                    if (damageEffect.target) {
                        damageEffect.target.damage += 30;
                    }
                });
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.DARK_INVITATION_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.damage += (opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0) * 30);
        }
        return state;
    }
}
exports.Dusknoir = Dusknoir;

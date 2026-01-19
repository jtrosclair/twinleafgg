"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banette = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Banette extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shuppet';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Red Eyes',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put a Basic Pokémon from your opponent\'s discard pile onto their Bench.'
            }];
        this.attacks = [{
                name: 'Enemy Show',
                cost: [P, C],
                damage: 0,
                text: 'For each of your opponent\'s Pokémon in play, put 1 damage counter on your opponent\'s Pokémon in any way you like.'
            }];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Banette';
        this.fullName = 'Banette CES';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent's bench is full
            const openSlots = opponent.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                return state;
            }
            if (!opponent.discard.cards.some(c => c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC)) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_OPPONENTS_BASIC_POKEMON_TO_BENCH, opponent.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    const card = cards[0];
                    const slot = openSlots[0];
                    (0, prefabs_1.MOVE_CARDS)(store, state, opponent.discard, slot, { cards: [card], sourceCard: this, sourceEffect: this.powers[0] });
                    slot.pokemonPlayedTurn = state.turn;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(opponentBench + 1, store, state, effect);
        }
        return state;
    }
}
exports.Banette = Banette;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reuniclus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Reuniclus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Duosion';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Summoning Gate',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Look at the top 8 cards of your deck and put any number of Pokémon you find there onto your Bench. Shuffle the other cards into your deck.'
            },
            {
                name: 'Brain Shake',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Reuniclus';
        this.fullName = 'Reuniclus TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0 || openSlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Legacy implementation:
            // - Moved top 8 into a temporary CardList.
            // - Prompted for any number of Pokémon to bench (up to open bench slots).
            // - Shuffled remaining cards back into deck.
            //
            // Converted to prefab version (LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON).
            return (0, prefabs_1.LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON)(store, state, player, 8, openSlots.length, { remainderDestination: 'shuffle' });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Reuniclus = Reuniclus;

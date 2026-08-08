"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bouffalant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bouffalant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ready to Ram',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack ' +
                    '(even if this Pokémon is Knocked Out), put 6 damage counters on the Attacking Pokémon.'
            },
            {
                name: 'Smashing Headbutt',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Discard 2 Energy from this Pokémon.'
            }
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.name = 'Bouffalant';
        this.fullName = 'Bouffalant SSP';
        this.READY_TO_RAM_MARKER = 'BOUFFALANT_SSP_READY_TO_RAM_MARKER';
        this.CLEAR_READY_TO_RAM_MARKER = 'BOUFFALANT_SSP_CLEAR_READY_TO_RAM_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Ready to Ram
        // Ref: set-paradox-rift/magby.ts (Scorching Heater)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            (0, prefabs_1.ADD_MARKER)(this.READY_TO_RAM_MARKER, cardList, this);
            (0, prefabs_1.ADD_MARKER)(this.CLEAR_READY_TO_RAM_MARKER, opponent, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && (0, prefabs_1.HAS_MARKER)(this.READY_TO_RAM_MARKER, effect.target, this)
            && state.phase === game_1.GamePhase.ATTACK) {
            effect.source.damage += 60;
        }
        (0, prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN)(state, effect, this.CLEAR_READY_TO_RAM_MARKER, this.READY_TO_RAM_MARKER, this);
        // Smashing Headbutt
        // Ref: set-journey-together/salamence-ex.ts (Dragon Impact)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Bouffalant = Bouffalant;

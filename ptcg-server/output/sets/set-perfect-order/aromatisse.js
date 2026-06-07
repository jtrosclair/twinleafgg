"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aromatisse = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Aromatisse extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Spritzee';
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Fragrance Collection',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for up to 2 Basic [P] Energy, reveal them, and put them into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Drain Kiss',
                cost: [P, C],
                damage: 50,
                text: 'Heal 30 damage from this Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.usSetNumber = 'POR 36';
        this.name = 'Aromatisse';
        this.fullName = 'Aromatisse M3';
        this.FRAGRANCE_COLLECTION_MARKER = 'FRAGRANCE_COLLECTION_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Fragrance Collection ability
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.FRAGRANCE_COLLECTION_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            player.marker.addMarkerToState(this.FRAGRANCE_COLLECTION_MARKER);
            // Filter deck for Basic Psychic Energy
            const basicPsychicEnergy = player.deck.cards.filter(card => card.superType === game_1.SuperType.ENERGY &&
                card.energyType === game_1.EnergyType.BASIC &&
                card.provides.includes(game_1.CardType.PSYCHIC));
            if (basicPsychicEnergy.length === 0) {
                return state;
            }
            const maxToTake = Math.min(2, basicPsychicEnergy.length);
            let selectedCards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Psychic Energy' }, { min: 0, max: maxToTake, allowCancel: false }), selected => {
                selectedCards = selected || [];
                player.deck.moveCardsTo(selectedCards, player.hand);
                // Show cards to opponent
                if (selectedCards.length > 0) {
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selectedCards), () => state);
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.FRAGRANCE_COLLECTION_MARKER, this);
        // Drain Kiss - heal 30 from this Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, player.active, 30);
            store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Aromatisse = Aromatisse;

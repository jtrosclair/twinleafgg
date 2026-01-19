"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slugma = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slugma extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Slugma';
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Active Volcano',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may discard the top card of your deck. If that card is a [R] Energy card, attach it to Slugma. This power can\'t be used if Slugma is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Combustion',
                cost: [R, R, C],
                damage: 40,
                text: ''
            }];
        this.set = 'UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Slugma';
        this.fullName = 'Slugma UD';
        this.ACTIVE_VOLCANO_MARKER = 'ACTIVE_VOLCANO_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            (0, prefabs_1.REMOVE_MARKER)(this.ACTIVE_VOLCANO_MARKER, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.ACTIVE_VOLCANO_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const temp = new game_1.CardList();
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.ACTIVE_VOLCANO_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.deck.moveTo(temp, 1);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Fire Energy';
            });
            // If no energy cards were drawn, move all cards to discard
            if (energyCardsDrawn.length == 0) {
                (0, prefabs_1.ADD_MARKER)(this.ACTIVE_VOLCANO_MARKER, player, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                temp.cards.slice(0, 1).forEach(card => {
                    store.prompt(state, [new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, temp.cards)], () => {
                        temp.moveTo(player.discard);
                    });
                });
            }
            else {
                // Automatically attach energy to this Pokemon (Slugma)
                (0, prefabs_1.ADD_MARKER)(this.ACTIVE_VOLCANO_MARKER, player, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                const cardList = game_1.StateUtils.findCardList(state, this);
                store.prompt(state, [new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, temp.cards)], () => {
                    energyCardsDrawn.forEach(card => {
                        temp.moveCardTo(card, cardList);
                    });
                });
            }
        }
        return state;
    }
}
exports.Slugma = Slugma;

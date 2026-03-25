"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Moltres extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 100;
        this.weakness = [];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Firegiver',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'When you put Moltres into play during your turn (not during set-up), put from 1 to 4 (chosen at random) Fire Energy cards from your deck into your hand. Shuffle your deck afterward.'
            }];
        this.attacks = [{
                name: 'Dive Bomb',
                cost: [R, R, R],
                damage: 70,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'GB1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'P02';
        this.name = 'Moltres';
        this.fullName = 'Moltres GB1';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !(0, prefabs_1.IS_POKEMON_POWER_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            const randomCount = Math.floor(Math.random() * 4) + 1;
            const fireEnergyInDeck = player.deck.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY && card.name === 'Fire Energy').length;
            const cardsToTake = Math.min(randomCount, fireEnergyInDeck);
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.ENERGY, name: 'Fire Energy' }, { min: cardsToTake, max: cardsToTake });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Moltres = Moltres;

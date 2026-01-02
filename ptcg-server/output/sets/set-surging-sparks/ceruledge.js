"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ceruledge = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ceruledge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charcadet';
        this.hp = 140;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Blaze Curse',
                cost: [C],
                damage: 0,
                text: 'Discard all Special Energy from each of your opponent\'s Pokémon.'
            },
            {
                name: 'Amethyst Rage',
                cost: [R, R, C],
                damage: 160,
                text: 'During your next turn, this Pokémon can\'t attack..'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.name = 'Ceruledge';
        this.fullName = 'Ceruledge SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.text = 'Discard all Special Energy from all of your opponent\'s Pokémon.';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Function to discard special energy and tools from a PokemonCardList
            const discardSpecialEnergy = (pokemonCardList) => {
                const cardsToDiscard = pokemonCardList.cards.filter(card => (card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.SPECIAL));
                if (cardsToDiscard.length > 0) {
                    state = prefabs_1.MOVE_CARDS(store, state, pokemonCardList, opponent.discard, { cards: cardsToDiscard });
                }
            };
            // Discard from active Pokémon
            discardSpecialEnergy(opponent.active);
            // Discard from bench Pokémon
            opponent.bench.forEach(benchPokemon => {
                discardSpecialEnergy(benchPokemon);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        return state;
    }
}
exports.Ceruledge = Ceruledge;

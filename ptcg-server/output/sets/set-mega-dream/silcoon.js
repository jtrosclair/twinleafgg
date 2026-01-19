"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Silcoon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Silcoon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wurmple';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Multiplying Cocoon',
                useWhenInPlay: false,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'You may use this Ability when you play this Pokémon from your hand to evolve 1 of your Pokémon. Search your deck for a Silcoon or a Cascoon and put it onto your Bench. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Tackle',
                cost: [G],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Silcoon';
        this.fullName = 'Silcoon M2a';
    }
    reduceEffect(store, state, effect) {
        // Multiplying Cocoon ability - triggers when played from hand to evolve
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Build blocked array for cards that are not Silcoon or Cascoon
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard) {
                    // Allow only Silcoon or Cascoon
                    if (card.name !== 'Silcoon' && card.name !== 'Cascoon') {
                        blocked.push(index);
                    }
                }
                else {
                    // Block non-Pokémon cards
                    blocked.push(index);
                }
            });
            // Search deck for Silcoon or Cascoon and put onto Bench
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, {}, { min: 0, max: 1, blocked });
        }
        return state;
    }
}
exports.Silcoon = Silcoon;

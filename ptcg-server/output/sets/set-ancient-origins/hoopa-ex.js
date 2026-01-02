"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoopaEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class HoopaEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 170;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Scoundrel Ring',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench, you may search your deck for up to 3 Pokémon-EX (except for Hoopa-EX), reveal them, and put them into your hand. Shuffle your deck afterward.'
            }];
        this.attacks = [{
                name: 'Hyperspace Fury',
                cost: [P, P, P],
                damage: 0,
                text: 'Discard 2 Energy attached to this Pokémon. This attack does 100 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'AOR';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hoopa-EX';
        this.fullName = 'Hoopa EX AOR';
    }
    reduceEffect(store, state, effect) {
        // Scoundrel Ring
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const player = effect.player;
                    const blocked = [];
                    player.deck.cards.forEach((c, index) => {
                        if (!(c instanceof pokemon_card_1.PokemonCard && c.tags.includes(card_types_1.CardTag.POKEMON_EX) && c.name !== this.name)) {
                            blocked.push(index);
                        }
                    });
                    prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 3, blocked });
                }
            });
            return state;
        }
        // Hyperspace Fury
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(100, effect, store, state);
        }
        return state;
    }
}
exports.HoopaEX = HoopaEX;

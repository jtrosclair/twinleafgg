"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clefairy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Clefairy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 50;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Doll Swap',
                cost: [C, C, C],
                damage: 60,
                text: 'Put this Pokémon and all cards attached to it into your hand. If you do, you may play Lillie\'s Poké Doll from your hand as your new Active Pokémon.'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.name = 'Clefairy';
        this.fullName = 'Clefairy CEC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.clearEffects();
            const pokemons = player.active.getPokemons();
            const otherCards = player.active.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard));
            // Move other cards to hand
            if (otherCards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.hand, { cards: otherCards });
            }
            // Move Pokémon to hand
            if (pokemons.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.hand, { cards: pokemons });
            }
            const lilliesPokeDoll = player.hand.cards.find(card => card instanceof game_1.TrainerCard && card.name === 'Lillie\'s Poké Doll');
            // Check if Lillie's Poké Doll is in the player's hand
            if (lilliesPokeDoll && !player.active.getPokemonCard()) {
                (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                    if (result) {
                        const playPokemonEffect = new play_card_effects_1.PlayPokemonEffect(player, lilliesPokeDoll, player.active);
                        store.reduceEffect(state, playPokemonEffect);
                    }
                });
            }
        }
        return state;
    }
}
exports.Clefairy = Clefairy;

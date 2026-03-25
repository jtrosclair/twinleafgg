"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Omanyte = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Omanyte extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mysterious Fossil';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Team Assembly',
                cost: [C],
                damage: 0,
                text: 'Search your deck for Omanyte, Kabuto, or any Basic Pokémon and put as many of them as you like onto your Bench. Shuffle your deck afterward. Treat the new Benched Pokémon as Basic Pokémon.'
            },
            {
                name: 'Bind',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Omanyte';
        this.fullName = 'Omanyte SS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const slots = (0, prefabs_1.GET_PLAYER_BENCH_SLOTS)(effect.player);
            if (slots.length === 0) {
                return state;
            }
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if ((card instanceof pokemon_card_1.PokemonCard && (card.name === 'Omanyte' || card.name === 'Kabuto') ||
                    (card instanceof pokemon_card_1.PokemonCard && card.stage === card_types_1.Stage.BASIC))) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, {}, { min: 0, max: slots.length, blocked });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Omanyte = Omanyte;

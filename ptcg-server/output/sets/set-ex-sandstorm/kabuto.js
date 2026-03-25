"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kabuto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kabuto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mysterious Fossil';
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Exoskeleton',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Any damage done to Kabuto by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Team Assembly',
                cost: [C],
                damage: 0,
                text: 'Search your deck for Omanyte, Kabuto, or any Basic Pokémon and put as many of them as you like onto your Bench. Shuffle your deck afterward. Treat the new Benched Pokémon as Basic Pokémon.'
            },
            {
                name: 'Pierce',
                cost: [F, C],
                damage: 20,
                text: ''
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Kabuto';
        this.fullName = 'Kabuto SS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            if (state.phase === game_1.GamePhase.ATTACK) {
                effect.damage -= 20;
            }
        }
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
        return state;
    }
}
exports.Kabuto = Kabuto;

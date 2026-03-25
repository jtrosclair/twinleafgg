"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GengarVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GengarVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.evolvesFrom = 'Gengar V';
        this.cardType = D;
        this.hp = 320;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Fear and Panic',
                cost: [D, D],
                damage: 60,
                text: 'This attack does 60 damage for each of your opponent\'s Pokémon V and Pokémon-GX in play.'
            },
            {
                name: 'G-Max Swallow Up',
                cost: [D, D, D],
                damage: 250,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.set = 'FST';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.name = 'Gengar VMAX';
        this.fullName = 'Gengar VMAX FST';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const vPokemons = opponent.bench.filter(card => card instanceof pokemon_card_1.PokemonCard && card.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_GX));
            const vPokemons2 = opponent.active.getPokemons().filter(card => card.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_GX));
            const vPokes = vPokemons.length + vPokemons2.length;
            const damage = 60 * vPokes;
            effect.damage = damage;
        }
        // G-Max Swallow Up
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.GengarVMAX = GengarVMAX;

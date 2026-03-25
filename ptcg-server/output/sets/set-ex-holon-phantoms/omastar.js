"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Omastar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Omastar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Omanyte';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Bind',
                cost: [P, C],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Vengeful Spikes',
                cost: [P, C, C],
                damage: 30,
                text: 'Does 30 damage plus 10 more damage for each Omanyte, Omastar, Kabuto, Kabutops, and Kabutops ex in your discard pile. You can\'t add more than 60 damage in this way.'
            }];
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Omastar';
        this.fullName = 'Omastar HP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let pokemonCount = 0;
            player.discard.cards.forEach(c => {
                if (c.name === 'Omanyte' || c.name === 'Omastar' || c.name === 'Kabuto' || c.name === 'Kabutops' || c.name === 'Kabutops ex') {
                    pokemonCount += 1;
                }
            });
            const damageMod = Math.min(pokemonCount * 10, 60);
            effect.damage += damageMod;
        }
        return state;
    }
}
exports.Omastar = Omastar;

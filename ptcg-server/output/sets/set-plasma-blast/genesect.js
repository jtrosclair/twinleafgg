"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genesect = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Genesect extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for 2 Grass Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Jet Impact',
                cost: [G, G, C],
                damage: 80,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '10';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Genesect';
        this.fullName = 'Genesect PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, { stage: card_types_1.Stage.BASIC, cardType: card_types_1.CardType.GRASS }, { max: 2 });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Genesect = Genesect;

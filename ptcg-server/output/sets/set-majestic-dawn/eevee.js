"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Eevee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F, value: +10 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for as many Eevee as you like and put them onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Lunge',
                cost: [C],
                damage: 20,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'MD';
        this.setNumber = '62';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eevee';
        this.fullName = 'Eevee MD';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Call for Pals
        // Ref: AGENTS-patterns.md (search deck for Pokemon onto bench)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const emptySlots = player.bench.filter(b => b.cards.length === 0).length;
            if (emptySlots > 0 && player.deck.cards.length > 0) {
                (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, { stage: card_types_1.Stage.BASIC, name: 'Eevee' }, { min: 0, max: emptySlots });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Eevee = Eevee;

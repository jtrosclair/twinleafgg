"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gumshoos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gumshoos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yungoos';
        this.cardType = C;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Identify',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Your opponent reveals their hand. If you find a Pokémon there, this attack does 80 more damage.'
            },
            {
                name: 'Whap Down',
                cost: [C, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '113';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gumshoos';
        this.fullName = 'Gumshoos UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Identify
        // Ref: set-breakpoint/sigilyph.ts (Psy Report - SHOW_CARDS_TO_PLAYER)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Reveal opponent's hand
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, opponent.hand.cards);
            // Check if opponent has any Pokemon in hand
            const hasPokemon = opponent.hand.cards.some(c => c.superType === card_types_1.SuperType.POKEMON);
            if (hasPokemon) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.Gumshoos = Gumshoos;

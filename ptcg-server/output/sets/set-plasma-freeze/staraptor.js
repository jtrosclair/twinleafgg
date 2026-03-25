"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staraptor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Staraptor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Staravia';
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Wing Attack',
                cost: [C, C, C],
                damage: 60,
                text: ''
            },
            {
                name: 'Strong Breeze',
                cost: [C, C, C, C],
                damage: 0,
                text: 'Your opponent shuffles the Defending Pokémon and all cards attached to it into his or her deck.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '97';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Staraptor';
        this.fullName = 'Staraptor PLF';
        this.usedStrongBreeze = false;
    }
    reduceEffect(store, state, effect) {
        // Attack 2: Strong Breeze - shuffle opponent's active and all attached into their deck
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedStrongBreeze = true;
        }
        // Execute after attack (so it doesn't interfere with attack resolution)
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedStrongBreeze) {
            this.usedStrongBreeze = false;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Move all cards from opponent's active to their deck
            const cardsToShuffle = opponent.active.cards.slice();
            cardsToShuffle.forEach(card => {
                opponent.active.moveCardTo(card, opponent.deck);
            });
            opponent.active.clearEffects();
            (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedStrongBreeze = false;
        }
        return state;
    }
}
exports.Staraptor = Staraptor;

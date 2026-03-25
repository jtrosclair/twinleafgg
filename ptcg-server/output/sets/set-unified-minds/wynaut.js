"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wynaut = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wynaut extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.retreat = [];
        this.PEPPY_PICK_MARKER = 'WYNAUT_UNM_PEPPY_PICK_MARKER';
        this.powers = [{
                name: 'Peppy Pick',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, choose a random card from your opponent\'s hand. Your opponent reveals that card and shuffles it into their deck. If you use this Ability, your turn ends.'
            }];
        this.set = 'UNM';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Wynaut';
        this.fullName = 'Wynaut UNM';
    }
    reduceEffect(store, state, effect) {
        // Ability: Peppy Pick
        // Refs: set-unbroken-bonds/happiny.ts (Playhouse Heal - once per turn + turn ends), set-unbroken-bonds/purugly.ts (random card from hand)
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.PEPPY_PICK_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result && opponent.hand.cards.length > 0) {
                    // Choose a random card from opponent's hand and shuffle into deck
                    const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                    const randomCard = opponent.hand.cards[randomIndex];
                    opponent.hand.moveCardTo(randomCard, opponent.deck);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                }
                // Turn ends regardless
                const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                store.reduceEffect(state, endTurnEffect);
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.PEPPY_PICK_MARKER, this);
        return state;
    }
}
exports.Wynaut = Wynaut;

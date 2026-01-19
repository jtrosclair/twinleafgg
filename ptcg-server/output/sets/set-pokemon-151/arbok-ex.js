"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arbokex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Arbokex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ekans';
        this.cardType = D;
        this.hp = 270;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Bind Down',
                cost: [D, D],
                damage: 70,
                text: ' During your opponent\'s next turn, the Defending Pokémon can\'t retreat. '
            },
            {
                name: 'Menacing Fangs',
                cost: [D, D, D],
                damage: 150,
                text: ' Your opponent discards 2 cards from their hand. '
            }];
        this.regulationMark = 'G';
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Arbok ex';
        this.fullName = 'Arbok ex MEW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length <= 2) {
                const cards = opponent.hand.cards;
                opponent.hand.moveCardsTo(cards, player.discard);
                return state;
            }
            store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: 2, max: 2, allowCancel: false }), selected => {
                const cards = selected || [];
                opponent.hand.moveCardsTo(cards, opponent.discard);
            });
            return state;
        }
        return state;
    }
}
exports.Arbokex = Arbokex;

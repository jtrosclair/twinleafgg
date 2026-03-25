"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purugly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Purugly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Glameow';
        this.cardType = C;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.OWN_THE_PLACE_MARKER = 'PURUGLY_UPR_OWN_THE_PLACE_MARKER';
        this.CLEAR_OWN_THE_PLACE_MARKER = 'PURUGLY_UPR_CLEAR_OWN_THE_PLACE_MARKER';
        this.attacks = [
            {
                name: 'Own the Place',
                cost: [C],
                damage: 20,
                text: 'If your opponent has a Stadium card in play, discard it. If you do, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
            },
            {
                name: 'Toss Aside',
                cost: [C, C, C],
                damage: 60,
                text: 'Discard random cards from your opponent\'s hand until they have 3 cards in their hand.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '109';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Purugly';
        this.fullName = 'Purugly UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Own the Place
        // Refs: set-burning-shadows/machamp-gx.ts (Bedrock Breaker - discard stadium), set-breakpoint/sigilyph.ts (Reflective Shield - prevent damage with markers)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                (0, attack_effects_2.DISCARD_A_STADIUM_CARD_IN_PLAY)(state);
                // Successfully discarded - add prevention markers
                player.active.marker.addMarker(this.OWN_THE_PLACE_MARKER, this);
                opponent.marker.addMarker(this.CLEAR_OWN_THE_PLACE_MARKER, this);
            }
        }
        // Prevent all effects of attacks including damage
        // Ref: set-crimson-invasion/regice.ts (Iceberg Shield - AbstractAttackEffect prevention)
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (!effect.target.marker.hasMarker(this.OWN_THE_PLACE_MARKER, this)) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const attacker = game_1.StateUtils.findOwner(state, effect.source);
            if (player === attacker) {
                return state;
            }
            effect.preventDefault = true;
        }
        // Cleanup at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_OWN_THE_PLACE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_OWN_THE_PLACE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                cardList.marker.removeMarker(this.OWN_THE_PLACE_MARKER, this);
            });
        }
        // Attack 2: Toss Aside
        // Ref: set-plasma-storm/giratina.ts (Shadow Claw - random discard from opponent hand)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            while (opponent.hand.cards.length > 3) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const cardToDiscard = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(cardToDiscard, opponent.discard);
            }
        }
        return state;
    }
}
exports.Purugly = Purugly;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Celebiex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Celebiex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Time Reversal',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Celebi ex from your hand onto your Bench, you may search your discard pile for a card, show it to your opponent, and put it on top of your deck.'
            }];
        this.attacks = [{
                name: 'Psychic Shield',
                cost: [P, C],
                damage: 30,
                text: 'Prevent all effects of attacks, including damage, done to Celebi ex by your opponent\'s Pokémon-ex during your opponent\'s next turn.'
            }];
        this.set = 'P2';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Celebi ex';
        this.fullName = 'Celebi ex P2';
        this.PSYCHIC_SHIELD_MARKER = 'PSYCHIC_SHIELD_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.discard.cards.length === 0) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, wantToUse => {
                if (wantToUse) {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                    const deckTop = new game_1.CardList();
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                        if (selected.length === 0)
                            return;
                        selected.forEach(card => {
                            store.log(state, game_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
                            (0, prefabs_1.MOVE_CARD_TO)(state, card, deckTop);
                        });
                        deckTop.moveToTopOfDestination(player.deck);
                        (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, selected);
                        (0, prefabs_1.ABILITY_USED)(player, this);
                    });
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.marker.addMarker(this.PSYCHIC_SHIELD_MARKER, this);
            (0, prefabs_1.ADD_MARKER)(this.PSYCHIC_SHIELD_MARKER, effect.opponent, this);
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.AbstractAttackEffect) && effect.target.getPokemonCard() === this && ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
            if (this.marker.hasMarker(this.PSYCHIC_SHIELD_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && (0, prefabs_1.HAS_MARKER)(this.PSYCHIC_SHIELD_MARKER, effect.player, this)) {
            (0, prefabs_1.REMOVE_MARKER)(this.PSYCHIC_SHIELD_MARKER, effect.player, this);
            this.marker.removeMarker(this.PSYCHIC_SHIELD_MARKER, this);
        }
        return state;
    }
}
exports.Celebiex = Celebiex;

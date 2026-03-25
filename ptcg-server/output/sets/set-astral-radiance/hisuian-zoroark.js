"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianZoroark = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HisuianZoroark extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hisuian Zorua';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Doom Curse',
                cost: [],
                damage: 0,
                text: 'At the end of your opponent\'s next turn, the Defending Pokémon will be Knocked Out.'
            },
            {
                name: 'Call Back',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'Put a card from your discard pile into your hand.'
            }
        ];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Hisuian Zoroark';
        this.fullName = 'Hisuian Zoroark ASR';
        // Two-phase KO marker: after Doom Curse, mark the opponent's active.
        // At end of opponent's next turn, transition to CLEAR marker.
        // At end of THAT same EndTurnEffect, KO the marked pokemon.
        // Ref: set-forbidden-light/aegislash.ts (Ticking Knock Out - 2-marker KO)
        this.DOOM_CURSE_MARKER = 'HISUIAN_ZOROARK_ASR_DOOM_CURSE_MARKER';
        this.CLEAR_DOOM_CURSE_MARKER = 'HISUIAN_ZOROARK_ASR_CLEAR_DOOM_CURSE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Doom Curse: mark opponent's active pokemon with doom marker
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DOOM_CURSE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            // Phase 2: CLEAR marker present on any pokemon → KO it
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.marker.hasMarker(this.CLEAR_DOOM_CURSE_MARKER, this)) {
                    const checkHp = new check_effects_1.CheckHpEffect(player, cardList);
                    store.reduceEffect(state, checkHp);
                    cardList.damage = checkHp.hp;
                    cardList.marker.removeMarker(this.DOOM_CURSE_MARKER, this);
                    cardList.marker.removeMarker(this.CLEAR_DOOM_CURSE_MARKER, this);
                }
            });
            // Phase 1: DOOM marker present → transition to CLEAR marker
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.marker.hasMarker(this.DOOM_CURSE_MARKER, this)
                    && !cardList.marker.hasMarker(this.CLEAR_DOOM_CURSE_MARKER, this)) {
                    cardList.marker.addMarker(this.CLEAR_DOOM_CURSE_MARKER, this);
                }
            });
        }
        // Call Back: put a card from discard pile into hand
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, effect.player, this, {}, { min: 1, max: 1, allowCancel: false }, this.attacks[1]);
        }
        return state;
    }
}
exports.HisuianZoroark = HisuianZoroark;

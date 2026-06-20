"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jynx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_3 = require("../../game/store/prefabs/prefabs");
class Jynx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Wicked Kiss',
                cost: [P],
                damage: 0,
                text: 'At the end of your opponent\'s next turn, discard the Defending Pokémon and all cards attached to it.',
            },
            {
                name: 'Psyshock',
                cost: [P, C],
                damage: 50,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.',
            }];
        this.set = 'M5';
        this.setNumber = '30';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jynx';
        this.fullName = 'Jynx M5';
        this.WICKED_MARKER = 'M5_JYNX_WICKED';
        this.CLEAR_WICKED_MARKER = 'M5_JYNX_CLEAR_WICKED';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-fates-collide/exploud.ts (Cacophony delayed discard — not KO)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.active.marker.addMarker(this.WICKED_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_WICKED_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_WICKED_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_WICKED_MARKER, this);
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.marker.hasMarker(this.WICKED_MARKER, this)) {
                    cardList.marker.removeMarker(this.WICKED_MARKER, this);
                    const pokemons = cardList.getPokemons();
                    const tools = [...cardList.tools];
                    const otherCards = cardList.cards.filter(card => !pokemons.includes(card) &&
                        !tools.includes(card));
                    if (pokemons.length > 0) {
                        (0, prefabs_2.MOVE_CARDS)(store, state, cardList, effect.player.discard, { cards: pokemons });
                    }
                    if (otherCards.length > 0) {
                        (0, prefabs_2.MOVE_CARDS)(store, state, cardList, effect.player.discard, { cards: otherCards });
                    }
                    for (const tool of tools) {
                        cardList.moveCardTo(tool, effect.player.discard);
                    }
                    cardList.clearEffects();
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_3.COIN_FLIP_PROMPT)(store, state, effect.player, heads => {
                if (heads) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Jynx = Jynx;

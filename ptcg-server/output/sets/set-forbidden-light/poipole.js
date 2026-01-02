"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poipole = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Poipole extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Spit Poison',
                cost: [C],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            },
            {
                name: 'Knockout Reviver',
                cost: [P, C],
                damage: 0,
                text: 'During your opponent\'s next turn, if this Pokémon is Knocked Out, your opponent can\'t take any Prize cards for it.'
            }
        ];
        this.set = 'FLI';
        this.name = 'Poipole';
        this.fullName = 'Poipole FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.ATTACK_EFFECT_KNOCKOUT_REVIVER_MARKER = 'ATTACK_EFFECT_KNOCKOUT_REVIVER_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Spit Poison
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
        }
        // Knockout Reviver
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            console.log('adding knockout reviver marker');
            effect.source.marker.addMarker(this.ATTACK_EFFECT_KNOCKOUT_REVIVER_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.BeginTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.ATTACK_EFFECT_KNOCKOUT_REVIVER_MARKER);
            });
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.marker.hasMarker(this.ATTACK_EFFECT_KNOCKOUT_REVIVER_MARKER)) {
            console.log('knockout reviver activated');
            effect.prizeCount = 0;
        }
        return state;
    }
}
exports.Poipole = Poipole;

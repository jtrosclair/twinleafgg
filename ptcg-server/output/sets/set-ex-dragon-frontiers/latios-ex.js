"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latiosex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Latiosex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES, card_types_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Link Wing',
                powerType: game_1.PowerType.POKEBODY,
                text: 'The Retreat Cost for each of your Latias, Latias ex, Latios, and Latios ex is 0.'
            }];
        this.attacks = [{
                name: 'Ice Barrier',
                cost: [W, C],
                damage: 30,
                text: 'Prevent all effects of an attack, including damage, done to Latios ex by your opponent\'s Pokémon-ex during your opponent\'s next turn.'
            },
            {
                name: 'Hydro Splash',
                cost: [W, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'DF';
        this.setNumber = '96';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Latios ex';
        this.fullName = 'Latios ex DF';
        this.ICE_BARRIER_MARKER = 'ICE_BARRIER_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            const active = effect.player.active.getPokemonCard();
            if (owner !== player || active === undefined) {
                return state;
            }
            let isLatiosexInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isLatiosexInPlay = true;
                }
            });
            if (!isLatiosexInPlay) {
                return state;
            }
            if (!prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this) && (active.name === 'Latios' || active.name === 'Latios ex' || active.name === 'Latias' || active.name === 'Latias ex')) {
                effect.cost = [];
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            this.marker.addMarker(this.ICE_BARRIER_MARKER, this);
            prefabs_1.ADD_MARKER(this.ICE_BARRIER_MARKER, effect.opponent, this);
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect) && effect.target.getPokemonCard() === this && ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
            if (this.marker.hasMarker(this.ICE_BARRIER_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.ICE_BARRIER_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.ICE_BARRIER_MARKER, effect.player, this);
            this.marker.removeMarker(this.ICE_BARRIER_MARKER, this);
        }
        return state;
    }
}
exports.Latiosex = Latiosex;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eeveeex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Eeveeex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Rainbow DNA',
                powerType: game_1.PowerType.ABILITY,
                text: 'You can play Pokemon ex that evolve from Eevee onto this Pokemon to evolve it. (You can\'t evolve this Pokemon during your first turn or during the turn you play it.)'
            }];
        this.attacks = [
            {
                name: 'Coruscating Quartz',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING],
                damage: 200,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Eevee ex';
        this.fullName = 'Eevee ex PRE';
    }
    reduceEffect(store, state, effect) {
        // Rainbow DNA - allow Pokemon that evolve from Eevee to be dragged onto this
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const slot = game_1.StateUtils.findPokemonSlot(state, this);
            if (!slot) {
                this.evolvesFromBase = [];
                return state;
            }
            let owner;
            try {
                owner = game_1.StateUtils.findOwner(state, slot);
            }
            catch (_a) {
                owner = undefined;
            }
            if (!owner) {
                this.evolvesFromBase = [];
                return state;
            }
            // First turn restriction
            // if (state.turn <= 2) {
            //   this.evolvesFromBase = [];
            //   return state;
            // }
            // Can't evolve during the turn this Pokemon was put into play
            // if (slot.pokemonPlayedTurn >= state.turn) {
            //   this.evolvesFromBase = [];
            //   return state;
            // }
            try {
                const stub = new game_effects_1.PowerEffect(owner, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
                this.evolvesFromBase = ['Eevee'];
            }
            catch (_b) {
                this.evolvesFromBase = [];
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Eeveeex = Eeveeex;

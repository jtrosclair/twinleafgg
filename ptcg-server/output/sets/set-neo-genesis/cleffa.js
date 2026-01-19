"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cleffa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Cleffa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.BABY];
        this.cardType = C;
        this.hp = 30;
        this.retreat = [];
        this.evolvesTo = ['Clefairy'];
        this.powers = [{
                name: 'Baby Rule',
                powerType: game_1.PowerType.BABY_RULE,
                text: 'If this Baby Pokémon is your Active Pokémon and your opponent tries to attack, your opponent flips a coin (before doing anything required in order to use that attack). If tails, your opponent\'s turn ends without an attack.'
            }];
        this.attacks = [{
                name: 'Eeeeeeek',
                cost: [C],
                damage: 0,
                text: 'Shuffle your hand into your deck, then draw 7 cards.'
            }];
        this.set = 'N1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Cleffa';
        this.fullName = 'Cleffa N1';
        this.BABY_MARKER = 'BABY_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Baby Rule effect
        if (effect instanceof game_effects_1.UseAttackEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.BABY_RULE,
                    text: ''
                }, this));
            }
            catch (_a) {
                return state;
            }
            // avoids recursion
            if ((0, prefabs_1.HAS_MARKER)(this.BABY_MARKER, effect.player)) {
                return state;
            }
            (0, prefabs_1.ADD_MARKER)(this.BABY_MARKER, effect.player, this);
            if (opponent.active.getPokemonCard() === this) {
                effect.preventDefault = true;
                (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                    if (!result) {
                        const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                        store.reduceEffect(state, endTurnEffect);
                    }
                    else {
                        const useAttackEffect = new game_effects_1.UseAttackEffect(player, effect.attack);
                        store.reduceEffect(state, useAttackEffect);
                    }
                });
            }
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.BABY_MARKER, this);
        // Eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeek
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck);
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            (0, prefabs_1.DRAW_CARDS)(player, 7);
        }
        return state;
    }
}
exports.Cleffa = Cleffa;
